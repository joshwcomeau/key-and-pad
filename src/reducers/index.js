import { combineReducers } from 'redux';

import notes from '../ducks/notes.duck';
import oscillators from '../ducks/oscillators.duck';
import effects from '../ducks/effects.duck';


export default combineReducers({ notes, oscillators, effects });
