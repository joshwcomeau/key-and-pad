export const createGainWithContext = context => ({ value, output }) => {
  const gainNode = context.createGain();
  gainNode.gain.value = value
  gainNode.connect(output);

  return gainNode
};

export const createOscillatorWithContext = context => ({
  frequency,
  waveform,
  output,
  detune = 0,
  startImmediately = true,
}) => {
  const oscillatorNode = context.createOscillator();

  oscillatorNode.type = waveform;
  oscillatorNode.frequency.value = frequency;
  oscillatorNode.detune.value = detune;
  oscillatorNode.connect(output);

  if (startImmediately) {
    oscillatorNode.start(0);
  }

  return oscillatorNode;
};

export const createFilterWithContext = context => ({
  type,
  resonance = 0,
  output,
  startImmediately = true,
}) => {
  const filterNode = context.createBiquadFilter();

  filterNode.Q.value = resonance;
  filterNode.connect(output);

  if (startImmediately) {
    filterNode.start(0);
  }

  return filterNode;
};
