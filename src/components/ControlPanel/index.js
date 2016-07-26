import React, { Component } from 'react';
import { connect } from 'react-redux';

import { changeOscillatorWaveform } from '../../ducks/sounds.duck';
import Slider from '../Slider';
import Subheading from '../Subheading';
import ButtonToggleGroup from '../ButtonToggleGroup';
import Button from '../Button';
import Waveform from '../Waveform';
import Row from '../Row';
import Column from '../Column';
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

          <Row>
            <Column>
              <h5>oscillator I</h5>
              <ButtonToggleGroup className="oscillator-waveform-toggle-group">
                {this.renderOscillatorToggles(0)}
              </ButtonToggleGroup>
            </Column>

            <Column>
              <h5>oscillator II</h5>
              <ButtonToggleGroup className="oscillator-waveform-toggle-group">
                {this.renderOscillatorToggles(1)}
              </ButtonToggleGroup>
            </Column>
          </Row>
        </div>

        <div className="panel pad">
          <Subheading>pad</Subheading>
          <Row>
            <div className="pad-x">
              <h5>x axis</h5>
              <select>
                <option>filter frequency</option>
                <option>filter resonance</option>
                <option>distortion</option>
                <option>delay</option>
                <option>reverb</option>
              </select>
            </div>
            <div className="pad-y">
              <h5>y axis</h5>
              <select>
                <option>filter frequency</option>
                <option>filter resonance</option>
                <option>distortion</option>
                <option>delay</option>
                <option>reverb</option>
              </select>
            </div>
          </Row>
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
