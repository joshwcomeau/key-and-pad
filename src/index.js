import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import XYPad from './components/XYPad';
import Keyboard from './components/Keyboard';
import keyboardLayout from './data/keyboard_layout';

import './reset.css';
import './index.css';

injectTapEventPlugin();


ReactDOM.render(
  <div>
    <Keyboard layout={keyboardLayout} />
    <XYPad
      handlePress={({ x, y }) => console.log(x, y)}
      handleRelease={(ev) => console.log('released!', ev)}
    />
  </div>,
  document.getElementById('root')
);
