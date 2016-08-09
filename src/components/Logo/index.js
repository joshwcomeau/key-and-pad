import React, { PropTypes } from 'react';

import './index.scss';

const Logo = ({ size }) => (
  <span className={`logo ${size}`}>
    <span className="word">Key</span>
    <span className="join-character">&</span>
    <span className="word">Pad</span>
  </span>
);

Logo.propTypes = {
  size: PropTypes.string,
};

export default Logo;
