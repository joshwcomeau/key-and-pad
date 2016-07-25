import React from 'react';


const Waveform = ({
  value,
  width = 64,
  height = 64,
  stroke = '#000000',
  strokeWidth = 4,
}) => {
  let svgShape;

  switch (value) {
    case 1: // Sine wave
      svgShape = (
        <circle
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeMiterlimit="10"
          cx="32"
          cy="32"
          r="30"
        />
      );
      break;

    case 2: // Triangle wave
      svgShape = (
        <polygon
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeMiterlimit="10"
          points="4.208,56.791 32.036,8.593
      		59.865,56.791"
        />
      );
      break;

    case 3: // Square wave
      svgShape = (
        <rect
          x="2"
          y="2"
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeMiterlimit="10"
          width="60"
          height="60"
        />
      );
      break;

    case 4: // Sawtooth wave
      svgShape = (
        <g id="sawtooth-group">
          <line fill="none" stroke="#000000" strokeWidth="4" strokeMiterlimit="10" x1="2.547" y1="60.328" x2="31.341" y2="2.304"/>
          <line fill="none" stroke="#000000" strokeWidth="4" strokeMiterlimit="10" x1="31.612" y1="1.403" x2="31.612" y2="61.125"/>
          <line fill="none" stroke="#000000" strokeWidth="4" strokeMiterlimit="10" x1="31.612" y1="60.169" x2="60.198" y2="2.092"/>
          <line fill="none" stroke="#000000" strokeWidth="4" strokeMiterlimit="10" x1="60.198" y1="1.4" x2="60.198" y2="61.125"/>
        </g>
      );
      break;

    default:
      throw new Error(`Invalid value provided to Waveform. Needs to be an integer between 1 and 4 inclusive, you provided ${value}`);
  }

  return (
    <svg width={width} height={height} viewBox="0 0 64 64">
      {svgShape}
    </svg>
  )
};

export default Waveform;
