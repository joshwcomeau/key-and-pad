/* eslint-disable no-unused-vars */
import { take, call, put, select } from 'redux-saga/effects';

import {
  experimentWithNotes,
  experimentWithPad,
  goToNextStage,
  GO_TO_NEXT_STAGE,
} from '../ducks/onboarding.duck';
import { ADD_NOTE } from '../ducks/notes.duck';
import { UPDATE_EFFECTS_AMOUNT } from '../ducks/effects.duck';
import { delay } from '../utils/misc-helpers';
import onboardingStages from '../data/onboarding-stages';
import {
  numOfKeypressesNeeded,
  numOfPadUpdatesNeeded,
} from '../data/onboarding-config';


function* handleKeyExperiments() {
  let keysPressed = 0;

  while (keysPressed < numOfKeypressesNeeded) {
    yield take(ADD_NOTE);
    yield put(experimentWithNotes());
    keysPressed++;
  }
}

function* handlePadExperiments() {
  let padUpdates = 0;

  while (padUpdates < numOfPadUpdatesNeeded) {
    yield take(UPDATE_EFFECTS_AMOUNT);

    const notes = yield select(state => state.notes);

    if (notes.length) {
      yield put(experimentWithPad());
      padUpdates++;
    }
  }
}

export default function* onboarding() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    yield take(GO_TO_NEXT_STAGE);

    const {
      stage,
      keysPressed,
      padUsed,
    } = yield select(state => state.onboarding);

    // stage: initial-confirmed
    yield delay(1000);
    yield put(goToNextStage());

    // stage: keys-introduced
    yield handleKeyExperiments();
    yield put(goToNextStage());
    yield delay(2000);
    yield put(goToNextStage());

    // stage: pad-introduced
    yield handlePadExperiments();
    yield put(goToNextStage());
    yield delay(2000);
    yield put(goToNextStage());

    // stage: control-panel-introduced
    yield delay(6000);
    yield put(goToNextStage());
  }
}
