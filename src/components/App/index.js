import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Replay } from 'redux-vcr';

import Header from '../Header';
import Footer from '../Footer';
import Introduction from '../Introduction';
import PrivacyPolicy from '../PrivacyPolicy';
import XYPad from '../XYPad';
import Keyboard from '../Keyboard';
import ControlPanel from '../ControlPanel';
import FeatureHighlight from '../FeatureHighlight';
import DevTools from '../DevTools';

import {
  isBefore,
  isAfter,
  isAtLeast,
  isSame,
} from '../../utils/onboarding-helpers';
import keyboardLayout from '../../data/keyboard-layout';
import {
  numOfKeypressesNeeded,
  numOfPadUpdatesNeeded,
} from '../../data/onboarding-config';

import './index.scss';


const App = ({
  isBeforeStage,
  isAfterStage,
  isAtLeastStage,
  isSameStage,
  keysIntroProgress,
  padIntroProgress,
  isAdmin,
}) => (
  <div className="app">
    <FeatureHighlight
      animateInitialPosition
      showFeature={isAfterStage('initial')}
    >
      <Header />
    </FeatureHighlight>

    <FeatureHighlight
      className="introduction-wrapper"
      animateInitialPosition
      style={{ position: 'absolute' }}
      showFeature={isSameStage('initial')}
      removeFeature={isAfterStage('keys-introduced')}
    >
      <Introduction fadeUp={isAfterStage('initial')} />
    </FeatureHighlight>

    <div
      className="keys-and-pad"
      style={{
        pointerEvents: isAfterStage('initial') ? '' : 'none',
      }}
    >
      <FeatureHighlight
        className="keyboard-wrapper"
        animateInitialPosition
        showFeature={isAtLeastStage('keys-introduced')}
        centerHorizontally={isBeforeStage('pad-introduced')}
        centerVertically={isBeforeStage('control-panel-introduced')}
        pointerOptions={[
          {
            render: isSameStage('keys-introduced'),
            title: 'These are your keys.',
            text: 'Try pressing some buttons on your keyboard to get the hang of it.',
            position: 'bottom',
            tipPosition: 'left',
            progress: keysIntroProgress,
            centered: true,
          }, {
            render: isSameStage('keys-confirmed'),
            title: 'Beautiful!',
            text: 'Your music is like sunshine on a rainy day.',
            position: 'bottom',
            progress: keysIntroProgress,
            centered: true,
          },
        ]}
      >
        <Keyboard
          layout={keyboardLayout}
          enabled={isAtLeastStage('keys-introduced')}
        />
      </FeatureHighlight>

      <FeatureHighlight
        showFeature={isAtLeastStage('pad-introduced')}
        centerVertically={isBeforeStage('control-panel-introduced')}
        pointerOptions={[
          {
            render: isSameStage('pad-introduced'),
            title: 'This is your X/Y pad.',
            text: 'While playing, click and drag in the pad area to apply effects.',
            position: 'bottom',
            progress: padIntroProgress,
            centered: true,
          }, {
            render: isSameStage('pad-confirmed'),
            title: 'Phenomenal!',
            text: 'Such magnificent noises.',
            position: 'bottom',
            progress: padIntroProgress,
            centered: true,
          },
        ]}
      >
        <XYPad width={284} height={284} />
      </FeatureHighlight>
    </div>

    <FeatureHighlight
      className="control-panel-feature"
      showFeature={isAtLeastStage('control-panel-introduced')}
      gradient={isSameStage('control-panel-introduced')}
      pointerOptions={[
        {
          render: isSameStage('control-panel-introduced'),
          title: 'Finally, this is your control panel.',
          text: 'Experimentation is the key to success.',
          position: 'top',
          tipPosition: 'center',
          centered: true,
          bubble: true,
        }, {
          render: isSameStage('control-panel-confirmed'),
          title: "You're all set!",
          text: 'Make something wonderful.',
          position: 'top',
          centered: true,
          bubble: true,
        },
      ]}
    >
      <ControlPanel />
    </FeatureHighlight>

    <FeatureHighlight
      showFeature={isAtLeastStage('keys-introduced')}
    >
      {/*
        The footer is also shown in the Introduction component.
        This is to ensure it's visible above the fold initially.
        Because we're recording user sessions, we want to be very transparent
        about our privacy policy.
      */}
      <Footer />
    </FeatureHighlight>

    <PrivacyPolicy />

    <DevTools />
    {isAdmin && <Replay />}
  </div>
);

App.propTypes = {
  isBeforeStage: PropTypes.func,
  isAfterStage: PropTypes.func,
  isAtLeastStage: PropTypes.func,
  isSameStage: PropTypes.func,
  keysIntroProgress: PropTypes.number,
  padIntroProgress: PropTypes.number,
  isAdmin: PropTypes.bool,
};

const mapStateToProps = state => ({
  // Partially apply our stage selectors with the current stage.
  // This way, we only need to pass the stage we're curious about.
  isBeforeStage: isBefore(state.onboarding.stage),
  isAfterStage: isAfter(state.onboarding.stage),
  isAtLeastStage: isAtLeast(state.onboarding.stage),
  isSameStage: isSame(state.onboarding.stage),
  keysIntroProgress: (
    state.onboarding.keysPressed / (numOfKeypressesNeeded) * 100
  ),
  padIntroProgress: (
    state.onboarding.padUpdates / (numOfPadUpdatesNeeded) * 100
  ),
  isAdmin: state.isAdmin,
});

export default connect(mapStateToProps)(App);
