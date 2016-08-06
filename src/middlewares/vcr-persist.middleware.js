import uuid from 'node-uuid';

import vcrDataHandler from '../utils/vcr-data-handler';

const ignoredActions = [
  'VCR_PLAYER/CASETTES_LIST_REQUEST',
  'VCR_PLAYER/CASETTES_LIST_RECEIVE',
  'VCR_PLAYER/CASETTES_LIST_FAILURE',
  'VCR_PLAYER/SELECT_CASETTE',
  'VCR_PLAYER/CASETTE_ACTIONS_RECEIVE',
  'VCR_PLAYER/PLAY',
]


// TODO: Make this configurable?
const minNumberOfActions = 4;

const vcrPersistMiddleware = store => {
  let timeSinceLastEvent = getCurrentTime();
  const casette = {
    // TODO: Allow for custom ID?
    id: uuid.v4(),
    actions: [],
  };

  return next => action => {
    // Ignore actions created by vcrRetrieve.
    // We don't need to enter an endless loop :)
    if (ignoredActions.includes(action.type)) {
      return next(action);
    }

    casette.actions.push({
      ...action,
      delay: getCurrentTime() - timeSinceLastEvent,
    });

    if (casette.actions.length >= minNumberOfActions) {
      vcrDataHandler.persist(casette);
    }

    timeSinceLastEvent = getCurrentTime();

    return next(action);
  };
};

export default vcrPersistMiddleware


function getCurrentTime() {
  // If performance.now is available, use that.
  if (window.performance && typeof window.performance.now === 'function') {
    return performance.now();
  }

  // TODO: Polyfill, or fallback to Date.now?
}
