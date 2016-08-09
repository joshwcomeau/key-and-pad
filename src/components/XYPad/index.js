import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { deactivateEffects, updateEffectsAmount } from '../../ducks/effects.duck';

import XYPadAxisLabel from '../XYPadAxisLabel';
import './index.scss';


class XYPad extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.handleRelease = this.handleRelease.bind(this);

    this.state = {};
  }

  componentDidMount() {
    // Binding this to window instead of the pad itself so that we catch
    // events that happen slightly outside the box.
    window.addEventListener('mouseup', this.handleRelease);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.handleRelease);
  }

  calculateAndUpdatePosition(clientX, clientY) {
    // We need to calculate the relative position of the event, and pass it
    // onto our supplied touch handler.
    const boundingBox = this.elem.getBoundingClientRect();

    const offsetX = clientX - boundingBox.left;
    const offsetY = clientY - boundingBox.top;

    const x = offsetX / boundingBox.width;
    const y = offsetY / boundingBox.height;

    this.props.updateEffectsAmount({
      xAmount: x,
      yAmount: y,
    });

    // Also, we need a visual cue!
    // move the red circle to the cursor's position
    // I'm doing this imperatively for perf reasons :(
    this.setState({ offsetX, offsetY, isPressed: true });
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
    if (this.state.isPressed) {
      this.props.deactivateEffects();
      this.setState({ isPressed: false });
    }
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
  updateEffectsAmount: PropTypes.func.isRequired,
  deactivateEffects: PropTypes.func.isRequired,
  xAxisLabel: PropTypes.string.isRequired,
  yAxisLabel: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  xAxisLabel: state.effects.x.name,
  yAxisLabel: state.effects.y.name,
});

export const XYPadPresentational = XYPad;

export default connect(
  mapStateToProps,
  { updateEffectsAmount, deactivateEffects }
)(XYPad);
