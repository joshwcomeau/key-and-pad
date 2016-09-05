/* eslint-disable no-shadow */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';

import {
  tweakAxisParameter,
  changeAxisEffect,
} from '../../actions';
import { disabledEffectSelector } from '../../reducers/effects.reducer';
import effectDefaultOptions from '../../data/effect-default-options';

import Column from '../Column';
import Select from '../Select';
import Slider from '../Slider';


class AxisControls extends Component {
  constructor(props) {
    super(props);
    this.tweakAxisParameter = debounce(props.tweakAxisParameter, 500);
    this.handleChangeAxisEffect = this.handleChangeAxisEffect.bind(this);
  }

  handleChangeAxisEffect({ value }) {
    this.props.changeAxisEffect({
      axis: this.props.axis,
      effect: value,
    });
  }

  renderControls() {
    const {
      effect,
      axis,
      tweakAxisParameter,
    } = this.props;

    switch (effect.name) {
      case 'filter': {
        return (
          <div className="effect-controls">
            <h5>type</h5>
            <Select
              clearable={false}
              searchable={false}
              value={effect.options.filterType}
              className="axis-param-select"
              onChange={({ value }) => {
                tweakAxisParameter({
                  axis,
                  options: { filterType: value },
                });
              }}
              options={[
                { value: 'lowpass', label: 'low pass' },
                { value: 'highpass', label: 'high pass' },
                { value: 'bandpass', label: 'band pass' },
                { value: 'allpass', label: 'all pass' },
                { value: 'notch', label: 'notch' },
              ]}
            />

            <h5>resonance (Q)</h5>
            <Slider
              min={0}
              max={50}
              step={0.1}
              value={effect.options.resonance}
              onChange={val => {
                // Debounce the actual action-dispatch since it's kinda
                // slow, and doesn't need to be low-latency.
                tweakAxisParameter({
                  axis,
                  options: { resonance: val },
                });
              }}
            />
          </div>
        );
      }
      case 'distortion': {
        return (
          <div className="effect-controls">
            <h5>oversampling</h5>
            <Slider
              min={0}
              max={4}
              step={2}
              value={effect.options.oversample}
              onChange={val => {
                // Debounce the actual action-dispatch since it's kinda
                // slow, and doesn't need to be low-latency.
                tweakAxisParameter({
                  axis,
                  options: { oversample: val },
                });
              }}
            />
          </div>
        );
      }
      case 'reverb': {
        return (
          <div className="effect-controls">
            <h5>length</h5>
            <Slider
              min={0}
              max={8}
              step={0.1}
              value={effect.options.time}
              onChange={val => {
                // Debounce the actual action-dispatch since it's kinda
                // slow, and doesn't need to be low-latency.
                tweakAxisParameter({
                  axis,
                  options: { time: val },
                });
              }}
            />

            <h5>filter cutoff</h5>
            <Slider
              min={0}
              max={20000}
              step={1}
              value={effect.options.cutoff}
              onChange={val => {
                // Debounce the actual action-dispatch since it's kinda
                // slow, and doesn't need to be low-latency.
                tweakAxisParameter({
                  axis,
                  options: { cutoff: val },
                });
              }}
            />
          </div>
        );
      }
      default: return <div />;
    }
  }

  renderOptions() {
    const { disabledEffect } = this.props;
    const effectNames = Object.keys(effectDefaultOptions);

    return effectNames.map(name => ({
      value: name,
      label: name,
      disabled: name === disabledEffect,
    }));
  }

  render() {
    const {
      effect,
      axis,
    } = this.props;

    return (
      <Column className={`pad-${axis}`}>
        <h4>{`${axis} axis`}</h4>
        <Select
          clearable={false}
          searchable={false}
          className="axis-control-select"
          value={effect.name}
          onChange={this.handleChangeAxisEffect}
          options={this.renderOptions()}
        />

        {this.renderControls()}
      </Column>
    );
  }
}

AxisControls.propTypes = {
  effect: PropTypes.shape({
    name: PropTypes.string,
    active: PropTypes.bool,
    amount: PropTypes.number,
    options: PropTypes.object,
  }),
  axis: PropTypes.oneOf(['x', 'y']),
  disabledEffect: PropTypes.string,
  tweakAxisParameter: PropTypes.func.isRequired,
  changeAxisEffect: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { axis }) => ({
  effect: state.effects[axis],
  disabledEffect: disabledEffectSelector(state, axis),
});

export default connect(mapStateToProps, {
  tweakAxisParameter,
  changeAxisEffect,
})(AxisControls);
