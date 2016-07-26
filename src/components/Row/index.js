import React from 'react';
import classNames from 'classnames';

import './index.scss';

const Row = ({ children, className }) => (
  <div className={classNames('row', className)}>
    {children}
  </div>
);

export default Row;
