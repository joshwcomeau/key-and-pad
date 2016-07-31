import { takeEvery } from 'redux-saga';
import { take, call, put, select } from 'redux-saga/effects';

import { delay } from '../utils/misc-helpers';
import { NEXT } from '../ducks/onboarding.duck';


export default function* onboarding() {
  while (true) {
    const onboardingState = yield select(state => state.onboarding);

    // Our initial state is an intro screen.
    // It can be progressed through the 'next' action, dispatched from a btn click
    yield take(NEXT);

    console.log("Onboarding state", onboardingState);
  }
}
