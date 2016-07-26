import React, { Component } from 'react';
import { connect } from 'react-redux';

import { changeOscillatorWaveform } from '../../ducks/sounds.duck';
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
      <Button
        key={waveform}
        className={waveform === selectedWaveform ? 'selected' : null}
        handleClick={() => this.props.changeOscillatorWaveform({
          oscillatorIndex,
          waveform
        })}
      >
        <Waveform value={waveform} />
      </Button>
    ));
  }

  render() {
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
