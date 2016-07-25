/* eslint-disable react/jsx-handler-names */
import React from 'react';
import ReactSlider from 'react-slider';

import Waveform from '../Waveform';
import './index.scss';


const Slider = settings => {
  // We have a default slider, but we also have a special 'oscillator' slider,
  // where the handle features a waveform SVG and changes colour depending on
  // its position.
  if (settings.type === 'oscillator') {
    return (
      <ReactSlider
        withBars
        min={1}
        max={4}
        step={1}
        value={settings.value}
        onChange={settings.onChange}
      >
        <div className="oscillator-handle">
          <Waveform value={settings.value} width={32} height={32} />
        </div>
      </ReactSlider>
    )
  }


  return (
    <ReactSlider
      withBars
      {...settings}
    />
  );
};

export default Slider;
