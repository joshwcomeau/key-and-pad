// eslint-disable-next-line no-undef
const audioContext = new (AudioContext || webkitAudioContext)();

const oscillatorsMap = {};

export const playNote = ({ note, frequency }) => {
  // Layer a couple of oscillators
  const oscillator = audioContext.createOscillator();

  oscillator.type = 'square';
  oscillator.frequency.value = frequency;
  oscillator.connect(audioContext.destination);
  oscillator.start(0);

  oscillatorsMap[note] = oscillator;
};

export const stopNote = ({ note }) => {
  if (typeof oscillatorsMap[note] !== 'undefined') {
    oscillatorsMap[note].stop();
  }
};
