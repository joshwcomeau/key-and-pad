import React from 'react';

import AxisControls from '../AxisControls';
import OscillatorControls from '../OscillatorControls';
import Subheading from '../Subheading';
import Row from '../Row';
import './index.scss';


const ControlPanel = () => (
  <div className="control-panel">
    <div className="panel keys">
      <Subheading underline="medium-gray">key controls</Subheading>

      <Row>
        <OscillatorControls index={0} />
        <OscillatorControls index={1} />
      </Row>
    </div>

    <div className="panel pad">
      <Subheading underline="medium-gray">pad controls</Subheading>
      <Row>
        <AxisControls axis="x" />
        <AxisControls axis="y" />
      </Row>
    </div>
  </div>
);

ControlPanel.propTypes = {};

export default ControlPanel;
