import { combineReducers } from 'redux';
import { constructReducer } from '../utils/construct-reducer';

import {
  CASETTES_LIST_RECEIVE,
  EJECT_CASETTE,
  GO_TO_NEXT_CASETTE_PAGE,
  GO_TO_PREVIOUS_CASETTE_PAGE,
  HIDE_CASETTES,
  SELECT_CASETTE,
  VIEW_CASETTES,
} from '../vcr-action-types';


const casetteStatusReducer = constructReducer('idle', () => ({
  [VIEW_CASETTES]: 'selecting',
  [EJECT_CASETTE]: 'idle',
  [HIDE_CASETTES]: 'idle',
  [SELECT_CASETTE]: 'loaded',
}));

const selectedReducer = constructReducer(null, (state, action) => ({
  [SELECT_CASETTE]: action.id,
}));

const byIdReducer = constructReducer({}, (state, action) => ({
  [CASETTES_LIST_RECEIVE]: action.casettes,
}));

const pageNumberReducer = constructReducer(0, state => ({
  [GO_TO_NEXT_CASETTE_PAGE]: state + 1,
  [GO_TO_PREVIOUS_CASETTE_PAGE]: state - 1,
}));

const pageLimitReducer = constructReducer(5);

export default combineReducers({
  casetteStatus: casetteStatusReducer,
  selected: selectedReducer,
  byId: byIdReducer,
  page: combineReducers({
    number: pageNumberReducer,
    limit: pageLimitReducer,
  }),
});
