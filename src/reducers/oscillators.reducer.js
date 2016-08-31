import { UPDATE_OSCILLATOR } from '../actions';


const initialState = [
  {
    waveform: 'triangle',
    gain: 0.5,
    octaveAdjustment: 0,
    detune: 0,
  }, {
    waveform: 'square',
    gain: 0.15,
    octaveAdjustment: -1,
    detune: 0,
  },
];

export default function oscillatorsReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_OSCILLATOR: {
      return state.map((oscillator, index) => {
        if (action.index !== index) {
          return oscillator;
        }

        return {
          ...oscillator,
          ...action.options,
        };
      });
    }

    default:
      return state;
  }
}
