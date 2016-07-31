import React from 'react';
import { connect } from 'react-redux';

import { next } from '../../ducks/onboarding.duck';

import Subheading from '../Subheading';
import Icon from '../Icon';
import IconCycle from '../IconCycle';
import Button from '../Button';
import Row from '../Row';
import Column from '../Column';

import './index.scss';


const Introduction = ({ next }) => (
  <div className="introduction">
    <header>
      <Subheading className="title">Welcome!</Subheading>
      <p>Keys&Pad is a Web Audio experiment, combining a keyboard-controlled synthesizer with a mouse-controlled X/Y Pad (eg. Kaoss Pad).</p>
      <p>There are a few things you'll need:</p>
    </header>

    <Row>
      <Column>
        <Icon value="keyboard" size={64} />
        <Icon value="trackpad" size={64} />
        <Subheading className="requirement-subheading">
          Hardware
        </Subheading>
        <p>
          A physical keyboard and mouse or trackpad.
        </p>
      </Column>
      <Column>
        <IconCycle
          values={['volume_high', 'volume_med', 'volume_low', 'volume_med']}
          speed={250}
          size={64}
        />
        <Subheading className="requirement-subheading">
          Speakers / Headphones
        </Subheading>
        <p>
          This won't be very interesting without sound!
        </p>
      </Column>
      <Column>
        <Icon value="music_note" size={64} />
        <Icon value="very_happy" size={64} />
        <Subheading className="requirement-subheading">
          Creativity
        </Subheading>
        <p>
          Try crazy things, make weird noises.
        </p>
      </Column>
    </Row>

    <Button onClick={next}>Let's Go!</Button>
  </div>
);


export default connect(null, { next })(Introduction);
