import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { deactivateEffects, updateEffectsAmount } from '../../actions';
import { distanceBetween, angleBetween } from '../../utils/misc-helpers';

import XYPadAxisLabel from '../XYPadAxisLabel';
import Canvas from '../Canvas';
import './index.scss';


const cursorRadius = 6;

class XYPad extends Component {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleRelease = this.handleRelease.bind(this);
  }

  drawCursor({ ctx, x, y }) {
    ctx.beginPath();
    ctx.arc(x, y, cursorRadius, false, Math.PI * 2, false);
    ctx.closePath();
    ctx.fillStyle = '#F3A84E';
    ctx.fill();
  }

  updateCursor({ ctx, x, y, connectPrevious }) {
    // If we don't want to connect previous, this is easy!
    if (!connectPrevious) {
      this.drawCursor({ ctx, x, y });
    } else {
      const lastPoint = { x: this.props.cursorX, y: this.props.cursorY };
      const nextPoint = { x, y };
      const dist = distanceBetween(lastPoint, nextPoint);
      const angle = angleBetween(lastPoint, nextPoint);

      for (let i = 0; i <= dist; i += 5) {
        const currentX = lastPoint.x + (Math.sin(angle) * i);
        const currentY = lastPoint.y + (Math.cos(angle) * i);

        this.drawCursor({ ctx, x: currentX, y: currentY });
      }
    }
  }

  updateEffects({ x, y }) {
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

  handleMouseDown({ ctx, x, y }) {
    this.updateCursor({ ctx, x, y, connectPrevious: false });
    this.updateEffects({ x, y });
  }

  handleDrag({ ctx, x, y }) {
    this.updateCursor({ ctx, x, y, connectPrevious: true });
    this.updateEffects({ x, y });
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
            onMouseDown={this.handleMouseDown}
            onMouseDrag={this.handleDrag}
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
