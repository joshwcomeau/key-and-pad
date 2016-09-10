import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { deactivateEffects, updateEffectsAmount } from '../../actions';

import XYPadAxisLabel from '../XYPadAxisLabel';
import Canvas from '../Canvas';
import './index.scss';


class XYPad extends Component {
  constructor(props) {
    super(props);
    this.calculateAndUpdatePosition = this.calculateAndUpdatePosition.bind(this);
    this.handleRelease = this.handleRelease.bind(this);
  }

  calculateAndUpdatePosition({ x, y }) {
    const amountX = x / this.props.width;
    const amountY = y / this.props.height;

    this.props.updateEffectsAmount({
      x: {
        amount: amountX,
        cursorPosition: x,
      },
      y: {
        amount: amountY,
        cursorPosition: y,
      },
    });
  }

  handleRelease() {
    if (this.props.isPressed) {
      this.props.deactivateEffects();
    }
  }

  render() {
    const { width, height, cursorX, cursorY, xAxisLabel, yAxisLabel } = this.props;

    return (
      <div className="x-y-pad">
        <div
          className="pad"
          ref={elem => { this.elem = elem; }}
        >
          <Canvas
            width={width}
            height={height}
            onMouseUp={this.handleRelease}
            onMouseDown={this.calculateAndUpdatePosition}
            onMouseMove={this.calculateAndUpdatePosition}
            draw={({ canvas, ctx }) => {
              ctx.clearRect(0, 0, width, height);

              ctx.beginPath();
              ctx.arc(cursorX, cursorY, 15, 0, 2 * Math.PI, false);

              // If the effect is active, we want a filled circle.
              // Otherwise, we want an outlined one.
              ctx.fillStyle = 'green';
              ctx.fill();
            }}
          />
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
  width: PropTypes.number,
  height: PropTypes.number,
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
