import {
  createGainWithContext,
  createOscillatorWithContext
} from './web-audio-helpers';


// eslint-disable-next-line no-undef
const audioContext = new (AudioContext || webkitAudioContext)();

const oscillatorsMap = {};

// createGain/createOscillator are set up to be curried, so we can apply
// our singleton context and save some typing :)
const createGain = createGainWithContext(audioContext);
const createOscillator = createOscillatorWithContext(audioContext);

// Create a master output gain.
// This is useful so that we can target a filter on the overall sound, without
// needing to map through and update each oscillator individually.
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

  // Send both oscillators through a gainNode, so that we have

  oscillatorsMap[note] = [oscillator1, oscillator2];
};

export const stopNote = ({ note }) => {
  if (typeof oscillatorsMap[note] !== 'undefined') {
    oscillatorsMap[note].forEach(osc => osc.stop());
  }
};
