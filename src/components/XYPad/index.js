import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { deactivateEffects, updateEffectsAmount } from '../../actions';
import { distanceBetween, angleBetween } from '../../utils/misc-helpers';

import XYPadAxisLabel from '../XYPadAxisLabel';
import Canvas from '../Canvas';
import './index.scss';


class XYPad extends Component {
  constructor(props) {
    super(props);
    this.calculateAndUpdatePosition = this.calculateAndUpdatePosition.bind(this);
    this.handleRelease = this.handleRelease.bind(this);
  }

  calculateAndUpdatePosition({ ctx, x, y }) {
    const amountX = x / this.props.width;
    const amountY = y / this.props.height;

    // Draw the indicator point
    const lastPoint = { x: this.props.cursorX, y: this.props.cursorY };
    const nextPoint = { x, y };
    const dist = distanceBetween(lastPoint, nextPoint);
    const angle = angleBetween(lastPoint, nextPoint);

    for (let i = 0; i < dist; i += 5) {
      const currentX = lastPoint.x + (Math.sin(angle) * i);
      const currentY = lastPoint.y + (Math.cos(angle) * i);
      ctx.beginPath();
      ctx.arc(currentX, currentY, 20, false, Math.PI * 2, false);
      ctx.closePath();
      ctx.fillStyle = '#F3A84E';
      ctx.fill();
    }

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
    const {
      width,
      height,
      isPressed,
      cursorX,
      cursorY,
      xAxisLabel,
      yAxisLabel,
    } = this.props;

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
            onMouseDrag={this.calculateAndUpdatePosition}
            draw={({ ctx }) => {
              ctx.globalAlpha = 0.2;
              ctx.fillStyle = '#FFF';
              ctx.fillRect(0, 0, width, height);
              ctx.globalAlpha = 1;
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
