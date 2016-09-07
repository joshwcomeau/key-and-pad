import React, { Component, PropTypes } from 'react';
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

  componentDidMount() {
    this.transpose({ initial: true });
  }

  componentDidUpdate() {
    this.transpose();
  }

  transpose({ initial = false } = {}) {
    const {
      centerHorizontally,
      centerVertically,
      animateInitialPosition,
    } = this.props;

    window.requestAnimationFrame(() => {
      // If the element has been removed in the last frame, abort!
      if (!this.elem) {
        return;
      }

      // Add a transition to the element unless this is the initial transposition,
      // and we've elected to not animate the original one.
      if (animateInitialPosition || !initial) {
        const transform = `transform ${this.props.transposeLength}ms`;
        const opacity = `opacity ${this.props.fadeLength}ms`;
        this.elem.style.transition = [transform, opacity].join(', ');
      }

      const { top, left, width, height } = this.elem.getBoundingClientRect();

      // We want to ignore vertical scroll position.
      // Otherwise, the feature will move when the props change if the user
      // has scrolled, and it's weird/disorientating.
      const verticalScrollPos = window.scrollY;

      const horizontalCenterPos = (window.innerWidth / 2) - (width / 2);
      const verticalCenterPos = (window.innerHeight / 2) - (height / 2) - verticalScrollPos;

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

      if (offsetLeft || offsetTop) {
        this.elem.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
      } else {
        this.elem.style.transform = '';
      }
    });
  }

  // eslint-disable-next-line consistent-return
  renderPointer() {
    const relevantPointerOptions = this.props.pointerOptions.find(p => (
      p.render
    ));

    if (relevantPointerOptions) {
      return <FeaturePointer key="pointer" {...relevantPointerOptions} />;
    }
  }

  render() {
    // If we've specified that we want this element removed from the DOM,
    // don't even render it.
    if (this.props.removeFeature) {
      return null;
    }
    return (
      <div
        className={this.props.className}
        ref={elem => { this.elem = elem; }}
        style={{
          position: this.props.style.position || 'relative',
          opacity: this.props.showFeature ? 1 : 0,
          pointerEvents: this.props.showFeature ? '' : 'none',
        }}
      >
        <ReactCSSTransitionGroup
          transitionName="gradient"
          transitionAppear
          transitionEnterTimeout={3000}
          transitionAppearTimeout={3000}
          transitionLeaveTimeout={4000}
        >
          {this.props.gradient && <div className="feature-highlight-gradient" />}
        </ReactCSSTransitionGroup>

        {this.props.children}

        <ReactCSSTransitionGroup
          transitionName="pointer"
          transitionEnterTimeout={2500}
          transitionLeaveTimeout={500}
        >
          {this.renderPointer()}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

FeatureHighlight.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string,
  centerHorizontally: PropTypes.bool,
  centerVertically: PropTypes.bool,
  gradient: PropTypes.bool,
  animateInitialPosition: PropTypes.bool,
  transposeLength: PropTypes.number,
  fadeLength: PropTypes.number,
  showFeature: PropTypes.bool,
  removeFeature: PropTypes.bool,
  pointerOptions: PropTypes.array, // validated in FeaturePointer component
};

FeatureHighlight.defaultProps = {
  style: {},
  animateInitialPosition: false,
  transposeLength: 1000,
  fadeLength: 1600,
  pointerOptions: [],
};

export default FeatureHighlight;
