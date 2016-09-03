import { combineReducers } from 'redux';

import notes from './notes.reducer';
import oscillators from './oscillators.reducer';
import effects from './effects.reducer';
import onboarding from './onboarding.reducer';
import modal from './modal.reducer';


export default combineReducers({ notes, oscillators, effects, onboarding, modal });
