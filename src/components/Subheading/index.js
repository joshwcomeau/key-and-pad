import React from 'react';

import './index.scss';


const Subheading = ({children}) => (
  <h3 className="subheading">
    <span className="subheading-inline">
      {children}
    </span>
  </h3>
);

export default Subheading;
