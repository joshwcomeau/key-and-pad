import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './components/App';
import { initializeWebAudio } from './utils/web-audio-reconciler';
import configureStore from './store';

// Needed for onTouchTap
// Check this repo: https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const store = configureStore();

// Initialize our reconciler.
// This is how our sounds update in response to Redux state changes. A
// `subscribe` function is passed which compares the old state to the new,
// and makes any changes required.
initializeWebAudio(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
