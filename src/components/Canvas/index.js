/* eslint-disable react/jsx-handler-names */
import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';

import { scaleCanvas, getCursorPosition } from '../../utils/canvas-helpers';


class Canvas extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      mouseDown: false,
    };

    this.onMouseUp = this.handleMouseEvent('onMouseUp');
    this.onMouseDown = this.handleMouseEvent('onMouseDown');
    this.onMouseMove = this.handleMouseEvent('onMouseMove');
    this.onMouseEnter = this.handleMouseEvent('onMouseEnter');
    this.onMouseLeave = this.handleMouseEvent('onMouseLeave');
    this.onMouseRightClick = this.handleMouseEvent('onMouseRightClick');

    this.draw = this.draw.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.fadeTick = this.fadeTick.bind(this);
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');

    scaleCanvas(this.canvas, this.ctx);

    // Set up a refresh rate, if requested.
    if (this.props.fadeContentsAway) {
      this.fadeTick();
    }

    // Binding this to window instead of the canvas itself so that we catch
    // events that happen slightly outside the rectangle.
    window.addEventListener('mouseup', this.onMouseUp);
  }

  componentDidUpdate() {
    this.props.shapes.forEach(this.draw);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUp);
    window.cancelAnimationFrame(this.fadeTickFrame);
  }

  fadeTick() {
    this.ctx.globalAlpha = 0.1;
    this.ctx.fillStyle = '#FFF';
    this.ctx.fillRect(0, 0, this.props.width, this.props.height);
    this.ctx.globalAlpha = 1;

    this.fadeTickFrame = window.requestAnimationFrame(this.fadeTick);
  }

  draw(shape) {
    switch (shape.type) {
      case 'circle': {
        const { x, y, color, radius } = shape;

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, false, Math.PI * 2, false);
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();

        break;
      }

      default:
        // TODO: support more shapes!
        return;
    }
  }

  handleMouseEvent(eventHandlerName) {
    return event => {
      if (eventHandlerName === 'onMouseDown') {
        this.setState({ mouseDown: true });
      } else if (eventHandlerName === 'onMouseRightClick') {
        event.preventDefault();
        this.setState({ mouseDown: true });
      } else if (eventHandlerName === 'onMouseUp') {
        this.setState({ mouseDown: false });
      }

      const [x, y] = getCursorPosition(event, this.canvas);

      this.props[eventHandlerName]({
        event,
        canvas: this.canvas,
        ctx: this.ctx,
        x,
        y,
      });
    };
  }

  handleMouseMove(ev) {
    // MouseMove is special, because it may or may not be a 'drag'.
    // Dispatch the mouseMove event right away, then work out if we also
    // need to dispatch a drag.
    this.handleMouseEvent('onMouseMove')(ev);

    if (this.state.mouseDown) {
      this.handleMouseEvent('onMouseDrag')(ev);
    }
  }

  render() {
    const { style, className, width, height } = this.props;

    return (
      <canvas
        ref={c => { this.canvas = c; }}
        style={style}
        className={classNames('canvas', className)}
        width={width}
        height={height}
        onMouseUp={this.onMouseUp}
        onMouseDown={this.onMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onContextMenu={this.onMouseRightClick}
      />
    );
  }
}

Canvas.propTypes = {
  shapes: PropTypes.arrayOf(PropTypes.object),
  style: PropTypes.object,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  fadeContentsAway: PropTypes.bool,
  onMouseUp: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseDrag: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseRightClick: PropTypes.func,
};

const noop = () => {};

Canvas.defaultProps = {
  onMouseDown: noop,
  onMouseUp: noop,
  onMouseMove: noop,
  onMouseDrag: noop,
  onMouseEnter: noop,
  onMouseLeave: noop,
  onMouseRightClick: noop,
};

export default Canvas;
