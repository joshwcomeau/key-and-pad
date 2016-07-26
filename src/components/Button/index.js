import React from 'react';
import classNames from 'classnames';

import './index.scss';


const Button = ({ className, children, handleClick, ...delegatedProps }) => {
  return (
    <button
      onTouchTap={handleClick}
      className={classNames('button', className)}
      {...delegatedProps}
    >
      {children}
    </button>
  )
};

export default Button;
