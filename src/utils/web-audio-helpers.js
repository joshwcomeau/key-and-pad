/* eslint-disable no-mixed-operators */
import soundbankReverb from 'soundbank-reverb';

import { calculateDistortionCurve } from './distortion-helpers';


/** chainAudio
  Recursive helper to chain a bunch of WebAudio nodes together.
*/
function chainAudio(...nodes) {
  const [source, destination] = nodes;

  if (destination) {
    source.connect(destination);
    chainAudio(...nodes.slice(1));
  }
}

// /////////////////////
// Node Factories /////
// ///////////////////
// A set of factories that create Web Audio nodes (or, third-party pseudo-
// nodes).
// ////////////////
export const createOscillatorWithContext = context => ({
  frequency,
  waveform,
  detune = 0,
}) => {
  const oscillatorNode = context.createOscillator();

  oscillatorNode.type = waveform;
  oscillatorNode.frequency.value = frequency;
  oscillatorNode.detune.value = detune;

  return oscillatorNode;
};

export const createGainWithContext = context => ({ value, output, outputChannels }) => {
  const gainNode = context.createGain();
  gainNode.gain.value = value;

  if (outputChannels) {
    gainNode.connect(output, ...outputChannels);
  } else {
    gainNode.connect(output);
  }

  return gainNode;
};

export const createFilter = ({
  context,
  filterType,
  resonance,
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

export const createReverb = ({
  context,
  time,
  cutoff,
  output,
}) => {
  const reverb = soundbankReverb(context);

  reverb.connect(output);

  reverb.time = time;
  reverb.cutoff.value = cutoff;

  return {
    node: reverb,
    sustain: true,
    connect(destination) { reverb.connect(destination); },
    disconnect() { reverb.disconnect(); },
  };
};

export const createDistortion = ({
  context,
  amount,
  clarity,
  output,
}) => {
  const distortionNode = context.createWaveShaper();

  // We want to route the distortionNode through a compressor.
  // This is because distortion can get FUCKING LOUD, and I don't wish to
  // deafen users :)
  const compressorNode = context.createDynamicsCompressor();
  compressorNode.threshold.value = -50;
  compressorNode.knee.value = 0;
  compressorNode.ratio.value = 18;
  compressorNode.attack.value = 0;
  compressorNode.release.value = 1;

  // Sadly, the compressor has no built-in make-up gain. We need one of those.
  const makeupGainNode = createGainWithContext(context)({
    value: 3,
    output,
  });

  chainAudio(distortionNode, compressorNode, makeupGainNode, output);

  return {
    amount,
    clarity,
    node: distortionNode,
    sustain: false,
    connect(destination) {
      makeupGainNode.connect(destination);
    },
    disconnect() {
      makeupGainNode.disconnect();
    },
    updateCurve() {
      distortionNode.curve = calculateDistortionCurve({
        amount: this.amount,
        clarity: this.clarity,
      });
    },
  };
};

// This generic factory creates Delay, Tremolo, Chorus, and WahWah nodes.
// These effects use Tuna, and the Tuna API is consistent enough between
// nodes for this to work.
export const createTunaNode = ({
  tuna,
  nodeType,
  sustain = false,
  output,
  ...nodeOptions,
}) => {
  const node = new tuna[nodeType](nodeOptions);

  node.connect(output);

  return {
    node,
    sustain,
    connect(destination) { node.connect(destination); },
    disconnect() { node.disconnect(); },
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
  oscillator, direction, output, maxAmplitude = 1, duration = 0.015,
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
export const getLogarithmicFrequencyValue = (context, n) => {
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
