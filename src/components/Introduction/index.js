/* eslint-disable max-len */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { goToNextStage } from '../../actions';

import Logo from '../Logo';
import Footer from '../Footer';
import Subheading from '../Subheading';
import Icon from '../Icon';
import IconCycle from '../IconCycle';
import IconWithHover from '../IconWithHover';
import Button from '../Button';
import Row from '../Row';
import Column from '../Column';

import './index.scss';


// eslint-disable-next-line no-shadow
const Introduction = ({ goToNextStage, fadeUp }) => (
  <div className="introduction">
    <section className={classNames('main-contents', { 'fade-up': fadeUp })}>
      <header>
        <Subheading className="title">Welcome!</Subheading>
        <p>
          <Logo size="small" />
          &nbsp;is a Web Audio experiment, combining a keyboard-controlled synthesizer with a mouse-controlled X/Y Pad (eg. Kaoss Pad).
        </p>
        <p>There are a few things you'll need:</p>
      </header>

      <Row>
        <Column>
          <Icon value="keyboard" size={72} />
          <Subheading underline="navy">
            Hardware
          </Subheading>
          <p>
            A physical keyboard, as well as a trackpad or mouse.
          </p>
        </Column>
        <Column>
          <IconCycle
            values={['volume_high', 'volume_med', 'volume_low', 'volume_med']}
            styles={[
              {},
              { transform: 'translateX(-6px)' },
              { transform: 'translateX(-12px)' },
              { transform: 'translateX(-6px)' },
            ]}
            speed={250}
            size={72}
          />
          <Subheading underline="navy">
            Sound
          </Subheading>
          <p>
            This won't be very interesting without headphones or speakers.
          </p>
        </Column>
        <Column>
          <Icon value="music_note" size={72} />
          <IconWithHover value="happy" hoverValue="very_happy" size={72} />
          <Subheading underline="navy">
            Creativity
          </Subheading>
          <p>
            Try crazy things, make weird noises. The world is your oyster!
          </p>
        </Column>
      </Row>
    </section>

    <div className="button-wrapper">
      <Button className="primary" onClick={goToNextStage}>
        Let's Go!
        <Icon value="arrow_right" color="#FFF" />
      </Button>
    </div>

    <Footer />
  </div>
);

Introduction.propTypes = {
  goToNextStage: PropTypes.func.isRequired,
  fadeUp: PropTypes.bool,
};


export default connect(
  null,
  { goToNextStage }
)(Introduction);
