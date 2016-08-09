import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';


const Subheading = ({ children, className, underline, background }) => (
  <h3
    className={classNames([
      'subheading',
      className,
      underline ? `underline-${underline}` : null,
      underline && background ? `background-${background}` : null,
    ])}
  >
    <span className="subheading-inline">
      {children}
    </span>
  </h3>
);

Subheading.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  underline: PropTypes.oneOf([
    'peach',
    'navy',
    'medium-gray',
    'dark-gray',
  ]),
  background: PropTypes.oneOf([
    'white',
    'offwhite',
  ]),
};

Subheading.defaultProps = {
  background: 'offwhite',
};


export default Subheading;
