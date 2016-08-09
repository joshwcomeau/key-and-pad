import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';


const XYPadAxisLabel = ({
  label,
  className,
  includeRightArrow,
  includeLeftArrow,
}) => (
  <div className={classNames('x-y-pad-axis-label', className)}>
    <h4 className="label-text">{label}</h4>
    <div className="axis-label-line" />
    { includeLeftArrow ? <div className="arrow left" /> : null }
    { includeLeftArrow ? <div className="peg right" /> : null }

    { includeRightArrow ? <div className="arrow right" /> : null }
    { includeRightArrow ? <div className="peg left" /> : null }
  </div>
);

XYPadAxisLabel.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  includeRightArrow: PropTypes.bool,
  includeLeftArrow: PropTypes.bool,
};

export default XYPadAxisLabel;
