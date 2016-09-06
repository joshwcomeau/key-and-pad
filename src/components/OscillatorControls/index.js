/* eslint-disable no-shadow */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { updateOscillator } from '../../actions';
import { toRoman } from '../../utils/misc-helpers';

import ButtonToggleGroup from '../ButtonToggleGroup';
import Column from '../Column';
import Slider from '../Slider';
import Button from '../Button';
import Waveform from '../Waveform';


const waveforms = ['sine', 'triangle', 'square', 'sawtooth'];

class AxisControls extends Component {
  renderWaveformToggles() {
    const { index, oscillator, updateOscillator } = this.props;
    const selectedWaveform = oscillator.waveform;

    return waveforms.map(waveform => (
      <Button
        key={waveform}
        className={waveform === selectedWaveform ? 'selected' : null}
        handleClick={() => updateOscillator({
          index,
          options: { waveform },
        })}
      >
        <Waveform value={waveform} />
      </Button>
    ));
  }

  render() {
    const { index, oscillator, updateOscillator } = this.props;
    const romanNum = toRoman(index + 1);

    return (
      <Column>
        <h4>oscillator {romanNum}</h4>
        <ButtonToggleGroup className="oscillator-waveform-toggle-group">
          {this.renderWaveformToggles()}
        </ButtonToggleGroup>

        <h5>gain</h5>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={oscillator.gain}
          onChange={val => updateOscillator({
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
          onChange={val => updateOscillator({
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
          onChange={val => updateOscillator({
            index,
            options: { detune: val },
          })}
        />
      </Column>
    );
  }
}

AxisControls.propTypes = {
  index: PropTypes.number,
  oscillator: PropTypes.shape({
    waveform: PropTypes.oneOf(waveforms),
    gain: PropTypes.number,
    octaveAdjustment: PropTypes.number,
    detune: PropTypes.number,
  }),
  updateOscillator: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { index }) => {
  return {
    oscillator: state.oscillators[index],
  };
};

export default connect(mapStateToProps, {
  updateOscillator,
})(AxisControls);
