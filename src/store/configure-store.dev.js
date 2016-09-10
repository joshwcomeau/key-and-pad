import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { wrapReducer } from 'redux-vcr';
import Perf from 'react-addons-perf';

import rootReducer from '../reducers';
import onboardingSaga from '../sagas/onboarding.saga';
import buildMiddlewareArray from '../utils/build-middleware-array';
import { getQueryParams } from '../utils/misc-helpers';
import { completeOnboarding, setAdminMode } from '../actions';
import { ONBOARDING_COMPLETED_FLAG } from '../data/app-constants';

import DevTools from '../components/DevTools';


window.Perf = Perf;

export default function configureStore() {
  // If we're in admin mode, we don't want to persist, we only want to record.
  let { adminMode } = getQueryParams();
  // convert string/undefined to boolean
  adminMode = adminMode === 'true';

  const reducer = adminMode ? wrapReducer(rootReducer) : rootReducer;

  const middlewares = buildMiddlewareArray({ adminMode });

  const sagaMiddleware = createSagaMiddleware();
  middlewares.push(sagaMiddleware);

  const store = createStore(
    reducer,
    compose(
      applyMiddleware.apply(this, middlewares),
      DevTools.instrument()
    )
  );

  sagaMiddleware.run(onboardingSaga);

  if (adminMode) {
    store.dispatch(setAdminMode({ adminMode }));
  }

  if (adminMode || localStorage.getItem(ONBOARDING_COMPLETED_FLAG)) {
    store.dispatch(completeOnboarding());
  }

  // Allow direct access to the store, for debugging/testing
  window.store = store;

  return store;
}
