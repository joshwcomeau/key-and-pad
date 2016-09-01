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

export default function onboardingReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_STAGE: {
      return {
        ...state,
        stage: action.stage,
      };
    }

    case GO_TO_NEXT_STAGE: {
      const currentIndex = onboardingStages.indexOf(state.stage);
      return {
        ...state,
        stage: onboardingStages[currentIndex + 1],
      };
    }

    case COMPLETE_ONBOARDING: {
      return {
        ...state,
        stage: onboardingStages[onboardingStages.length - 1],
      };
    }

    case EXPERIMENT_WITH_NOTES: {
      return {
        ...state,
        keysPressed: state.keysPressed + 1,
      };
    }

    case EXPERIMENT_WITH_PAD: {
      return {
        ...state,
        padUpdates: state.padUpdates + 1,
      };
    }

    default:
      return state;
  }
}
