import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createCaptureMiddleware } from 'redux-vcr.capture';
import { PersistHandler } from 'redux-vcr.persist';
import { RetrieveHandler, createRetrieveMiddleware } from 'redux-vcr.retrieve';
import { createReplayMiddleware, wrapReducer } from 'redux-vcr.replay';

import rootReducer from '../reducers';
import onboardingSaga from '../sagas/onboarding.saga';
import { firebaseAuth } from '../data/firebase';


export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const persister = new PersistHandler({ firebaseAuth });
  const retriever = new RetrieveHandler({ firebaseAuth });

  const middlewares = [
    sagaMiddleware,
    createCaptureMiddleware({ dataHandler: persister }),
    createRetrieveMiddleware({ dataHandler: retriever, requiresAuth: false }),
    createReplayMiddleware(),
  ];

  const store = createStore(
    wrapReducer(rootReducer),
    compose(
      applyMiddleware.apply(null, middlewares)
    )
  );

  sagaMiddleware.run(onboardingSaga);

  return store;
}
