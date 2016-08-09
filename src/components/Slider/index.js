/* eslint-disable react/jsx-handler-names */
import React, { PropTypes } from 'react';
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

Slider.propTypes = {
  withMidpoint: PropTypes.bool,
  className: PropTypes.string,
};

export default Slider;
