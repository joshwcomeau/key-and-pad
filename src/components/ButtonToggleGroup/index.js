import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';


const ButtonToggleGroup = ({ children, className, ...delegatedProps }) => {
  return (
    <div
      className={classNames('button-toggle-group', className)}
      {...delegatedProps}
    >
      {children}
    </div>
  );
};

ButtonToggleGroup.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default ButtonToggleGroup;
