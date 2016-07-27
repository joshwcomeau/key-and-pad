import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './components/App';
import { webAudioInitialization } from './ducks/sounds.duck';
import configureStore from './store';

// import WebAudioManager from './utils/web-audio-manager';

// Needed for onTouchTap
// Check this repo: https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const store = configureStore();

// Dispatch an `init` action, so that our Web Audio Middleware can initialize
// from the redux state.
store.dispatch(webAudioInitialization());


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
