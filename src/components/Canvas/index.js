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

    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');

    scaleCanvas(this.canvas, this.ctx);

    // Binding this to window instead of the canvas itself so that we catch
    // events that happen slightly outside the rectangle.
    window.addEventListener('mouseup', this.onMouseUp);
  }

  componentDidUpdate() {
    // Run the 'draw' function
    this.props.draw({
      canvas: this.canvas,
      ctx: this.ctx,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  handleMouseEvent(eventHandlerName) {
    return event => {
      if (eventHandlerName === 'onMouseDown') {
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

    console.log('MOve, and state is', this.state.mouseDown);

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
      />
    );
  }
}

Canvas.propTypes = {
  draw: PropTypes.func.isRequired,
  style: PropTypes.object,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onMouseUp: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseDrag: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

const noop = () => {};

Canvas.defaultProps = {
  onMouseDown: noop,
  onMouseUp: noop,
  onMouseMove: noop,
  onMouseDrag: noop,
  onMouseEnter: noop,
  onMouseLeave: noop,
};

export default Canvas;
