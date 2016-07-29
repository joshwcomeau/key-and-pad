const initialState = {
  x: {
    name: 'filter frequency',
    active: false,
    amount: 0,
    options: {
      filterType: 'lowpass',
      resonance: 10
    }
  },
  y: {
    name: 'distortion',
    active: false,
    amount: 0,
    options: {
      oversampling: '4x',
    },
  },
};


// ////////////////////////
// ACTION TYPES //////////
// //////////////////////
export const TOGGLE_EFFECTS = 'EFFECTS/TOGGLE_EFFECTS';
export const UPDATE_EFFECTS_AMOUNT = 'EFFECTS/UPDATE_EFFECTS_AMOUNT';
export const CHANGE_AXIS_EFFECT = 'SOUNDS/CHANGE_AXIS_EFFECT';
export const TWEAK_AXIS_PARAMETER = 'SOUNDS/TWEAK_AXIS_PARAMETER';


// ////////////////////////
// REDUCERS //////////////
// //////////////////////
export default function soundsReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_EFFECTS: {
      return {
        x: {
          ...state.x,
          active: action.isActive,
        },
        y: {
          ...state.y,
          active: action.isActive,
        },
      };
    }

    case UPDATE_EFFECTS_AMOUNT: {
      return {
        x: {
          ...state.x,
          amount: action.xAmount,
        },
        y: {
          ...state.y,
          amount: action.yAmount,
        },
      };
    }

    case CHANGE_AXIS_EFFECT: {
      return {
        ...state,
        [action.axis]: {
          ...state[action.axis],
          effect: action.effect,
        },
      };
    }

    case TWEAK_AXIS_PARAMETER: {
      return {
        ...state,
        [action.axis]: {
          ...state[action.axis],
          options: {
            ...state[action.axis].options,
            ...action.options
          }
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
export const toggleEffects = ({ isActive }) => ({
  type: TOGGLE_EFFECTS,
  isActive,
});

export const updateEffectsAmount = ({ yAmount, xAmount }) => ({
  type: UPDATE_EFFECTS_AMOUNT,
  yAmount,
  xAmount,
});

export const changeAxisEffect = ({ axis, effect }) => ({
  type: CHANGE_AXIS_EFFECT,
  axis,
  effect,
});

export const tweakAxisParameter = ({ axis, options }) => ({
  type: UPDATE_EFFECTS_AMOUNT,
  axis,
  options,
});
