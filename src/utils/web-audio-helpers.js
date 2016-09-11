/* eslint-disable no-mixed-operators */
import soundbankReverb from 'soundbank-reverb';

import { calculateDistortionCurve } from './distortion-helpers';


// /////////////////////
// Node Factories /////
// ///////////////////
// A set of factories that create Web Audio nodes (or, third-party pseudo-
// nodes). Can be preloaded with the relevant context.
// ////////////////
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

export const createGainWithContext = context => ({ value, output }) => {
  const gainNode = context.createGain();
  gainNode.gain.value = value;
  gainNode.connect(output);

  return gainNode;
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

export const createDelayWithContext = tuna => ({
  feedback,
  delayTime,
  cutoff,
  output,
}) => {
  const delayNode = new tuna.Delay({
    feedback,
    delayTime,
    cutoff,
    wetLevel: 0,
    dryLevel: 1,
  });

  delayNode.connect(output);

  return {
    node: delayNode,
    sustain: true,
    connect(destination) { delayNode.connect(destination); },
    disconnect() { delayNode.disconnect(); },
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

      distortionNode.curve = calculateDistortionCurve({
        amount: this.amount,
        clarity: this.clarity,
      });
    },
  };
};

export const createPhaserWithContext = tuna => ({
  rate,
  feedback,
  stereoPhase,
  baseModulationFrequency,
  output,
}) => {
  const phaserNode = new tuna.Phaser({
    depth: 0, // this is the param we control with the XYPad
    rate,
    feedback,
    stereoPhase,
    baseModulationFrequency,
  });

  phaserNode.connect(output);

  return {
    node: phaserNode,
    sustain: false,
    connect(destination) { phaserNode.connect(destination); },
    disconnect() { phaserNode.disconnect(); },
  };
};


// /////////////////////
// Misc Utilities /////
// ///////////////////

/** fadeWithContext
  Fade in or out a specified oscillator. Useful to avoid clipping.
  @param {object} context - curried, used to fetch time
  @param {object} oscillator - The oscillator to apply the fade to
  @param {string} direction - either `in` or `out`
  @param {object} output - The destination gain node
  @param {number} maxAmplitude - For fading in, the amplitude to fade to.
  @param {number} duration - the length of the fade, in seconds.
*/
export const fadeWithContext = context => ({
  oscillator, direction, output, maxAmplitude = 1, duration = 0.02,
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

/** getLogarithmicFrequencyValueWithContext
  Allow for a non-linear frequency distribution, used for getting a
  suitable cutoff frequency with a linear input (X/Y Pad).
  @param {object} context - curried, used to fetch sampleRate
  @param {object} n - the number to calculate a frequency for, from 0 to 1.
                      Will transform it into a number between 40 and
                      ~22,000 (half of the sample rate)
  @returns the transformed frequency value.
*/
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
