import React, { Component, PropTypes } from 'react';
import omit from 'lodash.omit';

import { getElementTranslate } from '../../utils/dom-helpers';


class Transposer extends Component {
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
      hide,
    } = this.props;

    window.requestAnimationFrame(() => {
      // Add a transition to the element unless this is the initial transposition,
      // and we've elected to not animate the original one.
      if (animateInitialPosition || !initial) {
        console.log("Setting transition")
        this.elem.style.transition = `transform ${this.props.transposeLength}ms, opacity ${this.props.transposeLength}ms`;
      }

      this.elem.style.opacity = hide ? 0 : 1;

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
    const primaryPropKeys = Object.keys(Transposer.propTypes);
    const delegatedProps = omit(this.props, primaryPropKeys);

    return (
      <div ref={elem => { this.elem = elem; }} {...delegatedProps}>
        {this.props.children}
      </div>
    )
  }
}

Transposer.propTypes = {
  children: PropTypes.node,
  centerHorizontally: PropTypes.bool,
  centerVertically: PropTypes.bool,
  animateInitialPosition: PropTypes.bool,
  transposeLength: PropTypes.number,
  hide: PropTypes.bool,
};

Transposer.defaultProps = {
  animateInitialPosition: false,
  transposeLength: 1000,
};

export default Transposer;
