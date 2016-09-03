import React, { PropTypes } from 'react';

import './index.scss';


const Code = ({ children }) => (
  <blockquote className="code">
    {children}
  </blockquote>
);

Code.propTypes = {
  children: PropTypes.node,
};

export default Code;
