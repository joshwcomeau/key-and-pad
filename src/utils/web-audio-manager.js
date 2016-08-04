import { toFreq } from 'tonal-freq'
import invokeMap from 'lodash/invokemap';

import {
  fadeWithContext,
  createGainWithContext,
  createOscillatorWithContext,
  createFilterWithContext,
  createDistortionWithContext,
  createDelayWithContext,
  createReverbWithContext,
  getLogarithmicFrequencyValueWithContext,
  getDistortionOversample,
  getOctaveMultiplier,
} from './web-audio-helpers';
import effectDefaultOptions from '../data/effect-default-options.js';


// eslint-disable-next-line no-undef
const audioContext = new (AudioContext || webkitAudioContext)();

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
  // Store all currently-playing oscillators here.
  // Shape is:
  [
    // All oscillators corresponding to redux Oscillator I
    [
      // Each oscillator has the oscillator itself, and its own gain
      // Oscillators are monophonic, so there will be 1 oscillator per note.
      {
        oscillator: oscillatorNode,
        output: gainNode
      },
      {
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

  // All of our creation helpers can have the global audio context applied
  // early, to save us some typing.
  const createOscillator = createOscillatorWithContext(context);
  const createGain = createGainWithContext(context);
  const createFilter = createFilterWithContext(context);
  const createDelay = createDelayWithContext(context);
  const createReverb = createReverbWithContext(context);
  const createDistortion = createDistortionWithContext(context);

  const fade = fadeWithContext(context);
  const getLogarithmicFrequencyValue = getLogarithmicFrequencyValueWithContext(context);

  // Create some effect nodes
  const effects = {
    filter: createFilter({
      ...effectDefaultOptions.filter,
      output: context.destination,
    }),
    distortion: createDistortion({
      ...effectDefaultOptions.distortion,
      oversample: getDistortionOversample(effectDefaultOptions.distortion),
      output: context.destination,
    }),
    delay: createDelay({
      ...effectDefaultOptions.delay,
      output: context.destination,
    }),
    reverb: createReverb({
      ...effectDefaultOptions.reverb,
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
    initialize({ oscillators, effects }) {
      // When the app is initialized, we pass it the default state of the redux
      // store. Use that to build our initial oscillators and effects.

    },

    stopAllOscillators() {
      // TODO: Look into whether I need to kill the gains created for each osc.
      activeOscillators.forEach(oscillatorArray => {
        oscillatorArray.forEach(({ oscillator, output }) => {
          // Add a brief release, to avoid clipping
          fade({
            direction: 'out',
            output,
            oscillator,
          })
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
            output: output
          });
        });
      });

      return this;
    },

    updateOscillators({ notes, oscillators, effects }) {
      notes.forEach(({ value }) => {
        oscillators.forEach(({ gain, detune, octaveAdjustment }, index) => {
          const activeOscillator = activeOscillators[index].find(osc => (
            osc.noteValue === value
          ));

          const { oscillator, output } = activeOscillator;

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

    destroyEffectChain({ rerouteOscillators = false } = {}) {
      // We don't actually need to destroy anything, we just need to
      // disconnect all audio. This will render the output silent,
      // so a new effect chain should be rebuilt ASAP.
      invokeMap(effects, 'disconnect');
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

    updateEffectAmount({ axis, effect }) {
      const { name, amount } = effect;

      // `amount` will be a number from 0 to 1.
      // Each effect will have its own way of mapping that value to one that
      // makes sense.
      switch (name) {
        case 'filter': {
          effects.filter.node.frequency.value = getLogarithmicFrequencyValue(amount);
          break;
        }
        case 'distortion': {
          effects.distortion.updateCurve(amount * 250);
          break;
        }
        case 'delay': {
          effects.delay.node.delayTime.value = amount * 10;
          break;
        }
        case 'reverb': {
          effects.reverb.node.wet.value = amount;
          effects.reverb.node.dry.value = 1 - amount * 0.25;
          console.log('wet', effects.reverb.node.wet.value)
          console.log('dry', effects.reverb.node.dry)
          break;
        }
        default: {
          // Do nothing
        }
      }
    },

    updateEffectParameters({ name, options }) {
      switch (name) {
        case 'filter': {
          effects.filter.node.type = options.filterType;
          effects.filter.node.Q.value = options.resonance;
          break;
        }

        case 'distortion':
          effects.distortion.node.oversample = getDistortionOversample(options);
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


// EFFECTS
// const filter = createFilter({
//   type: 'lowpass',
//   resonance: 10,
//   output: audioContext.destination,
// });
//
// const distortion = createDistortion({
//   oversample: '4x',
//   amount: 100,
//   output: audioContext.destination,
// });
//
// const delay = createDelay({
//   length: 2,
//   output: audioContext.destination,
// })
//
//
// let xEffect = null;
// let yEffect = null;


// const masterOutput = createGain({ value: 1, output: audioContext.destination });


// export const playNote = ({ note, frequency, waveforms }) => {
//   const [waveform1, waveform2] = waveforms;
//
//   // Layer a couple of oscillators
//   const oscillator1 = createOscillator({
//     waveform: waveform1,
//     frequency: frequency / 2,
//     output: createGain({
//       value: 0.15,
//       output: masterOutput,
//     }),
//   });
//
//   const oscillator2 = createOscillator({
//     waveform: waveform2,
//     frequency,
//     output: createGain({
//       value: 0.5,
//       output: masterOutput,
//     }),
//   });
//
//   oscillatorsMap[note] = [oscillator1, oscillator2];
// };
//
// export const stopNote = ({ note }) => {
//   if (typeof oscillatorsMap[note] !== 'undefined') {
//     oscillatorsMap[note].forEach(osc => osc.stop());
//   }
// };
//
// export const updatePadCoordinates = ({ x, y }) => {
//   // The routing goes like this:
//   // masterOutput -> xEffect -> yEffect -> audioContext.destination.
//
//   // Start by ensuring it's routed to the filter
//   connectNodes({
//     source: masterOutput,
//     destination: xEffect,
//   });
//   connectNodes({
//     source: xEffect,
//     destination: yEffect,
//   });
//
//   connectNodes({
//     source: yEffect,
//     destination: audioContext.destination,
//   });
//
//   // Next, get the frequency and set it.
//   const frequency = getLogarithmicFrequencyValue(x);
//
//   filter.frequency.value = frequency;
//   distortion.updateCurve(y * 250)
// };
//
// export const removeEffects = () => {
//   connectNodes({
//     source: masterOutput,
//     destination: audioContext.destination,
//   });
// };
//
// export const updateOscillators = ({ oscillatorIndex, waveform }) => {
//   const notesPlayed = Object.keys(oscillatorsMap);
//
//   notesPlayed.forEach(note => {
//     const oscillatorsAtNote = oscillatorsMap[note];
//     oscillatorsAtNote[oscillatorIndex].type = waveform;
//   })
// };
//
// export const changeEffect = ({ axis, effect }) => {
//   // We want to update our routing to route through whatever option we've selected.
// }
