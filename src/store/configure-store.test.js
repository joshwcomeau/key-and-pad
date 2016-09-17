import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { wrapReducer } from 'redux-vcr';

import rootReducer from '../reducers';
import onboardingSaga from '../sagas/onboarding.saga';
import buildMiddlewareArray from '../utils/build-middleware-array';
import { completeOnboarding, setAdminMode } from '../actions';


export default function configureStore({ adminMode = true } = {}) {
  const reducer = adminMode ? wrapReducer(rootReducer) : rootReducer;

  const middlewares = buildMiddlewareArray({ adminMode });

  const sagaMiddleware = createSagaMiddleware();
  middlewares.push(sagaMiddleware);

  const store = createStore(
    reducer,
    applyMiddleware.apply(this, middlewares)
  );

  sagaMiddleware.run(onboardingSaga);

  if (adminMode) {
    store.dispatch(setAdminMode({ adminMode }));
    store.dispatch(completeOnboarding());
  }

  return store;
}
