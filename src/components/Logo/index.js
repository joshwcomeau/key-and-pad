import React from 'react';

import './index.scss';

const Logo = ({ size }) => (
  <span className={`logo ${size}`}>
    <span className="word">Key</span>
    <span className="join-character">&</span>
    <span className="word">Pad</span>
  </span>
);

export default Logo;
