/* eslint-disable no-unused-vars */
import { take, call, put, select } from 'redux-saga/effects';

import {
  experimentWithNotes,
  experimentWithPad,
  goToNextStage,
  completeOnboarding,
  GO_TO_NEXT_STAGE,
  ADD_NOTE,
  UPDATE_EFFECTS_AMOUNT,
} from '../actions';
import { delay } from '../utils/misc-helpers';
import onboardingStages from '../data/onboarding-stages';
import { ONBOARDING_COMPLETED_FLAG } from '../data/app-constants';
import {
  numOfKeypressesNeeded,
  numOfPadUpdatesNeeded,
} from '../data/onboarding-config';


export function* handleKeyExperiments() {
  let keysPressed = 0;

  while (keysPressed < numOfKeypressesNeeded) {
    yield take(ADD_NOTE);
    yield put(experimentWithNotes());
    keysPressed++;
  }
}

export function* handlePadExperiments() {
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
  yield take(GO_TO_NEXT_STAGE);

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
  yield delay(5000);
  yield put(goToNextStage());
  yield delay(2000);

  // Persist a flag in localStorage, so that this user does not
  // have to go through the onboarding flow again.
  localStorage.setItem(ONBOARDING_COMPLETED_FLAG, true);
  yield put(completeOnboarding());
}
