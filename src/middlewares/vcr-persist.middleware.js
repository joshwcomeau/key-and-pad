import uuid from 'node-uuid';

import vcrDataHandler from '../utils/vcr-data-handler';
import { getValues, getCurrentTime } from '../utils/vcr-helpers';
import * as vcrPlayerDuck from '../ducks/vcr-player.duck';


// Find all of the constants in our player duck, and ignore any of their
// actions. We don't want to record this stuff.
const ignoredActions = getValues(vcrPlayerDuck).filter(duckItem => (
  typeof duckItem === 'string'
));

let timeSinceLastEvent = getCurrentTime();
const casette = {
  // TODO: Allow for custom ID?
  id: uuid.v4(),
  actions: [],
};

// TODO: Make this configurable?
const minNumberOfActions = 4;


// eslint-disable-next-line no-unused-vars
const vcrPersistMiddleware = store => next => action => {
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

export default vcrPersistMiddleware;
