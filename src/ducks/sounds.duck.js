const initialState = {
  oscillators: [
    'triangle',
    'square',
  ],
  x: {
    effect: 'filter frequency',
    options: {
      filterType: 'lowpass',
      resonance: 10
    }
  },
  y: {
    effect: 'distortion',
    options: {
      oversampling: '4x',
    },
  },
};


// ////////////////////////
// ACTION TYPES //////////
// //////////////////////
export const WEB_AUDIO_INITIALIZATION = 'SOUNDS/WEB_AUDIO_INITIALIZATION';
export const CHANGE_OSCILLATOR_WAVEFORM = 'SOUNDS/CHANGE_OSCILLATOR_WAVEFORM';
export const CHANGE_AXIS_EFFECT = 'SOUNDS/CHANGE_AXIS_EFFECT';
export const TWEAK_AXIS_PARAMETER = 'SOUNDS/TWEAK_AXIS_PARAMETER';


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

    case CHANGE_AXIS_EFFECT: {
      return {
        ...state,
        [action.axis]: {
          ...state[action.axis],
          effect: action.effect
        }
      }
    }

    default:
      return state;
  }
}


// ////////////////////////
// ACTION CREATORS ///////
// //////////////////////
export const webAudioInitialization = () => ({
  type: WEB_AUDIO_INITIALIZATION,
});

export const changeOscillatorWaveform = ({ oscillatorIndex, waveform }) => ({
  type: CHANGE_OSCILLATOR_WAVEFORM,
  oscillatorIndex,
  waveform,
});

export const changeAxisEffect = ({ axis, effect }) => ({
  type: CHANGE_AXIS_EFFECT,
  axis,
  effect,
});
