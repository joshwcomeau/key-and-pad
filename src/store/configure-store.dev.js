import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { captureMiddleware } from 'redux-vcr.capture';
import { PersistHandler } from 'redux-vcr.persist';
import { RetrieveHandler, retrieveMiddleware } from 'redux-vcr.retrieve';
import { replayMiddleware, wrapReducer } from 'redux-vcr.replay';

import rootReducer from '../reducers';
import onboardingSaga from '../sagas/onboarding.saga';
import { firebaseAuth } from '../data/firebase';

import DevTools from '../components/DevTools';


export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const persister = new PersistHandler({ firebaseAuth });
  const retriever = new RetrieveHandler({ firebaseAuth });

  const middlewares = [
    sagaMiddleware,
    captureMiddleware({ dataHandler: persister }),
    retrieveMiddleware({ dataHandler: retriever }),
    replayMiddleware(),
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
