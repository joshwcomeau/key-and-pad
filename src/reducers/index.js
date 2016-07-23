// eslint-disable-next-line no-unused-vars
import { combineReducers } from 'redux';

import keyboardReducer from '../ducks/keyboard.duck';


export default combineReducers({
  keyboard: keyboardReducer,
});
