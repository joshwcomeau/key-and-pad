/* eslint-disable react/jsx-handler-names */
import React from 'react';
import ReactSlider from 'react-slider';

import './index.scss';


const Slider = settings => {
  return (
    <ReactSlider
      withBars
      {...settings}
    />
  );
};

export default Slider;
