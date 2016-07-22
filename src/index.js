import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import XYPad from './components/XYPad';

import './reset.css';
import './index.css';

injectTapEventPlugin();


ReactDOM.render(
  <XYPad
    onTouch={({ x, y }) => console.log(x, y)}
    onRelease={(ev) => console.log('released!', ev)}
  />,
  document.getElementById('root')
);
