import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Subheading from '../Subheading';
import ProgressBar from '../ProgressBar';
import './index.scss';

class FeaturePointer extends Component {
  render() {
    const {
      title,
      text,
      position,
      tipPosition,
      centered,
      bubble,
      progress,
    } = this.props;

    const classes = classNames([
      'feature-pointer-wrapper',
      position,
      `tooltip-${tipPosition}`,
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
  }
}

FeaturePointer.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  position: PropTypes.oneOf(['top', 'bottom']),
  tipPosition: PropTypes.oneOf(['left', 'center', 'right']),
  progress: PropTypes.number,
  centered: PropTypes.bool,
  bubble: PropTypes.bool,
}

export default FeaturePointer;
