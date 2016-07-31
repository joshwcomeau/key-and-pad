import React from 'react';

import Subheading from '../Subheading';
import Icon from '../Icon';
import Row from '../Row';
import Column from '../Column';

import './index.scss';


const Introduction = () => (
  <div className="introduction">
    <Subheading>Welcome!</Subheading>
    <p>Keys&Pad is a Web Audio experiment, mapping a keyboard-controlled synthesizer with a mouse-controlled X/Y Pad (eg. Kaoss Pad).</p>
    <p>There are a few things you'll need:</p>

    <Column>
      <Row>
        <Icon value="volume_high" />
      </Row>
    </Column>
  </div>
);

export default Introduction;
