// eslint-disable-next-line no-unused-vars
import { combineReducers } from 'redux';

import notes from '../ducks/notes.duck';
import XYPad from '../ducks/x-y-pad.duck';
import sounds from '../ducks/sounds.duck';


export default combineReducers({ notes, XYPad, sounds });
