import React, { Component, PropTypes } from 'react';
import './index.css';

class XYPad extends Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
    this.touch = this.touch.bind(this);
    this.release = this.release.bind(this);
  }

  click(ev) {
    // If, and only if, the mouse button is held down, we want to delegate
    // to the `touch` event.
    if (ev.buttons === 1) {
      this.touch(ev);
    }
  }

  touch(ev) {
    // We need to calculate the relative position of the event, and pass it
    // onto our supplied touch handler.
    const boundingBox = this.elem.getBoundingClientRect();

    const x = (ev.clientX - boundingBox.left) / boundingBox.width;
    const y = (ev.clientY- boundingBox.top) / boundingBox.height;

    this.props.onTouch({ x, y });
  }

  release(ev) {

  }

  render() {
    const { width, height } = this.props;

    return (
      <div
        className="x-y-pad"
        ref={elem => this.elem = elem}
        style={{ width, height }}
        onTouchMove={this.touch}
        onMouseDown={this.touch}
        onMouseMove={this.click}
        onTouchEnd={this.props.onRelease}
        onMouseUp={this.props.onRelease}
      />
    );
  }
}

XYPad.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  onTouch: PropTypes.func.isRequired,
  onRelease: PropTypes.func.isRequired,
};

XYPad.defaultProps = {
  width: 350,
  height: 350,
};

export default XYPad;
