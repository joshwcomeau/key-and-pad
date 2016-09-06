import { combineReducers } from 'redux';
import onboardingStages from '../data/onboarding-stages';

import {
  UPDATE_STAGE,
  GO_TO_NEXT_STAGE,
  COMPLETE_ONBOARDING,
  EXPERIMENT_WITH_NOTES,
  EXPERIMENT_WITH_PAD,
} from '../actions';


const initialState = {
  stage: onboardingStages[0],
  keysPressed: 0,
  padUpdates: 0,
};

const stage = (state = initialState.stage, action) => {
  switch (action.type) {
    case UPDATE_STAGE: return action.stage;

    case GO_TO_NEXT_STAGE: {
      const currentIndex = onboardingStages.indexOf(state);

      const isFinalStage = currentIndex === onboardingStages.length - 1;

      return isFinalStage ? state : onboardingStages[currentIndex + 1];
    }

    case COMPLETE_ONBOARDING: {
      return onboardingStages[onboardingStages.length - 1];
    }

    default: return state;
  }
};

const keysPressed = (state = initialState.keysPressed, action) => {
  switch (action.type) {
    case EXPERIMENT_WITH_NOTES: return state + 1;
    default: return state;
  }
};

const padUpdates = (state = initialState.padUpdates, action) => {
  switch (action.type) {
    case EXPERIMENT_WITH_PAD: return state + 1;
    default: return state;
  }
};

export default combineReducers({ stage, keysPressed, padUpdates });
