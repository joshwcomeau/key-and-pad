import { toFreq } from 'tonal-freq';
import Tuna from 'tunajs';
import invokeMap from 'lodash.invokemap';
import pick from 'lodash.pick';

import {
  fadeWithContext,
  createGainWithContext,
  createOscillatorWithContext,
  createFilterWithContext,
  createDistortionWithContext,
  createDelayWithContext,
  createReverbWithContext,
  createPhaserWithContext,
  getLogarithmicFrequencyValueWithContext,
  getOctaveMultiplier,
} from './web-audio-helpers';
import effectDefaultOptions from '../data/effect-default-options.js';


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

export const webAudioManagerFactory = context => {
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
  // Trying it out for phasers and delays, effects that are a pain to
  // create natively.
  const tuna = new Tuna(context);

  // All of our creation helpers can have the global audio context applied
  // early, to save us some typing.
  const createOscillator = createOscillatorWithContext(context);
  const createGain = createGainWithContext(context);
  const createFilter = createFilterWithContext(context);
  const createReverb = createReverbWithContext(context);
  const createDelay = createDelayWithContext(tuna);
  const createDistortion = createDistortionWithContext(context);
  const createPhaser = createPhaserWithContext(tuna);

  const fade = fadeWithContext(context);
  const getLogarithmicFrequencyValue = getLogarithmicFrequencyValueWithContext(context);

  // Create some effect nodes
  const effects = {
    filter: createFilter({
      ...effectDefaultOptions.filter,
      output: context.destination,
    }),
    reverb: createReverb({
      ...effectDefaultOptions.reverb,
      output: context.destination,
    }),
    delay: createDelay({
      ...effectDefaultOptions.delay,
      output: context.destination,
    }),
    distortion: createDistortion({
      ...effectDefaultOptions.distortion,
      output: context.destination,
    }),
    phaser: createPhaser({
      ...effectDefaultOptions.phaser,
      output: context.destination,
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
      // TODO: Look into whether I need to kill the gains created for each osc.
      activeOscillators.forEach(oscillatorArray => {
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

          const output = createGain({
            value: gain,
            output: masterOscillatorOutput,
          });

          const newOscillator = createOscillator({
            waveform,
            frequency: toFreq(value) * getOctaveMultiplier(octaveAdjustment),
            detune,
            output,
          });

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
      if (xEffect === yEffect) {
        masterOscillatorOutput.connect(xEffect.node);
        xEffect.connect(context.destination);
      } else {
        masterOscillatorOutput.connect(xEffect.node);
        xEffect.connect(yEffect.node);
        yEffect.connect(context.destination);
      }

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
          effects.filter.node.frequency.value = getLogarithmicFrequencyValue(amount);
          break;

        case 'reverb':
          effects.reverb.node.wet.value = amount;
          effects.reverb.node.dry.value = 1 - amount * 0.25;
          break;

        case 'delay':
          effects.delay.node.wetLevel = amount;
          effects.delay.node.dryLevel = 1 - amount * 0.25;
          break;

        case 'distortion':
          effects.distortion.amount = amount * 250;
          effects.distortion.updateCurve();
          break;

        case 'phaser':
          effects.phaser.node.depth = amount * 0.65;
          break;

        default:
          // Do nothing
      }
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
          effects.delay.node.feedback = options.feedback;
          effects.delay.node.delayTime = options.delayTime;
          effects.delay.node.cutoff = options.cutoff;
          break;

        case 'distortion':
          effects.distortion.clarity = options.clarity;
          effects.distortion.updateCurve();
          break;

        case 'phaser':
          effects.phaser.node.rate = options.rate;
          effects.phaser.node.feedback = options.feedback;
          effects.phaser.node.stereoPhase = options.stereoPhase;
          break;

        default: {
          // Do nothing
        }
      }
    },
  };
};

// Export a singleton by default, loaded up with our singleton audio context.
export default webAudioManagerFactory(audioContext);
