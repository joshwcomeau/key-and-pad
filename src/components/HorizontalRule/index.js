// eslint-disable-next-line no-unused-vars
import React, { PropTypes } from 'react';

import './index.scss';


const HorizontalRule = ({ background, dotSize }) => (
  <div className="horizontal-rule">
    <div
      className={`blocker-circle ${background}`}
      style={{ width: `${dotSize * 2}px`, height: `${dotSize * 2}px` }}
    />
    <div
      className="circle"
      style={{ width: `${dotSize}px`, height: `${dotSize}px` }}
    />
  </div>
);

HorizontalRule.propTypes = {
  background: PropTypes.oneOf(['white', 'offwhite']),
  dotSize: PropTypes.number,
};

HorizontalRule.defaultProps = {
  background: 'offwhite',
  dotSize: 8,
};

export default HorizontalRule;
