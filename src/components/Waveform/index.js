/* eslint-disable max-len */
import React, { PropTypes } from 'react';


const Waveform = ({
  value,
  width = 20,
  height = 20,
}) => {
  let svgShape;

  switch (value) {
    case 'sine':
      svgShape = (
        <g>
          <path
            d="M89.2,60.8c-4.5,0-6.6-5.3-8.6-10.4c-1.8-4.5-3.6-9.1-6.8-9.1s-5,4.6-6.8,9.1c-2,5.1-4.1,10.4-8.6,10.4s-6.6-5.3-8.6-10.4   c-1.8-4.5-3.6-9.1-6.8-9.1s-5,4.6-6.8,9.1c-2,5.1-4.1,10.4-8.6,10.4c-4.5,0-6.6-5.3-8.6-10.4c-1.8-4.5-3.6-9.1-6.8-9.1   c-0.6,0-1-0.4-1-1s0.4-1,1-1c4.5,0,6.6,5.3,8.6,10.4c1.8,4.5,3.6,9.1,6.8,9.1c3.2,0,5-4.6,6.8-9.1c2-5.1,4.1-10.4,8.6-10.4   s6.6,5.3,8.6,10.4c1.8,4.5,3.6,9.1,6.8,9.1c3.2,0,5-4.6,6.8-9.1c2-5.1,4.1-10.4,8.6-10.4s6.6,5.3,8.6,10.4c1.8,4.5,3.6,9.1,6.8,9.1   c0.6,0,1,0.4,1,1S89.8,60.8,89.2,60.8z"
          />
        </g>
      );
      break;

    case 'triangle':
      svgShape = (
        <g>
          <path fill="#000000" stroke="#000000" strokeMiterlimit="10" d="M32.3,47.2" />
          <polygon points="57.5,61.7 42.5,41.7 27.5,61.7 11.7,40.6 13.3,39.4 27.5,58.3 42.5,38.3 57.5,58.3 72.5,38.3 88.3,59.4 86.7,60.6    72.5,41.7" />
        </g>
      );
      break;

    case 'square':
      svgShape = (
        <g>
          <path fill="#000000" stroke="#000000" strokeMiterlimit="10" d="M32.3,47.2" />
          <polygon points="95,61 79,61 79,41 66,41 66,61 49,61 49,41 36,41 36,61 19,61 19,41 5,41 5,39 21,39 21,59 34,59 34,39 51,39    51,59 64,59 64,39 81,39 81,59 95,59" />
        </g>
      );
      break;

    case 'sawtooth':
      svgShape = (
        <g>
          <path fill="#000000" stroke="#000000" strokeMiterlimit="10" d="M32.3,47.2" />
          <polygon points="64,61.9 64,41.9 34,61.9 34,41.9 5.6,60.8 4.4,59.2 36,38.1 36,58.1 66,38.1 66,58.1 94.4,39.2 95.6,40.8  " />
        </g>
      );
      break;

    default:
      throw new Error(`
        Invalid value provided to Waveform.
        Must be one of: sine, triangle, square, sawtooth. You provided ${value}.
      `);
  }

  return (
    <svg width={width} height={height} viewBox="0 0 100 100">
      {svgShape}
    </svg>
  );
};

Waveform.propTypes = {
  value: PropTypes.oneOf(['sine', 'triangle', 'square', 'sawtooth']),
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Waveform;
