import React from 'react';
import { connect } from 'react-redux';

import Header from '../Header';
import Introduction from '../Introduction';
import XYPad from '../XYPad';
import Keyboard from '../Keyboard';
import ControlPanel from '../ControlPanel';
import DevTools from '../DevTools';
import FeatureHighlight from '../FeatureHighlight';

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

import './reset.scss';
import './index.scss';


const App = ({
  isBeforeStage,
  isAfterStage,
  isAtLeastStage,
  isSameStage,
  keysIntroProgress,
  padIntroProgress,
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
    >
      <Introduction fadeUp={isAfterStage('initial')}/>
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
            title: "These are your keys.",
            text: "Try pressing some buttons on your keyboard to get the hang of it.",
            position: 'bottom',
            tipPosition: 'left',
            progress: keysIntroProgress,
            centered: true,
          }, {
            render: isSameStage('keys-confirmed'),
            title: "Beautiful!",
            text: "Your music is like sunshine on a rainy day.",
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
            text: 'Pack your suitcases, you\'ll be headlining in Ibiza soon.',
            position: 'bottom',
            progress: padIntroProgress,
            centered: true,
          },
        ]}
      >
        <XYPad />
      </FeatureHighlight>
    </div>

    <FeatureHighlight
      showFeature={isAtLeastStage('control-panel-introduced')}
      pointerOptions={[
        {
          render: isSameStage('control-panel-introduced'),
          title: 'Finally, this is your control panel.',
          text: 'For best results, experiment with all the different settings and effects.',
          position: 'top',
          tipPosition: 'center',
          centered: true,
          bubble: true
        }
      ]}
    >
      <ControlPanel />
    </FeatureHighlight>

    <DevTools />
  </div>
);

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
});

export default connect(mapStateToProps)(App);
