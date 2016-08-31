import effectDefaultOptions from '../data/effect-default-options.js';

import {
  DEACTIVATE_EFFECTS,
  UPDATE_EFFECTS_AMOUNT,
  CHANGE_AXIS_EFFECT,
  TWEAK_AXIS_PARAMETER,
} from '../actions';


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
            ...action.options,
          },
        },
      };
    }

    default:
      return state;
  }
}
