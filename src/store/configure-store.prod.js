import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createCaptureMiddleware } from 'redux-vcr.capture';
import { createPersistHandler } from 'redux-vcr.persist';
import { createRetrieveHandler, createRetrieveMiddleware } from 'redux-vcr.retrieve';
import { createReplayMiddleware, wrapReducer } from 'redux-vcr.replay';

import rootReducer from '../reducers';
import onboardingSaga from '../sagas/onboarding.saga';
import { firebaseAuth } from '../data/firebase';


export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const persistHandler = createPersistHandler({ firebaseAuth });
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
      applyMiddleware.apply(this, middlewares)
    )
  );

  sagaMiddleware.run(onboardingSaga);

  return store;
}
