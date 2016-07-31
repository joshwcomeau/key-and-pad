import React, { Component, PropTypes } from 'react';
import omit from 'lodash.omit';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import FeaturePointer from '../FeaturePointer';
import { getElementTranslate } from '../../utils/dom-helpers';

// A helpful onboarding utility that:
// - includes a helpful message explaining the feature.
// - positions an item to the center, so a feature can be highlighted
// - controls whether or not to render an element

class FeatureHighlight extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps) {
    this.transpose();

    // If the tooltip was just killed in this update,
    // we don't want to wipe it from the DOM immediatel
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

  renderPointer() {
    const relevantPointerOptions = this.props.pointerOptions.find(p => (
      p.render
    ));

    if (relevantPointerOptions) {
      return <FeaturePointer key="pointer" {...relevantPointerOptions} />
    }
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
        <ReactCSSTransitionGroup
          transitionName="pointer"
          transitionEnterTimeout={1500}
          transitionLeaveTimeout={500}
        >
          {this.renderPointer()}
        </ReactCSSTransitionGroup>
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
  pointerOptions: PropTypes.array, // validated in FeaturePointer component
};

FeatureHighlight.defaultProps = {
  animateInitialPosition: false,
  transposeLength: 1000,
  fadeLength: 1600,
  pointerOptions: [],
};

export default FeatureHighlight;
