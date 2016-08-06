import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers';
import onboardingSaga from '../sagas/onboarding.saga';
import vcrMiddleware from '../middlewares/vcr.middleware'
import vcrPersist from '../utils/vcr-persist';

import DevTools from '../components/DevTools';


export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [
    sagaMiddleware,
    vcrMiddleware(vcrPersist),
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


function wrapReducer(reducer) {
  return (state = {}, action) => {
    switch(action.type) {
      // When our special action is dispatched, we want to re-initialize
      // the state, so that our casette can be played from a blank state.
      case '@@REWIND':
        return reducer({}, {});

      default:
        // Otherwise, delegate to the original reducer.
        return reducer(state, action);
    }
  };
}
