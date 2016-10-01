import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { deactivateEffects, updateEffectsAmount } from '../../actions';
import { distanceBetween, angleBetween } from '../../utils/misc-helpers';

import XYPadAxisLabel from '../XYPadAxisLabel';
import Canvas from '../Canvas';
import './index.scss';


// NOTE: The flow of events in this component is a little confusing at first,
// but it's actually quite nice:
//
// - The user clicks on the pad
// - `handlePress` dispatches `this.props.updateEffectsAmount`,
//   triggering an update.
// - We have a fancy cursor with trails. We can use the current and next
//   props to calculate the cursor trails. We do this in
//   `componentWillReceiveProps`, so that we can hook into this update cycle.
// - We use local component state to store the new set of cursor trails.
// - The Canvas component is given the set of shapes to render.
//
// Everything happens in the same update cycle, and it's surprisingly performant!

const ACTIVE_COLOR = '#f3ca4f';
const INACTIVE_COLOR = '#edf2f3';

const cursorShape = {
  type: 'circle',
  radius: 6,
};

class XYPad extends Component {
  constructor(props) {
    super(props);

    this.handleRelease = this.handleRelease.bind(this);
    this.handlePress = this.handlePress.bind(this);

    this.state = {
      cursorTrail: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    this.updateCursor({
      x: this.props.cursorX,
      y: this.props.cursorY,
      nextX: nextProps.cursorX,
      nextY: nextProps.cursorY,
      // If this is a 'drag', the current state would be pressed.
      // We want to create a trail from it.
      showTrail: this.props.isPressed,
      color: nextProps.isActive ? ACTIVE_COLOR : INACTIVE_COLOR,
    });
  }

  shouldComponentUpdate(nextProps) {
    // We only need to update when :
    // - the XYPad is pressed,
    // - the XYPad is becoming pressed,
    // - The axis effect changes (update displayed label)
    const isXYPadPressed = this.props.isPressed || nextProps.isPressed;
    const hasXLabelChanged = this.props.xAxisLabel !== nextProps.xAxisLabel;
    const hasYLabelChanged = this.props.yAxisLabel !== nextProps.yAxisLabel;

    return isXYPadPressed || hasXLabelChanged || hasYLabelChanged;
  }

  updateCursor({ x, y, nextX, nextY, showTrail, color }) {
    const nextCursorTrail = [];

    if (!showTrail) {
      nextCursorTrail.push({
        ...cursorShape,
        color,
        x: nextX,
        y: nextY,
      });
    } else {
      const currentPoint = { x, y };
      const nextPoint = { x: nextX, y: nextY };
      const dist = distanceBetween(currentPoint, nextPoint);
      const angle = angleBetween(currentPoint, nextPoint);

      for (let i = 0; i <= dist; i += 5) {
        nextCursorTrail.push({
          ...cursorShape,
          color,
          x: currentPoint.x + (Math.sin(angle) * i),
          y: currentPoint.y + (Math.cos(angle) * i),
        });
      }
    }

    this.setState({ cursorTrail: nextCursorTrail });
  }

  handlePress({ x, y }) {
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
    const {
      width,
      height,
      xAxisLabel,
      yAxisLabel,
    } = this.props;

    return (
      <div className="x-y-pad">
        <Canvas
          className="pad"
          width={width}
          height={height}
          fadeContentsAway
          onMouseUp={this.handleRelease}
          onMouseDown={this.handlePress}
          onMouseDrag={this.handlePress}
          onMouseRightClick={this.handlePress}
          shapes={this.state.cursorTrail}
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
  width: PropTypes.number,
  height: PropTypes.number,
  cursorX: PropTypes.number,
  cursorY: PropTypes.number,
  xAxisLabel: PropTypes.string.isRequired,
  yAxisLabel: PropTypes.string.isRequired,
  isPressed: PropTypes.bool,
  isActive: PropTypes.bool,
  updateEffectsAmount: PropTypes.func.isRequired,
  deactivateEffects: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  cursorX: state.effects.x.cursorPosition,
  cursorY: state.effects.y.cursorPosition,
  xAxisLabel: state.effects.x.name,
  yAxisLabel: state.effects.y.name,
  isPressed: state.effects.x.active && state.effects.y.active,
  isActive: state.notes.length > 0,
});

export const XYPadPresentational = XYPad;

export default connect(
  mapStateToProps,
  { updateEffectsAmount, deactivateEffects }
)(XYPad);
