import React, { Component, PropTypes } from 'react';
import omit from 'lodash.omit';

import { getElementTranslate } from '../../utils/dom-helpers';

// A helpful onboarding utility that:
// - includes a helpful message explaining the feature.
// - positions an item to the center, so a feature can be highlighted
// - controls whether or not to render an element

class FeatureHighlight extends Component {
  componentDidUpdate() {
    this.transpose();
  }

  componentDidMount() {
    this.transpose({ initial: true });
  }

  transpose({ initial = false } = {}) {
    const {
      centerHorizontally,
      centerVertically,
      animateInitialPosition,
    } = this.props;

    window.requestAnimationFrame(() => {
      // Add a transition to the element unless this is the initial transposition,
      // and we've elected to not animate the original one.
      if (animateInitialPosition || !initial) {
        this.elem.style.transition = `transform ${this.props.transposeLength}ms, opacity ${this.props.fadeLength}ms`;
      }

      const { top, left, width, height } = this.elem.getBoundingClientRect();

      const horizontalCenterPos = (window.innerWidth / 2) - (width / 2);
      const verticalCenterPos = (window.innerHeight / 2) - (height / 2);

      const [translateX, translateY] = getElementTranslate(this.elem);

      let offsetLeft;
      if (centerHorizontally) {
        offsetLeft = horizontalCenterPos - left + translateX;
      } else {
        offsetLeft = 0;
      }

      let offsetTop;
      if (centerVertically) {
        offsetTop = verticalCenterPos - top + translateY;
      } else {
        offsetTop = 0;
      }


      this.elem.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
    })
  }

  render() {
    // Any prop not defined in our PropTypes can be delegated to the div.
    const primaryPropKeys = Object.keys(FeatureHighlight.propTypes);
    const delegatedProps = omit(this.props, primaryPropKeys);

    return (
      <div
        {...delegatedProps}
        ref={elem => { this.elem = elem; }}
        style={{
          position: 'relative',
          opacity: this.props.showFeature ? 1 : 0,
          pointerEvents: this.props.showFeature ? '' : 'none',
        }}
      >
        {this.props.children}
      </div>
    )
  }
}

FeatureHighlight.propTypes = {
  children: PropTypes.node,
  centerHorizontally: PropTypes.bool,
  centerVertically: PropTypes.bool,
  animateInitialPosition: PropTypes.bool,
  transposeLength: PropTypes.number,
  fadeLength: PropTypes.number,
  showFeature: PropTypes.bool,
};

FeatureHighlight.defaultProps = {
  animateInitialPosition: false,
  transposeLength: 1000,
  fadeLength: 1600,
};

export default FeatureHighlight;
