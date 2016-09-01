import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createCaptureMiddleware } from 'redux-vcr.capture';
import { createPersistHandler } from 'redux-vcr.persist';
import { createRetrieveHandler, createRetrieveMiddleware } from 'redux-vcr.retrieve';
import { createReplayMiddleware, wrapReducer } from 'redux-vcr.replay';

import rootReducer from '../reducers';
import { completeOnboarding } from '../actions';
import onboardingSaga from '../sagas/onboarding.saga';
import { firebaseAuth } from '../data/firebase';
import { ONBOARDING_COMPLETED_FLAG } from '../data/app-constants';

import DevTools from '../components/DevTools';


export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();


  const persistHandler = createPersistHandler({ firebaseAuth, debounceLength: 500 });
  const retrieveHandler = createRetrieveHandler({ firebaseAuth });

  const middlewares = [
    sagaMiddleware,
    createCaptureMiddleware({ persistHandler }),
    createRetrieveMiddleware({ retrieveHandler, requiresAuth: false }),
    createReplayMiddleware({ maximumDelay: 100 }),
  ];

  const store = createStore(
    wrapReducer(rootReducer),
    compose(
      applyMiddleware.apply(this, middlewares),
      DevTools.instrument()
    )
  );

  sagaMiddleware.run(onboardingSaga);

  // If the user has already seen the onboarding, skip it.
  if (localStorage.getItem(ONBOARDING_COMPLETED_FLAG)) {
    store.dispatch(completeOnboarding());
  }
  // Allow direct access to the store, for debugging/testing
  window.store = store;

  return store;
}
