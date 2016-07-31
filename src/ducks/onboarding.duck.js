import onboardingStages from '../data/onboarding-stages';

const initialState = {
  stage: onboardingStages[1],
};


// ////////////////////////
// ACTION TYPES //////////
// //////////////////////
export const UPDATE_STAGE = 'ONBOARDING/UPDATE_STAGE';


// ////////////////////////
// REDUCERS //////////////
// //////////////////////
export default function onboardingReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_STAGE: {
      return { stage: action.stage };
    }

    case 'NEXT': {
      const currentIndex = onboardingStages.indexOf(state.stage);
      return { stage: onboardingStages[currentIndex+1] };
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
  stage
});

export const next = () => ({
  type: 'NEXT'
});
