import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';

const Row = ({ children, className }) => (
  <div className={classNames('row', className)}>
    {children}
  </div>
);

Row.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Row;
