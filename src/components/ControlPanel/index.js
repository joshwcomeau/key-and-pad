import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { updateOscillator } from '../../actions';
import { toRoman } from '../../utils/misc-helpers';

import AxisControl from '../AxisControl';
import Slider from '../Slider';
import Subheading from '../Subheading';
import ButtonToggleGroup from '../ButtonToggleGroup';
import Button from '../Button';
import Waveform from '../Waveform';
import Row from '../Row';
import Column from '../Column';
import './index.scss';


class ControlPanel extends Component {
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
            options: { gain: val },
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
            options: { octaveAdjustment: val },
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
            options: { detune: val },
          })}
        />
      </Column>
    );
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
            <AxisControl axis="x" />
            <AxisControl axis="y" />
          </Row>
        </div>
      </div>
    );
  }
}

ControlPanel.propTypes = {
  oscillators: PropTypes.array,
  updateOscillator: PropTypes.func,
};

const mapStateToProps = state => ({
  oscillators: state.oscillators,
});

const actions = {
  updateOscillator,
};

export default connect(mapStateToProps, actions)(ControlPanel);
