import React from 'react';
import classNames from 'classnames';

import Subheading from '../Subheading'
import './index.scss';

const FeaturePointer = ({
  title,
  text,
  position,
  tooltipPosition,
  centered,
  bubble,
}) => {
  const classes = classNames([
    'feature-pointer-wrapper',
    position,
    `tooltip-${tooltipPosition}`,
    { centered, bubble }
  ]);

  return (
    <div className={classes}>
      <div className="feature-pointer">
        {
          bubble
          ? <div className="bubble-pointer-triangle" />
          : <div className="default-pointer-triangle">
              <div className="triangle triangle-1" />
              <div className="triangle triangle-2" />
              <div className="triangle triangle-3" />
            </div>
        }
        <Subheading>{title}</Subheading>
        <p>{text}</p>
      </div>
    </div>

  )
};

export default FeaturePointer;
