import { createSelector } from 'reselect';
import effectDefaultOptions from '../data/effect-default-options';

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

function axisReducer(state, action) {
  switch (action.type) {
    case DEACTIVATE_EFFECTS: {
      return {
        ...state,
        active: false,
      };
    }

    case UPDATE_EFFECTS_AMOUNT: {
      return {
        ...state,
        active: true,
        amount: action.amount,
        cursorPosition: action.cursorPosition,
      };
    }

    case CHANGE_AXIS_EFFECT: {
      return {
        ...state,
        name: action.effect,
        options: effectDefaultOptions[action.effect],
      };
    }

    case TWEAK_AXIS_PARAMETER: {
      // TODO: Validate if this block is actually necessary?
      // // It's possible that this change affects a _different_ axis.
      // // In that case, we want to "ignore" it, and just return the state.
      // if (!action.options) { return state; }

      return {
        ...state,
        options: {
          ...state.options,
          ...action.options,
        },
      };
    }

    default: return state;
  }
}

const flattenAction = (action, axis) => ({
  type: action.type,
  ...action[axis],
});

export default function effectsReducer(state = initialState, action) {
  return {
    x: action.x
      ? axisReducer(state.x, flattenAction(action, 'x'))
      : state.x,
    y: action.y
      ? axisReducer(state.y, flattenAction(action, 'y'))
      : state.y,
  };
}


// Selectors
const axisName = (state, axis) => state.effects[axis].name;
const axisOptions = (state, axis) => state.effects[axis].options;

const otherAxisName = (state, axis) => {
  const otherAxis = axis === 'x' ? 'y' : 'x';
  return state.effects[otherAxis].name;
};

export const axisControlSelector = createSelector(
  [axisName, axisOptions],
  (name, options) => ({ name, options })
);

export const otherAxisNameSelector = createSelector(
  otherAxisName,
  name => name
);
