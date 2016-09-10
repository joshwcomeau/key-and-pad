import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { deactivateEffects, updateEffectsAmount } from '../../actions';

import XYPadAxisLabel from '../XYPadAxisLabel';
import './index.scss';


class XYPad extends Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRelease = this.handleRelease.bind(this);
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

    const cursorX = clientX - boundingBox.left;
    const cursorY = clientY - boundingBox.top;

    const amountX = cursorX / boundingBox.width;
    const amountY = cursorY / boundingBox.height;

    this.props.updateEffectsAmount({
      x: {
        amount: amountX,
        cursorPosition: cursorX,
      },
      y: {
        amount: amountY,
        cursorPosition: cursorY,
      },
    });
  }

  handleMouseMove(ev) {
    // We want to update the effects IF the mouse button is held down.
    // Because Safari sucks, we can't just use ev.buttons or ev.which.
    // Instead, we'll use the redux state. If the effect is active,
    // the mouse must be held down :)
    if (this.props.isPressed) {
      this.calculateAndUpdatePosition(ev.clientX, ev.clientY);
    }
  }

  handleClick(ev) {
    // This annoying workaround is because we can't directly throttle React
    // event handlers. Their event pooling system makes it so that by the
    // time the throttle fires, the event has been nullified.
    // See https://facebook.github.io/react/docs/events.html#event-pooling
    return this.calculateAndUpdatePosition(ev.clientX, ev.clientY);
  }

  handleRelease() {
    if (this.props.isPressed) {
      this.props.deactivateEffects();
    }
  }

  render() {
    const { xAxisLabel, yAxisLabel } = this.props;

    return (
      <div className="x-y-pad">
        <div
          className="pad"
          ref={elem => { this.elem = elem; }}
          onMouseDown={this.handleClick}
          onMouseMove={this.handleMouseMove}
        />
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
  cursorX: PropTypes.number,
  cursorY: PropTypes.number,
  xAxisLabel: PropTypes.string.isRequired,
  yAxisLabel: PropTypes.string.isRequired,
  isPressed: PropTypes.bool,
  updateEffectsAmount: PropTypes.func.isRequired,
  deactivateEffects: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  cursorX: state.effects.x.cursorPosition,
  cursorY: state.effects.y.cursorPosition,
  xAxisLabel: state.effects.x.name,
  yAxisLabel: state.effects.y.name,
  isPressed: state.effects.x.active && state.effects.y.active,
});

export const XYPadPresentational = XYPad;

export default connect(
  mapStateToProps,
  { updateEffectsAmount, deactivateEffects }
)(XYPad);
