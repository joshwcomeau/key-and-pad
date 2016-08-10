import effectDefaultOptions from '../data/effect-default-options.js';

const initialState = {
  x: {
    name: 'filter',
    active: false,
    amount: 0,
    cursorPosition: 0,
    options: effectDefaultOptions.filter,
  },
  y: {
    name: 'distortion',
    active: false,
    amount: 0,
    cursorPosition: 0,
    options: effectDefaultOptions.distortion,
  },
};


// ////////////////////////
// ACTION TYPES //////////
// //////////////////////
export const DEACTIVATE_EFFECTS = 'EFFECTS/DEACTIVATE_EFFECTS';
export const UPDATE_EFFECTS_AMOUNT = 'EFFECTS/UPDATE_EFFECTS_AMOUNT';
export const CHANGE_AXIS_EFFECT = 'SOUNDS/CHANGE_AXIS_EFFECT';
export const TWEAK_AXIS_PARAMETER = 'SOUNDS/TWEAK_AXIS_PARAMETER';


// ////////////////////////
// REDUCERS //////////////
// //////////////////////
export default function soundsReducer(state = initialState, action) {
  switch (action.type) {
    case DEACTIVATE_EFFECTS: {
      return {
        x: {
          ...state.x,
          active: false,
        },
        y: {
          ...state.y,
          active: false,
        },
      };
    }

    case UPDATE_EFFECTS_AMOUNT: {
      return {
        x: {
          ...state.x,
          active: true,
          amount: action.xAmount,
          cursorPosition: action.xCursor,
        },
        y: {
          ...state.y,
          active: true,
          amount: action.yAmount,
          cursorPosition: action.yCursor,
        },
      };
    }

    case CHANGE_AXIS_EFFECT: {
      return {
        ...state,
        [action.axis]: {
          ...state[action.axis],
          name: action.effect,
          options: effectDefaultOptions[action.effect],
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
export const deactivateEffects = () => ({
  type: DEACTIVATE_EFFECTS,
});

export const updateEffectsAmount = ({
  xAmount,
  yAmount,
  xCursor,
  yCursor,
}) => ({
  type: UPDATE_EFFECTS_AMOUNT,
  xAmount,
  yAmount,
  xCursor,
  yCursor,
});

export const changeAxisEffect = ({ axis, effect }) => ({
  type: CHANGE_AXIS_EFFECT,
  axis,
  effect,
});

export const tweakAxisParameter = ({ axis, options }) => ({
  type: TWEAK_AXIS_PARAMETER,
  axis,
  options,
});
