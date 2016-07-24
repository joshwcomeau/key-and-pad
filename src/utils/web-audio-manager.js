import {
  createGainWithContext,
  createOscillatorWithContext,
  createFilterWithContext,
  createDistortionWithContext,
  getLogarithmicFrequencyValueWithContext,
  connectNodes,
} from './web-audio-helpers';


// eslint-disable-next-line no-undef
const audioContext = new (AudioContext || webkitAudioContext)();

const oscillatorsMap = {};

// createGain/createOscillator are set up to be curried, so we can apply
// our singleton context and save some typing :)
const createGain = createGainWithContext(audioContext);
const createOscillator = createOscillatorWithContext(audioContext);
const createFilter = createFilterWithContext(audioContext);
const createDistortion = createDistortionWithContext(audioContext);
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
  resonance: 2,
  output: audioContext.destination,
});

const distortion = createDistortion({
  oversample: '4x',
  amount: 100,
  output: audioContext.destination,
});

// eslint-disable-next-line no-unused-vars
let xEffect = lowPassFilter;
// eslint-disable-next-line no-unused-vars
let yEffect = distortion;


const masterOutput = createGain({ value: 1, output: audioContext.destination });


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
  // The routing goes like this:
  // masterOutput -> xEffect -> yEffect -> audioContext.destination.

  // Start by ensuring it's routed to the filter
  connectNodes({
    source: masterOutput,
    destination: xEffect,
  });

  connectNodes({
    source: xEffect,
    destination: yEffect,
  });

  connectNodes({
    source: yEffect,
    destination: audioContext.destination,
  });

  // Next, get the frequency and set it.
  const frequency = getLogarithmicFrequencyValue(x);

  lowPassFilter.frequency.value = frequency;
  distortion.updateCurve(y * 250)


}

export const removeEffects = () => {
  connectNodes({
    source: masterOutput,
    destination: audioContext.destination,
  });
}
