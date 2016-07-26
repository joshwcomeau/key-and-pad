import React from 'react';
import classNames from 'classnames';

import './index.scss';

const Column = ({ children, className, ...delegatedProps }) => (
  <div className={classNames('column', className)} {...delegatedProps}>
    {children}
  </div>
);

export default Column;
