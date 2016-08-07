import React, { PropTypes } from 'react';
import FlipMove from 'react-flip-move';

import './index.scss';

const Backdrop = ({ isShown, animation, opacity, color }) => {
  let backdropMarkup;

  if (isShown) {
    backdropMarkup = (
      <div key="bd" className="backdrop-wrapper">
        <div className="backdrop" style={{ opacity, background: color }} />
      </div>
    );
  }

  return (
    <FlipMove enterAnimation={animation} leaveAnimation={animation}>
      {isShown ? backdropMarkup : <div />}
    </FlipMove>
  );
};

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
