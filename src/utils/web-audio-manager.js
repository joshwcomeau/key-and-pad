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
} from './web-audio-helpers';


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
  let activeOscillators = [];

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
  // TODO: Better way of setting default effect parameters.
  const effects = {
    filter: createFilter({
      type: 'lowpass',
      resonance: 5,
      output: context.destination,
    }),
    distortion: createDistortion({
      oversample: '4x',
      output: context.destination,
    }),
    delay: createDelay({
      length: 2,
      output: context.destination,
    }),
    reverb: createReverb({
      dry: 1,
      wet: 1,
      time: 3,
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
      activeOscillators.forEach(({ oscillator, output }) => {
        // Add a brief release, to avoid clipping
        fade({
          direction: 'out',
          output,
          oscillator,
        })
      });

      activeOscillators = [];

      return this;
    },

    createOscillators({ notes, oscillators }) {
      notes.forEach(({ value }) => {
        oscillators.forEach(({ waveform, gain, octaveAdjustment }) => {
          // TODO: Handle octaveAdjustment
          const output = createGain({
            value: gain,
            output: masterOscillatorOutput,
          });

          const newOscillator = createOscillator({
            waveform,
            frequency: toFreq(value),
            output,
          });

          // Add a brief fade-in to avoid clipping.
          fade({
            direction: 'in',
            output,
            oscillator: newOscillator,
            maxAmplitude: gain,
          });

          activeOscillators.push({
            oscillator: newOscillator,
            output: output
          });
        });
      });

      return this;
    },

    destroyEffectChain({ rerouteOscillators = false } = {}) {
      // We don't actually need to destroy anything, we just need to
      // disconnect all audio. This will render the output silent,
      // so a new effect chain should be rebuilt ASAP.
      invokeMap([...effects, masterOscillatorOutput], 'disconnect');

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
        masterOscillatorOutput.connect(xEffect);
        xEffect.connect(context.destination);
      } else {
        masterOscillatorOutput.connect(xEffect);
        xEffect.connect(yEffect);
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
          return effects.filter.frequency.value = getLogarithmicFrequencyValue(amount)
        }
        case 'distortion': {
          return effects.distortion.updateCurve(amount * 250);
        }
        case 'delay': {
          return effects.delay.delayTime.value = amount * 10;
        }
        case 'reverb': {
          effects.reverb.wet.value = amount;
          effects.reverb.dry.value = -(amount*0.5);
          return;
        }
        default: {
          // Do nothing
        }
      }
    },

    updateEffectParameters({ axis, options }) {

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
