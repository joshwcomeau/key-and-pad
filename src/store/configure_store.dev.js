import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import webAudioMiddleware from '../middlewares/web-audio.middleware';
import rootReducer from '../reducers';
import DevTools from '../components/DevTools';


export default function configureStore() {
  const middlewares = [
    thunkMiddleware,
    webAudioMiddleware
  ];

  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware.apply(this, middlewares),
      DevTools.instrument()
    )
  );

  // Allow direct access to the store, for debugging/testing
  window.store = store;

  return store;
}
