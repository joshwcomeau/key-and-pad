import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createCaptureMiddleware } from 'redux-vcr.capture';
import { createPersistHandler } from 'redux-vcr.persist';

import rootReducer from '../reducers';
import onboardingSaga from '../sagas/onboarding.saga';
import { firebaseAuth } from '../data/firebase';


export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const persistHandler = createPersistHandler({ firebaseAuth });

  const middlewares = [
    sagaMiddleware,
    createCaptureMiddleware({ persistHandler }),
  ];

  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware.apply(this, middlewares)
    )
  );

  sagaMiddleware.run(onboardingSaga);

  return store;
}
