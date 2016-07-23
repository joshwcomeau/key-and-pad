import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import webAudioMiddleware from '../middlewares/web-audio.middleware';
import rootReducer from '../reducers';


export default function configureStore() {
  const middlewares = [
    thunkMiddleware,
    webAudioMiddleware,
  ];

  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware.apply(null, middlewares)
    )
  );

  return store;
}
