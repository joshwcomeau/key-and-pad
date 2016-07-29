import React, { Component } from 'react';
import { connect } from 'react-redux';

import { changeAxisEffect, tweakAxisParameter } from '../../ducks/effects.duck';
import { updateOscillator } from '../../ducks/oscillators.duck';

// eslint-disable-next-line no-unused-vars
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
    return (
      <Column className={`pad-${axis}`}>
        <h5>{`${axis} axis`}</h5>
        <select
          value={this.props.effects[axis].name}
          onChange={ev => this.props.changeAxisEffect({
            axis,
            effect: ev.target.value,
          })}
        >
          <option>filter</option>
          <option>distortion</option>
          <option>delay</option>
          <option>reverb</option>
        </select>
      </Column>
    )
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
            {this.renderAxisControls('x')}
            {this.renderAxisControls('y')}
          </Row>
        </div>
      </div>

    )
  }
}

const mapStateToProps = state => ({
  effects: state.effects,
  oscillators: state.oscillators,
});

const actions = {
  updateOscillator,
  changeAxisEffect,
};

export default connect(mapStateToProps, actions)(ControlPanel);
