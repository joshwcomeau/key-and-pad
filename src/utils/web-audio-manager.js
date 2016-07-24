import {
  createGainWithContext,
  createOscillatorWithContext,
  createFilterWithContext,
  getLogarithmicFrequencyValueWithContext,
} from './web-audio-helpers';


// eslint-disable-next-line no-undef
const audioContext = new (AudioContext || webkitAudioContext)();

const oscillatorsMap = {};

// createGain/createOscillator are set up to be curried, so we can apply
// our singleton context and save some typing :)
const createGain = createGainWithContext(audioContext);
const createOscillator = createOscillatorWithContext(audioContext);
const createFilter = createFilterWithContext(audioContext);
const getLogarithmicFrequencyValue = getLogarithmicFrequencyValueWithContext(audioContext);

/*
ROUTING

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


// EFFECTS
const lowPassFilter = createFilter({
  type: 'lowpass',
  resonance: 0,
  output: audioContext.destination,
});

let xEffect = lowPassFilter;
// eslint-disable-next-line no-unused-vars
let yEffect; // TBD

const masterOutput = createGain({ value: 1, output: xEffect });



export const playNote = ({ note, frequency }) => {
  // Layer a couple of oscillators
  const oscillator1 = createOscillator({
    waveform: 'square',
    frequency: frequency / 2,
    output: createGain({
      value: 0.15,
      output: masterOutput,
    }),
  });
  const oscillator2 = createOscillator({
    waveform: 'triangle',
    frequency,
    output: createGain({
      value: 0.5,
      output: masterOutput,
    }),
  });

  oscillatorsMap[note] = [oscillator1, oscillator2];
};

export const stopNote = ({ note }) => {
  if (typeof oscillatorsMap[note] !== 'undefined') {
    oscillatorsMap[note].forEach(osc => osc.stop());
  }
};

export const updatePadCoordinates = ({ x, y }) => {
  // For now, we only work with X, and X is always a lowpass filter.
  const frequency = getLogarithmicFrequencyValue(x);

  console.log("Calculated frequency", frequency);

}
