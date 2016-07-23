import React, { Component, PropTypes } from 'react';
import './index.css';

class XYPad extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.release = this.release.bind(this);
  }

  handleClick(ev) {
    // If, and only if, the mouse button is held down, we want to delegate
    // to the `touch` event.
    if (ev.buttons === 1) {
      this.handlePress(ev);
    }
  }

  handlePress(ev) {
    // We need to calculate the relative position of the event, and pass it
    // onto our supplied touch handler.
    const boundingBox = this.elem.getBoundingClientRect();

    const x = (ev.clientX - boundingBox.left) / boundingBox.width;
    const y = (ev.clientY- boundingBox.top) / boundingBox.height;

    this.props.handlePress({ x, y });
  }

  release(ev) {

  }

  render() {
    const { width, height } = this.props;

    return (
      <div
        className="x-y-pad"
        ref={elem => { this.elem = elem; }}
        style={{ width, height }}
        onTouchStart={this.handlePress}
        onMouseDown={this.handlePress}
        onMouseMove={this.handleClick}
        onTouchEnd={this.props.handleRelease}
        onMouseUp={this.props.handleRelease}
      />
    );
  }
}

XYPad.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  handlePress: PropTypes.func.isRequired,
  handleRelease: PropTypes.func.isRequired,
};

XYPad.defaultProps = {
  width: 350,
  height: 350,
};

export default XYPad;
