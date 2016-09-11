export default {
  filter: {
    filterType: 'lowpass',
    resonance: 10,
  },
  reverb: {
    dry: 1,
    wet: 0,
    time: 3,
    cutoff: 20000,
  },
  delay: {
    feedback: 0.45,
    delayTime: 150,
    cutoff: 2000,
  },
  distortion: {
    clarity: 1,
  },
  phaser: {
    rate: 1.2,
    feedback: 0.4,
    stereoPhase: 30,
    baseModulationFrequency: 700,
  },
  tremolo: {
    intensity: 0.6,
    stereoPhase: 0,
  },
  wahWah: {
    automode: true,
    baseFrequency: 0.5,
    excursionOctaves: 2,
    sweep: 0.2,
    resonance: 10,
    sensitivity: 0.5,
  },
};
