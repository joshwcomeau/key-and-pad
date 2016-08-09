import React, { PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';


const ProgressBar = ({ className, progress }) => (
  <div
    className={classNames([
      'progress-bar',
      className,
      { complete: progress >= 100 },
    ])}
  >
    <div className="progress-border" />
    <div
      className="progress"
      style={{ transform: `translateX(${progress}%)` }}
    />
  </div>
);

ProgressBar.propTypes = {
  className: PropTypes.string,
  progress: PropTypes.number,
};

export default ProgressBar;
