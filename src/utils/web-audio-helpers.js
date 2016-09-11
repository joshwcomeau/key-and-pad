/* eslint-disable no-mixed-operators */
import soundbankReverb from 'soundbank-reverb';


const calculateDistortionCurve = (context, amount, clarity) => {
  const samples = 1000;
  const curve = new Float32Array(samples);
  const deg = Math.PI / 180;

  for (let i = 0; i < samples; i++) {
    const x = i * 2 / samples - 1;
    curve[i] = (amount + 3) * x * 20 * deg / (Math.PI + amount * Math.abs(x) * clarity);
  }

  return curve;
};


export const createGainWithContext = context => ({ value, output }) => {
  const gainNode = context.createGain();
  gainNode.gain.value = value;
  gainNode.connect(output);

  return gainNode;
};

export const createOscillatorWithContext = context => ({
  frequency,
  waveform,
  output,
  detune = 0,
}) => {
  const oscillatorNode = context.createOscillator();

  oscillatorNode.type = waveform;
  oscillatorNode.frequency.value = frequency;
  oscillatorNode.detune.value = detune;
  oscillatorNode.connect(output);

  return oscillatorNode;
};

export const fadeWithContext = context => ({
  direction, output, oscillator, maxAmplitude = 1, duration = 0.02,
}) => {
  const now = context.currentTime;
  const end = now + duration;
  output.gain.cancelScheduledValues(now);

  if (direction === 'in') {
    output.gain.setValueAtTime(0, now);
    output.gain.linearRampToValueAtTime(maxAmplitude, end);
    oscillator.start(now);
  } else if (direction === 'out') {
    output.gain.setValueAtTime(output.gain.value, now);
    output.gain.linearRampToValueAtTime(0, end);
    oscillator.stop(end);
  }
};

export const createFilterWithContext = context => ({
  filterType,
  resonance = 0,
  output,
}) => {
  const filterNode = context.createBiquadFilter();

  filterNode.type = filterType;
  filterNode.Q.value = resonance;
  filterNode.connect(output);

  return {
    node: filterNode,
    sustain: false,
    connect(destination) { filterNode.connect(destination); },
    disconnect() { filterNode.disconnect(); },
  };
};

export const createDistortionWithContext = context => ({
  amount = 0,
  clarity = 1,
  output,
}) => {
  const distortionNode = context.createWaveShaper();

  // We also want to route the distortionNode through a compressor.
  // This is because distortion can get FUCKING LOUD, and I don't wish to
  // deafen users :)
  const compressorNode = context.createDynamicsCompressor();
  compressorNode.threshold.value = -20;
  compressorNode.knee.value = 0;
  compressorNode.ratio.value = 3;
  compressorNode.attack.value = 0;
  compressorNode.release.value = 0.25;

  compressorNode.connect(output);
  distortionNode.connect(compressorNode);

  return {
    node: distortionNode,
    sustain: false,
    amount,
    clarity,
    connect(destination) {
      compressorNode.connect(destination);
      distortionNode.connect(compressorNode);
    },
    disconnect() {
      compressorNode.disconnect();
      distortionNode.disconnect();
    },
    updateCurve() {
      // Lower clarities are louder, so we want to match our compressor to it.
      const newCompressorRatio = 3 + this.clarity * -2;
      compressorNode.ratio.value = newCompressorRatio;

      distortionNode.curve = calculateDistortionCurve(
        context,
        this.amount,
        this.clarity
      );
    },
  };
};

export const createDelayWithContext = context => ({ length, output }) => {
  const delayNode = context.createDelay(length);

  delayNode.connect(output);

  return {
    node: delayNode,
    sustain: true,
    connect(destination) { delayNode.connect(destination); },
    disconnect() { delayNode.disconnect(); },
  };
};

export const createReverbWithContext = context => ({ time, dry, wet, output }) => {
  const reverb = soundbankReverb(context);

  reverb.connect(output);

  reverb.time = time;
  reverb.dry.value = dry;
  reverb.wet.value = wet;

  return {
    node: reverb,
    sustain: true,
    connect(destination) { reverb.connect(destination); },
    disconnect() { reverb.disconnect(); },
  };
};

export const createPhaserWithContext = (context, tuna) => ({
  rate,
  feedback,
  stereoPhase,
  baseModulationFrequency,
  output,
}) => {
  const phaser = new tuna.Phaser({
    depth: 0, // this is the param we control with the XYPad
    rate,
    feedback,
    stereoPhase,
    baseModulationFrequency,
  });

  phaser.connect(output);

  return {
    node: phaser,
    sustain: false,
    connect(destination) { phaser.connect(destination); },
    disconnect() { phaser.disconnect(); },
  };
};

export const getLogarithmicFrequencyValueWithContext = context => n => {
  // Where `n` is a value from 0 to 1, compute what the current frequency
  // should be, using a pleasant log scale.
  const [min, max] = [40, context.sampleRate / 2];

  const numOfOctaves = Math.log(max / min) / Math.LN2;
  const multiplier = Math.pow(2, numOfOctaves * (n - 1.0));

  return max * multiplier;
};

/** getOctaveMultiplier
  Converts a +/- octave value (eg. +1, 0, -2) to a value that can be used
  to multiply the frequency to achieve that adjustment

  @example
    getOctaveMultiplier(0)  --> 1
  @example
    getOctaveMultiplier(2)  --> 4
  @example
    getOctaveMultiplier(-1) --> -2

  @param
    octaveAdjustment - number

  @returns
    number
*/
export const getOctaveMultiplier = octaveAdjustment => (
  Math.pow(2, octaveAdjustment)
);
