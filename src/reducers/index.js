// eslint-disable-next-line no-unused-vars
import { combineReducers } from 'redux';

import keyboardReducer from '../ducks/keyboard.duck';
import XYPadReducer from '../ducks/x-y-pad.duck';
import soundsReducer from '../ducks/sounds.duck';


export default combineReducers({
  keyboard: keyboardReducer,
  XYPad: XYPadReducer,
  sounds: soundsReducer,
});
