import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers';
import onboardingSaga from '../sagas/onboarding.saga';
import vcrMiddleware from '../middlewares/vcr.middleware'


export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [
    sagaMiddleware,
    vcrMiddleware,
  ];

  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware.apply(null, middlewares)
    )
  );

  sagaMiddleware.run(onboardingSaga);

  return store;
}
