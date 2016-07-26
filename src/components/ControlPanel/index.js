import React, { Component } from 'react';
import { connect } from 'react-redux';

import { changeOscillatorWaveform } from '../../ducks/sounds.duck';
import { getWaveformId, getWaveformName } from '../../utils/conversion';
import Slider from '../Slider';
import Subheading from '../Subheading';
import ButtonToggleGroup from '../ButtonToggleGroup';
import Button from '../Button';
import Waveform from '../Waveform';
import './index.scss';

class ControlPanel extends Component {
  renderOscillatorToggles(oscillatorIndex) {
    const waveforms = ['sine', 'triangle', 'square', 'sawtooth'];
    const selectedWaveform = this.props.sounds.oscillators[oscillatorIndex];

    return waveforms.map(waveform => (
      <Button className={waveform === selectedWaveform ? 'selected' : null}>
        <Waveform value={waveform} />
      </Button>
    ));
  }

  render() {
    const { oscillators } = this.props.sounds;

    return (
      <div className="control-panel">
        <div className="panel keys">
          <Subheading>keys</Subheading>

          <h5>oscillator I</h5>
          <ButtonToggleGroup className="oscillator-waveform-toggle-group">
            {this.renderOscillatorToggles(0)}
          </ButtonToggleGroup>

          <h5>oscillator II</h5>
          <ButtonToggleGroup className="oscillator-waveform-toggle-group">
            {this.renderOscillatorToggles(1)}
          </ButtonToggleGroup>
        </div>

        <div className="panel pad">
          <Subheading>pad</Subheading>
        </div>
      </div>

    )
  }
}

const mapStateToProps = state => ({
  sounds: state.sounds,
});

const actions = {
  changeOscillatorWaveform,
};

export default connect(mapStateToProps, actions)(ControlPanel);
