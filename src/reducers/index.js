// eslint-disable-next-line no-unused-vars
import { combineReducers } from 'redux';

import notes from '../ducks/notes.duck';
import oscillators from '../ducks/oscillators.duck';
// TODO: remove these two:
import XYPad from '../ducks/x-y-pad.duck';
import sounds from '../ducks/sounds.duck';


export default combineReducers({ notes, oscillators, XYPad, sounds });
