/* eslint-disable no-unused-vars */
import { take, call, put, select } from 'redux-saga/effects';

import {
  experimentWithNotes,
  experimentWithPad,
  next,
  NEXT,
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
  while (true) {
    yield take(NEXT);
    let {
      stage,
      keysPressed,
      padUsed,
    } = yield select(state => state.onboarding);

    switch (stage) {
      case 'initial-confirmed': {
        yield delay(1000);
        yield put(next());
      }

      case 'keys-introduced': {
        yield handleKeyExperiments();

        yield put(next());
        yield delay(2000);
        yield put(next());
      }

      case 'pad-introduced': {
        yield handlePadExperiments();

        yield put(next());
        yield delay(2000);
        yield put(next());
      }

      case 'control-panel-introduced': {
        yield delay(6000);
        yield put(next());
      }
    }
  }
}
