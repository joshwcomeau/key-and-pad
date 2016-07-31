import React from 'react';
import classNames from 'classnames';

import './index.scss';


const Subheading = ({ className, children }) => (
  <h3 className={classNames('subheading', className)}>
    <span className="subheading-inline">
      {children}
    </span>
  </h3>
);

export default Subheading;
