import React from 'react';
import { connect } from 'react-redux';

import Header from '../Header';
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
import { numOfKeysPressedNeeded } from '../../data/onboarding-config';

import './reset.scss';
import './index.scss';


const App = ({
  isBeforeStage,
  isAtLeastStage,
  isSameStage,
  keysIntroProgress,
}) => (
  <div className="app">
    <Header />
    <div className="keys-and-pad">
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
            tipPosition: 'left',
            progress: keysIntroProgress,
            centered: true,
          }
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
      >
        <XYPad />
      </FeatureHighlight>
    </div>

    <FeatureHighlight
      showFeature={isAtLeastStage('control-panel-introduced')}
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
    state.onboarding.keysPressed / (numOfKeysPressedNeeded) * 100
  )
});

export default connect(mapStateToProps)(App);
