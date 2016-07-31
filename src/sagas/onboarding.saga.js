/* eslint-disable no-unused-vars */
import { take, call, put, select } from 'redux-saga/effects';

import { delay } from '../utils/misc-helpers';
import { experimentWithNotes, next, NEXT } from '../ducks/onboarding.duck';
import { ADD_NOTE } from '../ducks/notes.duck';
import onboardingStages from '../data/onboarding-stages';
import { numOfKeysPressedNeeded } from '../data/onboarding-config';


export default function* onboarding() {
  while (true) {
    const n = yield take(NEXT);

    let onboardingState = yield select(state => state.onboarding);

    while (onboardingState.stage === 'keys-introduced') {
      yield take(ADD_NOTE);
      yield put(experimentWithNotes());

      let onboardingState = yield select(state => state.onboarding);

      // Once we've pressed >8 keys, we want to progress to the next stage
      if (onboardingState.keysPressed >= numOfKeysPressedNeeded) {
        yield put(next())
      }
    }
  }
}
