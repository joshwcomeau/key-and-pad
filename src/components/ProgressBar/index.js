import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';


const ProgressBar = ({ className, progress }) => (
  <div className={classNames('progress-bar', className)}>
    {console.log(progress)}
    <div className="progress-border" />
    <div
      className="progress"
      style={{ transform: `translateX(${progress}%)`}}
    />
  </div>
);

export default ProgressBar;
