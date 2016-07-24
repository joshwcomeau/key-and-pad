import React from 'react';

import Header from '../Header';
import XYPad from '../XYPad';
import Keyboard from '../Keyboard';
import DevTools from '../DevTools';
import keyboardLayout from '../../data/keyboard_layout';

import './reset.scss';
import './index.scss';


const App = () => (
  <div className="app">
    <Header />
    <Keyboard layout={keyboardLayout} />
    <XYPad />
    <DevTools />
  </div>
);

export default App;
