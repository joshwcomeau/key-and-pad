import React from 'react';

import Header from '../Header';
import XYPad from '../XYPad';
import Keyboard from '../Keyboard';
import ControlPanel from '../ControlPanel';
import DevTools from '../DevTools';
import keyboardLayout from '../../data/keyboard-layout';

import './reset.scss';
import './index.scss';


const App = () => (
  <div className="app">
    <Header />
    <div className="keys-and-pad">
      <Keyboard layout={keyboardLayout} />
      <XYPad />
    </div>

    <ControlPanel />
    <DevTools />
  </div>
);

export default App;
