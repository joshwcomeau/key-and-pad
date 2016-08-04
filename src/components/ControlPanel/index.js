import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';

// eslint-disable-next-line no-unused-vars
import { changeAxisEffect, tweakAxisParameter } from '../../ducks/effects.duck';
import { updateOscillator } from '../../ducks/oscillators.duck';
import { toRoman } from '../../utils/misc-helpers';

// eslint-disable-next-line no-unused-vars
import Slider from '../Slider';
import Subheading from '../Subheading';
import ButtonToggleGroup from '../ButtonToggleGroup';
import Button from '../Button';
import Waveform from '../Waveform';
import Row from '../Row';
import Column from '../Column';
import Select from '../Select';
import './index.scss';

class ControlPanel extends Component {
  constructor(props) {
    super(props);
    this.tweakAxisParameter = debounce(props.tweakAxisParameter, 500);
  }

  renderWaveformToggles(oscillatorIndex) {
    const waveforms = ['sine', 'triangle', 'square', 'sawtooth'];
    const selectedWaveform = this.props.oscillators[oscillatorIndex].waveform;

    return waveforms.map(waveform => (
      <Button
        key={waveform}
        className={waveform === selectedWaveform ? 'selected' : null}
        handleClick={() => this.props.updateOscillator({
          index: oscillatorIndex,
          options: { waveform },
        })}
      >
        <Waveform value={waveform} />
      </Button>
    ));
  }

  renderAxisControls(axis) {
    const effect = this.props.effects[axis];
    let controls;

    switch (effect.name) {
      case 'filter': {
        controls = (
          <div className="effect-controls">
            <h5>type</h5>
            <Select
              clearable={false}
              searchable={false}
              value={this.props.effects[axis].options.filterType}
              className="axis-param-select"
              onChange={({ value }) => {
                this.props.tweakAxisParameter({
                  axis,
                  options: { filterType: value },
                })
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
              defaultValue={effect.options.resonance}
              onChange={val => {
                // Debounce the actual action-dispatch since it's kinda
                // slow, and doesn't need to be low-latency.
                this.tweakAxisParameter({
                  axis,
                  options: { resonance: val },
                });
              }}
            />
          </div>
        )
        break;
      }
      case 'distortion': {
        controls = (
          <div className="effect-controls">
            <h5>oversampling</h5>
            <Slider
              min={0}
              max={4}
              step={2}
              defaultValue={effect.options.oversample}
              onChange={val => {
                // Debounce the actual action-dispatch since it's kinda
                // slow, and doesn't need to be low-latency.
                this.tweakAxisParameter({
                  axis,
                  options: { oversample: val },
                });
              }}
            />
          </div>
        )
        break;
      }
      case 'reverb': {
        controls = (
          <div className="effect-controls">
            <h5>length</h5>
            <Slider
              min={0}
              max={8}
              step={0.1}
              defaultValue={effect.options.time}
              onChange={val => {
                // Debounce the actual action-dispatch since it's kinda
                // slow, and doesn't need to be low-latency.
                this.tweakAxisParameter({
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
              defaultValue={effect.options.cutoff}
              onChange={val => {
                // Debounce the actual action-dispatch since it's kinda
                // slow, and doesn't need to be low-latency.
                this.tweakAxisParameter({
                  axis,
                  options: { cutoff: val },
                });
              }}
            />
          </div>
        )
        break;
      }

      default: {
        controls = <div />
        break;
      }
    }
    return (
      <Column className={`pad-${axis}`}>
        <h4>{`${axis} axis`}</h4>
        <Select
          clearable={false}
          searchable={false}
          className="axis-control-select"
          value={this.props.effects[axis].name}
          onChange={({ value }) => {
            this.props.changeAxisEffect({
              axis,
              effect: value,
            })
          }}
          options={[
            { value: 'filter', label: 'filter' },
            { value: 'distortion', label: 'distortion' },
            { value: 'reverb', label: 'reverb' },
          ]}
        />

        {controls}
      </Column>
    )
  }

  renderOscillatorControls(index) {
    const oscillator = this.props.oscillators[index];
    const romanNum = toRoman(index + 1);

    return (
      <Column>
        <h4>oscillator {romanNum}</h4>
        <ButtonToggleGroup className="oscillator-waveform-toggle-group">
          {this.renderWaveformToggles(index)}
        </ButtonToggleGroup>

        <h5>gain</h5>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={oscillator.gain}
          onChange={val => this.props.updateOscillator({
            index,
            options: { gain: val }
          })}
        />

        <h5>octave</h5>
        <Slider
          min={-3}
          max={3}
          step={1}
          value={oscillator.octaveAdjustment}
          withMidpoint
          className="with-orange-handle"
          onChange={val => this.props.updateOscillator({
            index,
            options: { octaveAdjustment: val }
          })}
        />

        <h5>detune</h5>
        <Slider
          min={-100}
          max={100}
          step={1}
          value={oscillator.detune}
          withMidpoint
          className="with-orange-handle"
          onChange={val => this.props.updateOscillator({
            index,
            options: { detune: val }
          })}
        />
      </Column>
    )
  }

  render() {
    return (
      <div className="control-panel">
        <div className="panel keys">
          <Subheading underline="medium-gray">key controls</Subheading>

          <Row>
            {this.renderOscillatorControls(0)}
            {this.renderOscillatorControls(1)}
          </Row>
        </div>

        <div className="panel pad">
          <Subheading underline="medium-gray">pad controls</Subheading>
          <Row>
            {this.renderAxisControls('x')}
            {this.renderAxisControls('y')}
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  effects: state.effects,
  oscillators: state.oscillators,
});

const actions = {
  updateOscillator,
  changeAxisEffect,
  tweakAxisParameter,
};

export default connect(mapStateToProps, actions)(ControlPanel);
