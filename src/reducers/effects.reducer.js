import { combineReducers } from 'redux';
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
        cursorPosition: action.cursor,
      };
    }

    case CHANGE_AXIS_EFFECT: {
      // It's possible that this change affects a _different_ axis.
      // In that case, we want to "ignore" it, and just return the state.
      if (!action.effect) { return state; }

      return {
        ...state,
        name: action.effect,
        options: effectDefaultOptions[action.effect],
      };
    }

    case TWEAK_AXIS_PARAMETER: {
      // It's possible that this change affects a _different_ axis.
      // In that case, we want to "ignore" it, and just return the state.
      if (!action.options) { return state; }

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

// We have an 'axis' reducer that handles all mutations for a given axis,
// but it's generic. These two specialized reducers simply format the
// data, and delegate to the generic one.
const xAxisReducer = (state = initialState.x, action) => (
  axisReducer(state, {
    type: action.type,
    ...action.x,
  })
);
const yAxisReducer = (state = initialState.y, action) => (
  axisReducer(state, {
    type: action.type,
    ...action.y,
  })
);

export default combineReducers({
  x: xAxisReducer,
  y: yAxisReducer,
});
