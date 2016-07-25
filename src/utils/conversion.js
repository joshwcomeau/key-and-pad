import invert from 'lodash.invert';

const waveforms = {
  sine: 1,
  triangle: 2,
  square: 3,
  sawtooth: 4,
};

const waveformsByIds = invert(waveforms);

export const getWaveformName = id => waveformsByIds[id];
export const getWaveformId = name => waveforms[name];
