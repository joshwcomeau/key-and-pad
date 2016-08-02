/* eslint-disable react/jsx-handler-names */
import React from 'react';
import ReactSlider from 'react-slider';
import classNames from 'classnames';

import './index.scss';


const Slider = ({ withMidpoint, className, ...settings }) => {
  const sliderContainerClass = classNames(
    'slider-container',
    className,
    { 'with-midpoint': withMidpoint }
  );

  return (
    <div className={sliderContainerClass}>
      <ReactSlider withBars {...settings} />
      {withMidpoint ? <div className="slider-midpoint" /> : null}
    </div>
  );
};

export default Slider;
