import { toFreq } from 'tonal-freq';
import Tuna from 'tunajs';
import invokeMap from 'lodash.invokemap';
import pick from 'lodash.pick';

import {
  fadeWithContext,
  createGainWithContext,
  createOscillatorWithContext,
  createFilter,
  createReverb,
  createDistortion,
  createTunaNode,
  getLogarithmicFrequencyValue,
  getOctaveMultiplier,
} from './web-audio-helpers';
import effectDefaultOptions from '../data/effect-default-options';


// eslint-disable-next-line no-undef
const audioContext = new (window.AudioContext || window.webkitAudioContext)();


/* ROUTING

Web Audio is extremely modular, and I'd like to be able to support a wide
variety of effects.
All oscillators for all notes will be sent to a single master gain:

  Note 1 Osc1 --> gain -\
                         \
  Note 1 Osc2 --> gain -----> masterGain
                         /
  Note 2 Osc1 --> gain -/

This gain will then be routed through whichever effects are on.

  --------------  X effect ------------- Y effect -----------------------------

                  distortion         /-- delay --\
                                    /             \
  masterGain ---- low-pass filter -/     reverb    \----- final output

In the above example, the signal routes through a filter and a delay,
avoiding the other effects (distortion and reverb).
*/

export const webAudioManagerFactory = (context) => {
  /*
  Store all currently-playing oscillators here.
  Shape is:
  [
    // All oscillators corresponding to redux Oscillator I
    [
      // Each oscillator has the oscillator itself, and its own gain
      // Oscillators are monophonic, so there will be 1 oscillator per note.
      {
        // eg. this one is playing G4
        oscillator: oscillatorNode,
        output: gainNode
      },
      {
        // eg. this one is playing A4
        oscillator: oscillatorNode,
        output: gainNode
      }
    ], [
      // Same shape, but for redux Oscillator II
    ]
  ]
  */
  let activeOscillators = [
    [],
    [],
  ];

  // Tuna is a library for web audio effects.
  // Simple effects are done with the vanilla Web Audio API, but certain ones
  // (delay, chorus, etc) use Tuna, for simplicity.
  const tuna = new Tuna(context);

  const createOscillator = createOscillatorWithContext(context);
  const createGain = createGainWithContext(context);

  const fade = fadeWithContext(context);

  // Create some effect nodes
  const effects = {
    filter: createFilter({
      context,
      output: context.destination,
      ...effectDefaultOptions.filter,
    }),
    reverb: createReverb({
      context,
      output: context.destination,
      ...effectDefaultOptions.reverb,
    }),
    delay: createTunaNode({
      tuna,
      nodeType: 'Delay',
      sustain: true,
      output: context.destination,
      ...effectDefaultOptions.delay,
    }),
    distortion: createDistortion({
      context,
      output: context.destination,
      ...effectDefaultOptions.distortion,
    }),
    chorus: createTunaNode({
      tuna,
      nodeType: 'Chorus',
      output: context.destination,
      ...effectDefaultOptions.chorus,
    }),
    tremolo: createTunaNode({
      tuna,
      nodeType: 'Tremolo',
      output: context.destination,
      ...effectDefaultOptions.tremolo,
    }),
    wahWah: createTunaNode({
      tuna,
      nodeType: 'WahWah',
      output: context.destination,
      ...effectDefaultOptions.wahWah,
    }),
  };

  // Create our master oscillator output. All oscillators are routed through
  // it, so that their collective destination can be changed without needing
  // to update each one individually.
  const masterOscillatorOutput = createGain({
    value: 1,
    output: context.destination,
  });

  // return the WebAudioManager itself.
  return {
    stopAllOscillators() {
      activeOscillators.forEach((oscillatorArray) => {
        oscillatorArray.forEach(({ oscillator, output }) => {
          // Add a brief release, to avoid clipping
          fade({
            direction: 'out',
            output,
            oscillator,
          });
        });

        activeOscillators = [
          [],
          [],
        ];
      });

      return this;
    },

    createOscillators({ notes, oscillators }) {
      notes.forEach(({ value }) => {
        oscillators.forEach((oscillator, index) => {
          const { waveform, gain, detune, octaveAdjustment } = oscillator;

          // Oscillators are monophonic, but we want to use stereo effects.
          // We need to create a channel merger node, and merge 2 identical
          // gain nodes. Bit of a rigamarole, but it works.
          const merger = context.createChannelMerger(2);

          const gainL = createGain({
            value: 1,
            output: merger,
            outputChannels: [0, 0],
          });
          const gainR = createGain({
            value: 1,
            output: merger,
            outputChannels: [0, 1],
          });

          const output = createGain({
            value: gain,
            output: masterOscillatorOutput,
          });

          merger.connect(output);


          const newOscillator = createOscillator({
            waveform,
            frequency: toFreq(value) * getOctaveMultiplier(octaveAdjustment),
            detune,
          });

          newOscillator.connect(gainL);
          newOscillator.connect(gainR);

          // Add a brief fade-in to avoid clipping.
          fade({
            direction: 'in',
            output,
            oscillator: newOscillator,
            maxAmplitude: gain,
          });

          activeOscillators[index].push({
            oscillator: newOscillator,
            noteValue: value,
            output,
          });
        });
      });

      return this;
    },

    updateOscillators({ notes, oscillators }) {
      notes.forEach(({ value }) => {
        oscillators.forEach(({ waveform, gain, detune, octaveAdjustment }, index) => {
          const activeOscillator = activeOscillators[index].find(osc => (
            osc.noteValue === value
          ));

          const { oscillator, output } = activeOscillator;

          oscillator.type = waveform;

          oscillator.detune.value = detune;
          oscillator.frequency.value = toFreq(value) * getOctaveMultiplier(octaveAdjustment);

          // If the gain value changes, we actually need to destroy and
          // rebuild it, otherwise it doesn't take effect until the next
          // note change.
          if (output.gain.value !== gain) {
            activeOscillator.output = createGain({
              value: gain,
              output: masterOscillatorOutput,
            });
            oscillator.disconnect();
            oscillator.connect(activeOscillator.output);

            // disconnect the old `output`, so that it can be collected
            output.disconnect();
          }
        });
      });

      return this;
    },

    destroyEffectChain({ rerouteOscillators = false, softRelease = false } = {}) {
      const effectsToDisconnect = softRelease
        ? pick(effects, { sustain: false })
        : effects;

      // We don't actually need to destroy anything, we just need to
      // disconnect all audio. This will render the output silent,
      // so a new effect chain should be rebuilt ASAP.
      invokeMap(effectsToDisconnect, 'disconnect');
      masterOscillatorOutput.disconnect();

      // If we are releasing the effects, point our masterOscillatorOutput
      // to the context's default destination.
      if (rerouteOscillators) {
        masterOscillatorOutput.connect(context.destination);
      }

      return this;
    },

    rebuildEffectChain({ x, y }) {
      // As it stands, the routing should always be as follows:
      // masterOscillatorOutput -> x -> y -> context.destination.
      const xEffect = effects[x.name];
      const yEffect = effects[y.name];

      // IF both axes are part of the same effect (eg. filter res/freq),
      // then obviously it is just routed through one effect.
      masterOscillatorOutput.connect(xEffect.node);
      xEffect.connect(yEffect.node);
      yEffect.connect(context.destination);

      return this;
    },

    updateEffectAmount({ effect }) {
      // While this method could be "rolled into" updateEffectParameters,
      // I like having the value that the X/Y pad controls distinct. We want
      // this method to be as lean as possible, since it happens many times
      // a second.

      const { name, amount } = effect;

      // `amount` will be a number from 0 to 1.
      // Each effect will have its own way of mapping that value to one that
      // makes sense.
      switch (name) {
        case 'filter':
          effects.filter.node.frequency.value = getLogarithmicFrequencyValue(context, amount);
          break;

        case 'reverb':
          effects.reverb.node.wet.value = amount;
          effects.reverb.node.dry.value = 1 - amount * 0.25;
          break;

        case 'delay':
          effects.delay.node.feedback = amount * 0.95;
          break;

        case 'distortion':
          effects.distortion.amount = amount * 250;
          effects.distortion.updateCurve();
          break;

        case 'chorus':
          effects.chorus.node.feedback = amount;
          break;

        case 'tremolo':
          effects.tremolo.node.rate = amount * 8;
          break;

        case 'wahWah':
          effects.wahWah.node.baseFrequency = amount;
          break;

        default:
          // Do nothing
      }

      return this;
    },

    updateEffectParameters({ name, options }) {
      switch (name) {
        case 'filter':
          effects.filter.node.type = options.filterType;
          effects.filter.node.Q.value = options.resonance;
          break;

        case 'reverb':
          effects.reverb.node.time = options.time;
          effects.reverb.node.cutoff.value = options.cutoff;
          break;

        case 'delay':
          effects.delay.node.delayTime = options.delayTime;
          effects.delay.node.cutoff = options.cutoff;
          break;

        case 'distortion':
          effects.distortion.clarity = options.clarity;
          effects.distortion.updateCurve();
          break;

        case 'chorus':
          effects.chorus.node.rate = options.rate;
          effects.chorus.node.delay = options.delay;
          break;

        case 'tremolo':
          effects.tremolo.node.intensity = options.intensity;
          effects.tremolo.node.stereoPhase = options.stereoPhase;
          break;

        case 'wahWah':
          effects.wahWah.node.excursionOctaves = options.excursionOctaves;
          break;

        default: {
          // Do nothing
        }
      }

      return this;
    },
  };
};

// Export a singleton by default, loaded up with our singleton audio context.
export default webAudioManagerFactory(audioContext);
