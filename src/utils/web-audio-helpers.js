/* eslint-disable no-mixed-operators */

const calculateDistortionCurve = (context, amount) => {
  const samples = context.sampleRate;
  const curve = new Float32Array(samples);
  const deg = Math.PI / 180;

  for (let i = 0; i < samples; i++) {
    const x = i * 2 / samples - 1;
    curve[i] = (amount + 3) * x * 20 * deg / (Math.PI + amount * Math.abs(x));
  }

  return curve;
}


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
}) => {
  const filterNode = context.createBiquadFilter();

  filterNode.Q.value = resonance;
  filterNode.connect(output);

  return filterNode;
};

export const createDistortionWithContext = context => ({
  amount = 0,
  oversample = '4x',
  output,
}) => {
  const distortionNode = context.createWaveShaper();

  distortionNode.updateCurve = amount => {
    distortionNode.curve = calculateDistortionCurve(context, amount);
  }

  distortionNode.oversample = oversample;
  distortionNode.connect(output);
  distortionNode.updateCurve();

  return distortionNode;
}

export const createDelayWithContext = context => ({ length, output }) => {
  const delayNode = context.createDelay(length);

  delayNode.connect(output);

  return delayNode;
}

export const getLogarithmicFrequencyValueWithContext = context => n => {
  // Where `n` is a value from 0 to 1, compute what the current frequency
  // should be, using a pleasant log scale.
  const [min, max] = [40, context.sampleRate / 2];

  const numOfOctaves = Math.log(max / min) / Math.LN2;
  const multiplier = Math.pow(2, numOfOctaves * (n - 1.0));

  return max * multiplier;
}

export const connectNodes = ({ source, destination }) => {
  source.disconnect();
  source.connect(destination);
}
