const initialState = {
  oscillators: [
    'triangle',
    'square',
  ],
  xAxis: {
    type: 'filter',
    options: {
      filterType: 'lowpass',
      resonance: 10
    }
  },
  yAxis: {
    type: 'distortion',
    options: {
      oversampling: '4x',
    },
  },
};


// ////////////////////////
// ACTION TYPES //////////
// //////////////////////
export const CHANGE_OSCILLATOR_WAVEFORM = 'SOUNDS/CHANGE_OSCILLATOR_WAVEFORM';
export const CHANGE_AXIS_EFFECT = 'SOUNDS/CHANGE_AXIS_EFFECT';
export const CHANGE_AXIS_OPTION = 'SOUNDS/CHANGE_AXIS_OPTION';


// ////////////////////////
// REDUCERS //////////////
// //////////////////////
export default function soundsReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_OSCILLATOR_WAVEFORM: {
      const { oscillatorIndex, waveform } = action;

      const nextOscillators = state.oscillators.slice();
      nextOscillators[oscillatorIndex] = waveform;

      return {
        ...state,
        oscillators: nextOscillators,
      };
    }

    default:
      return state;
  }
}


// ////////////////////////
// ACTION CREATORS ///////
// //////////////////////
export const changeOscillatorWaveform = ({ oscillatorIndex, waveform }) => ({
  type: CHANGE_OSCILLATOR_WAVEFORM,
  oscillatorIndex,
  waveform,
});
