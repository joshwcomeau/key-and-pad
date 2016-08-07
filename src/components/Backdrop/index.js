import React, { PropTypes } from 'react';
import FlipMove from 'react-flip-move';

import './index.scss';

const Backdrop = ({ isShown, animation, opacity, color }) => (
  <FlipMove enterAnimation={animation} leaveAnimation={animation}>
    {
      isShown ? (
        <div key="bd" className="backdrop-wrapper">
          <div className="backdrop" style={{ opacity, background: color }} />
        </div>
      ) : <div />
    }
  </FlipMove>
);

Backdrop.propTypes = {
  isShown: PropTypes.bool,
  animation: PropTypes.oneOf([
    'elevator',
    'fade',
    'accordionHorizontal',
    'accordionVertical',
  ]),
  opacity: PropTypes.number,
  color: PropTypes.string,
};

Backdrop.defaultProps = {
  animation: 'fade',
  opacity: 0.75,
  color: '#000',
};

export default Backdrop;
