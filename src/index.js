import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './components/App';
import Error from './components/Error';
import initializeWebAudioReconciler from './utils/web-audio-reconciler';
import WebAudioManager from './utils/web-audio-manager';
import { isMobile, isModern } from './utils/misc-helpers';
import { fadeElementAway } from './utils/dom-helpers';
import configureStore from './store';

// Needed for onTouchTap
// Check this repo: https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const store = configureStore();

// Initialize our reconciler.
// This is how our sounds update in response to Redux state changes. A
// `subscribe` function is passed which compares the old state to the new,
// and makes any changes required.
initializeWebAudioReconciler({ store, manager: WebAudioManager });

// Handle unsupported devices and browsers.
let appComponent;
if (isMobile()) {
  appComponent = (
    <Error
      heading="Sorry, this is a desktop-only experience."
      // eslint-disable-next-line max-len
      content="This web synthesizer needs a mouse and keyboard to operate, and so it cannot run on mobile devices."
      linkText="Here's something neat that will run on your phone :)"
      linkHref="http://martinwecke.de/108/"
    />
  );
} else if (!isModern()) {
  appComponent = (
    <Error
      heading="Sorry, your browser is not supported."
      // eslint-disable-next-line max-len
      content="This web synthesizer requires a modern browser to run, since it uses fancy new Web Audio technologies that aren't supported in older browsers."
      linkText="Please upgrade to a newer browser."
      linkHref="http://outdatedbrowser.com/en"
      linkTarget="_blank"
    />
  );
} else {
  appComponent = <App />;
}

// We have a plain-DOM loading screen, which we need to fade out and remove
// once React has loaded.
fadeElementAway({ selector: '.loading-screen', duration: 500 })
  .then(() => {
    ReactDOM.render(
      <Provider store={store}>
        {appComponent}
      </Provider>,
      document.getElementById('root')
    );
  });
