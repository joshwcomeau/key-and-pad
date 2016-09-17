import React, { PropTypes } from 'react';
import classNames from 'classnames';

import Subheading from '../Subheading';
import ProgressBar from '../ProgressBar';
import './index.scss';

const FeaturePointer = ({
  title,
  text,
  position,
  tipPosition,
  centered,
  bubble,
  progress,
}) => {
  const classes = classNames([
    'feature-pointer-wrapper',
    position,
    `tooltip-${tipPosition}`,
    { centered, bubble },
  ]);

  let pointerTriangle;
  if (tipPosition) {
    /* eslint-disable react/jsx-indent */
    pointerTriangle = bubble
      ? <div className="bubble-pointer-triangle" />
      : (<div className="default-pointer-triangle">
          <div className="triangle triangle-1" />
          <div className="triangle triangle-2" />
          <div className="triangle triangle-3" />
        </div>);
    /* eslint-enable */
  }

  return (
    <div className={classes}>
      <div className="feature-pointer">
        {pointerTriangle}
        <Subheading
          background={bubble ? 'white' : 'offwhite'}
          underline="peach"
        >
          {title}
        </Subheading>
        <p>{text}</p>

        {
          typeof progress !== 'undefined' && progress !== 0
            ? <ProgressBar progress={progress} />
            : null
        }
      </div>
    </div>
  );
};

FeaturePointer.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  position: PropTypes.oneOf(['top', 'bottom']),
  tipPosition: PropTypes.oneOf(['left', 'center', 'right', null]),
  progress: PropTypes.number,
  centered: PropTypes.bool,
  bubble: PropTypes.bool,
};

FeaturePointer.defaultProps = {
  tipPosition: null,
};

export default FeaturePointer;
