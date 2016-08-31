import onboardingStages from '../data/onboarding-stages';

const initialState = {
  stage: onboardingStages[0],
  keysPressed: 0,
  padUpdates: 0,
};


// ////////////////////////
// ACTION TYPES //////////
// //////////////////////
export const UPDATE_STAGE = 'ONBOARDING/UPDATE_STAGE';
export const GO_TO_NEXT_STAGE = 'ONBOARDING/GO_TO_NEXT_STAGE';
export const EXPERIMENT_WITH_NOTES = 'ONBOARDING/EXPERIMENT_WITH_NOTES';
export const EXPERIMENT_WITH_PAD = 'ONBOARDING/EXPERIMENT_WITH_PAD';


// ////////////////////////
// REDUCERS //////////////
// //////////////////////
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


// ////////////////////////
// ACTION CREATORS ///////
// //////////////////////
export const updateStage = ({ stage }) => ({
  type: UPDATE_STAGE,
  stage,
});

export const goToNextStage = () => ({
  type: GO_TO_NEXT_STAGE,
});

export const experimentWithNotes = () => ({
  type: EXPERIMENT_WITH_NOTES,
});

export const experimentWithPad = () => ({
  type: EXPERIMENT_WITH_PAD,
});
