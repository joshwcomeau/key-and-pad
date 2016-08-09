import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';


const Button = ({ children, className, handleClick, ...delegatedProps }) => {
  return (
    <button
      onTouchTap={handleClick}
      className={classNames('button', className)}
      {...delegatedProps}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  handleClick: PropTypes.func,
};

export default Button;
