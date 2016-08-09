import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';

const Column = ({ children, className, ...delegatedProps }) => (
  <div className={classNames('column', className)} {...delegatedProps}>
    {children}
  </div>
);

Column.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

export default Column;
