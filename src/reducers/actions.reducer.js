import { combineReducers } from 'redux';

import {
  CASETTE_ACTIONS_RECEIVE,
  INCREMENT_ACTIONS_PLAYED,
  STOP_CASETTE,
} from '../vcr-action-types';


function byIdReducer(state = {}, action) {
  switch (action.type) {
    case CASETTE_ACTIONS_RECEIVE: return action.casetteActions;
    default: return state;
  }
}

function currentActionReducer(state = 0, action) {
  switch (action.type) {
    case INCREMENT_ACTIONS_PLAYED: return state + 1;
    case STOP_CASETTE: return 0;
    default: return state;
  }
}

export default combineReducers({
  byId: byIdReducer,
  currentAction: currentActionReducer,
});
