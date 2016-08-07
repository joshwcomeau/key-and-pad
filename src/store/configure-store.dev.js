import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers';
import onboardingSaga from '../sagas/onboarding.saga';
import vcrPersistMiddleware from '../middlewares/vcr-persist.middleware';
import vcrRetrieveMiddleware from '../middlewares/vcr-retrieve.middleware';
import wrapReducer from '../utils/wrap-reducer';

import DevTools from '../components/DevTools';


export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [
    sagaMiddleware,
    vcrPersistMiddleware,
    vcrRetrieveMiddleware,
  ];

  const store = createStore(
    wrapReducer(rootReducer),
    compose(
      applyMiddleware.apply(this, middlewares),
      DevTools.instrument()
    )
  );

  sagaMiddleware.run(onboardingSaga);

  // Allow direct access to the store, for debugging/testing
  window.store = store;

  return store;
}
