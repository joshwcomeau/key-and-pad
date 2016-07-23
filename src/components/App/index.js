import React from 'react';

import XYPad from '../XYPad';
import Keyboard from '../Keyboard';
import DevTools from '../DevTools';
import keyboardLayout from '../../data/keyboard_layout';

import './reset.css';
import './index.css';


const App = () => (
  <div>
    <Keyboard layout={keyboardLayout} />
    <XYPad
      handlePress={({ x, y }) => console.log(x, y)}
      handleRelease={(ev) => console.log('released!', ev)}
    />
    <DevTools />
  </div>
);

export default App;
