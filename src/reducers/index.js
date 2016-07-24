// eslint-disable-next-line no-unused-vars
import { combineReducers } from 'redux';

import keyboardReducer from '../ducks/keyboard.duck';
import XYPadReducer from '../ducks/x-y-pad.duck';


export default combineReducers({
  keyboard: keyboardReducer,
  XYPad: XYPadReducer,
});
