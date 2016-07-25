import React from 'react';
import { connect } from 'react-redux';

import { changeOscillatorWaveform } from '../../ducks/sounds.duck';
import { getWaveformId, getWaveformName } from '../../utils/conversion';
import Slider from '../Slider';
import Subheading from '../Subheading';
import './index.scss';

export const ControlPanel = ({ sounds, changeOscillatorWaveform }) => (
  <div className="control-panel">
    <div className="panel keys">
      <Subheading>keys</Subheading>

      <h5>oscillator I</h5>
      <Slider
        type="oscillator"
        value={getWaveformId(sounds.oscillators[0])}
        onChange={val => changeOscillatorWaveform({
          oscillator: 0,
          waveform: getWaveformName(val),
        })}
      >
        <div className="oscillator-handle">1</div>
      </Slider>

    </div>

    <div className="panel pad">
      <Subheading>pad</Subheading>
    </div>
  </div>
);

const mapStateToProps = state => ({
  sounds: state.sounds,
});

const actions = {
  changeOscillatorWaveform,
};

export default connect(mapStateToProps, actions)(ControlPanel);
