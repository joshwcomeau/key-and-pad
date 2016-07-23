import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from 'reducers';


export default function configureStore() {
  const middlewares = [
    thunkMiddleware,
  ];

  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware.apply(null, middlewares)
    )
  );

  return store;
}
