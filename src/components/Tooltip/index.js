import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import debounce from 'lodash/debounce';
import './index.scss';


class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.state = { shown: false };
  }

  componentDidMount() {
    this.containerElem = this.tooltipElem.parentNode;

    this.setPositionStyles = debounce(this.setPositionStyles.bind(this), 500);

    window.addEventListener('resize', this.setPositionStyles);

    this.setPositionStyles();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.shown) {
      this.setState({ shown: true });

      if (nextProps.autoHideDuration) {
        window.setTimeout(() => {
          this.setState({ shown: false });
        }, nextProps.autoHideDuration);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setPositionStyles);
  }

  setPositionStyles() {
    const { position, buffer } = this.props;

    // We need to manually position the tooltip based on the container's
    // size, and requested props. This is annoyingly imperative, but it's
    // the only way to ensure the tooltip can be used declaratively :)
    const containerBox = this.containerElem.getBoundingClientRect();
    const tooltipBox = this.tooltipElem.getBoundingClientRect();

    switch (position) {
      case 'top': {
        const leftOffset = (containerBox.width - tooltipBox.width) / 2;
        this.tooltipElem.style.left = `${leftOffset}px`;
        this.tooltipElem.style.top = `${-tooltipBox.height - buffer}px`;
        break;
      }
      case 'left': {
        const topOffset = (containerBox.height - tooltipBox.height) / 2;
        this.tooltipElem.style.top = `${topOffset}px`;
        this.tooltipElem.style.left = `${-tooltipBox.width - buffer}px`;
        break;
      }
      case 'right': {
        const topOffset = (containerBox.height - tooltipBox.height) / 2;
        this.tooltipElem.style.top = `${topOffset}px`;
        this.tooltipElem.style.right = `${-tooltipBox.width - buffer}px`;
        break;
      }
      case 'bottom': {
        const leftOffset = (containerBox.width - tooltipBox.width) / 2;
        this.tooltipElem.style.left = `${leftOffset}px`;
        this.tooltipElem.style.bottom = `${-tooltipBox.height - buffer}px`;
        break;
      }
      default: {
        throw new Error(`Unexpected Tooltip position: ${position}`);
      }
    }
  }

  render() {
    const { text, position, className } = this.props;

    // TODO: Allow for custom arrow placement.
    // For now, arrows are tied to the tooltip's position. A 'top' tooltip
    // has a horizontally-centered, downward-facing arrow, and so forth.
    const arrowClasses = [];

    switch (position) {
      case 'top':
        arrowClasses.push('tip-on-bottom', 'tip-horizontally-centered');
        break;
      case 'left':
        arrowClasses.push('tip-on-right', 'tip-vertically-centered');
        break;
      case 'right':
        arrowClasses.push('tip-on-left', 'tip-vertically-centered');
        break;
      case 'bottom':
        arrowClasses.push('tip-on-top', 'tip-horizontally-centered');
        break;
      default:
        arrowClasses.push('tip-on-bottom', 'tip-horizontally-centered');
    }

    const classes = classNames([
      'floating-tooltip',
      arrowClasses,
      className,
    ]);

    return (
      <div
        className={classes}
        ref={el => { this.tooltipElem = el; }}
        style={{
          opacity: this.state.shown ? '1' : '0',
          pointerEvents: this.state.shown ? '' : 'none',
          transform: this.state.shown ? 'translateY(0)' : '',
        }}
      >
        <div className="tooltip-content">{text}</div>
      </div>
    );
  }
}

Tooltip.propTypes = {
  shown: PropTypes.bool,
  text: PropTypes.string.isRequired,
  position: PropTypes.oneOf(['top', 'left', 'right', 'bottom']),
  buffer: PropTypes.number,
  autoHideDuration: PropTypes.number,
  className: PropTypes.string,
};

Tooltip.defaultProps = {
  position: 'top',
  buffer: 6,
};

export default Tooltip;
