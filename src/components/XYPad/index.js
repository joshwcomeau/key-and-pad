import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { updatePosition, releasePad } from '../../ducks/x-y-pad.duck';
import XYPadAxisLabel from '../XYPadAxisLabel';
import './index.scss';


export class XYPad extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.handleRelease = this.handleRelease.bind(this);

    this.state = {};
  }

  calculateAndUpdatePosition(clientX, clientY) {
    // We need to calculate the relative position of the event, and pass it
    // onto our supplied touch handler.
    const boundingBox = this.elem.getBoundingClientRect();

    const offsetX = clientX - boundingBox.left;
    const offsetY = clientY - boundingBox.top;

    const x = offsetX / boundingBox.width;
    const y = offsetY / boundingBox.height;

    this.props.updatePosition({ x, y });

    // Also, we need a visual cue!
    // move the red circle to the cursor's position
    // I'm doing this imperatively for perf reasons :(
    this.setState({ offsetX, offsetY, isPressed: true })
  }

  handleClick(ev) {
    // If, and only if, the mouse button is held down, we want to delegate
    // to the `touch` event.
    if (ev.buttons === 1) {
      this.handlePress(ev);
    }
  }

  handlePress(ev) {
    // This annoying workaround is because we can't directly throttle React
    // event handlers. Their event pooling system makes it so that by the
    // time the throttle fires, the event has been nullified.
    // See https://facebook.github.io/react/docs/events.html#event-pooling
    return this.calculateAndUpdatePosition(ev.clientX, ev.clientY);
  }

  handleRelease() {
    this.props.releasePad();
    this.setState({ isPressed: false });
  }

  render() {
    const svgClasses = classNames(
      'pointer-indicator',
      { 'is-pressed': this.state.isPressed }
    );

    const { xAxisLabel, yAxisLabel } = this.props;

    return (
      <div className="x-y-pad">
        <div
          className="pad"
          ref={elem => { this.elem = elem; }}
          onTouchStart={this.handlePress}
          onMouseDown={this.handlePress}
          onMouseMove={this.handleClick}
          onTouchEnd={this.handleRelease}
          onMouseUp={this.handleRelease}
        >
          <svg
            width="100%"
            height="100%"
            className={svgClasses}
          >
            <circle cx={this.state.offsetX} cy={this.state.offsetY} r="10" />
            <circle cx={this.state.offsetX} cy={this.state.offsetY} r="10" />
          </svg>
        </div>
        <XYPadAxisLabel
          label={xAxisLabel}
          className="horizontal-axis"
          includeRightArrow
        />
        <XYPadAxisLabel
          label={yAxisLabel}
          className="vertical-axis"
          includeLeftArrow
          />
      </div>
    );
  }
}

XYPad.propTypes = {
  updatePosition: PropTypes.func.isRequired,
  releasePad: PropTypes.func.isRequired,
  xAxisLabel: PropTypes.string.isRequired,
  yAxisLabel: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  xAxisLabel: state.sounds.x.effect,
  yAxisLabel: state.sounds.y.effect,
});

export default connect(
  mapStateToProps,
  { updatePosition, releasePad }
)(XYPad);
