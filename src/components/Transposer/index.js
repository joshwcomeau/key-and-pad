import React, { Component, PropTypes } from 'react';
import omit from 'lodash.omit';

function getTranslateFromTransform(elem) {
  // Start by getting our matrix values as an array.
  // -> ['1', '0', '0', '1', x, y]
  const transform = window.getComputedStyle(elem).transform

  if (transform === 'none') {
    return [0, 0];
  }
  return transform
    .replace(/(matrix\(|\s|\))/g, '') // Strip out
    .split(',')
    .map(i => +i)
    .slice(4);
}


class Transposer extends Component {
  shouldComponentUpdate(nextProps) {
    const hChange = nextProps.centerHorizontally !== this.props.centerHorizontally;
    const vChange = nextProps.centerVertically !== this.props.centerVertically;

    return (hChange || vChange);
  }

  componentDidUpdate() {
    this.transpose();
  }

  componentDidMount() {
    this.transpose({ initial: true });
  }

  transpose({ initial = false } = {}) {
    const { centerHorizontally, centerVertically } = this.props;

    window.requestAnimationFrame(() => {
      const { top, left, width, height } = this.elem.getBoundingClientRect();

      const horizontalCenterPos = (window.innerWidth / 2) - (width / 2);
      const verticalCenterPos = (window.innerHeight / 2) - (height / 2);

      const [translateX, translateY] = getTranslateFromTransform(this.elem);

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
};

Transposer.defaultProps = {
  animateInitialPosition: true,
};

export default Transposer;
