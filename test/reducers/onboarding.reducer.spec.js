/* eslint-disable no-undef */
import { expect } from 'chai';

import {
  UPDATE_STAGE,
  GO_TO_NEXT_STAGE,
  COMPLETE_ONBOARDING,
  EXPERIMENT_WITH_NOTES,
  EXPERIMENT_WITH_PAD,
  updateStage,
  goToNextStage,
  completeOnboarding,
  experimentWithNotes,
  experimentWithPad,
} from '../../src/actions';
import reducer from '../../src/reducers/onboarding.reducer';
import onboardingStages from '../../src/data/onboarding-stages';


describe('Onboarding reducer', () => {
  describe(UPDATE_STAGE, () => {
    it('sets the stage to the provided value', () => {
      const initialState = {
        stage: onboardingStages[0],
        keysPressed: 5,
        padUpdates: 0,
      };

      const action = updateStage({ stage: onboardingStages[2] });
      const expectedState = {
        ...initialState,
        stage: onboardingStages[2],
      };

      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(GO_TO_NEXT_STAGE, () => {
    it('increments the stage by 1', () => {
      const initialState = {
        stage: onboardingStages[4],
        keysPressed: 5,
        padUpdates: 0,
      };

      const action = goToNextStage();
      const expectedState = {
        ...initialState,
        stage: onboardingStages[5],
      };

      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });

    it('does nothing when on the final stage', () => {
      const lastStage = onboardingStages[onboardingStages.length - 1];

      const initialState = {
        stage: lastStage,
        keysPressed: 0,
        padUpdates: 0,
      };
      const action = goToNextStage();

      const expectedState = initialState;
      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(COMPLETE_ONBOARDING, () => {
    it('jumps to the final stage', () => {
      const lastStage = onboardingStages[onboardingStages.length - 1];

      const initialState = {
        stage: onboardingStages[2],
        keysPressed: 5,
        padUpdates: 0,
      };
      const action = completeOnboarding();

      const expectedState = {
        ...initialState,
        stage: lastStage,
      };
      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });

    it('does nothing when on the final stage', () => {
      const lastStage = onboardingStages[onboardingStages.length - 1];

      const initialState = {
        stage: lastStage,
        keysPressed: 0,
        padUpdates: 0,
      };
      const action = completeOnboarding();

      const expectedState = initialState;
      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(EXPERIMENT_WITH_NOTES, () => {
    it('increments the `keysPressed` state', () => {
      const initialState = {
        stage: onboardingStages[0],
        keysPressed: 0,
        padUpdates: 0,
      };
      const action = experimentWithNotes();

      const expectedState = {
        ...initialState,
        keysPressed: initialState.keysPressed + 1,
      };
      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(EXPERIMENT_WITH_PAD, () => {
    it('increments the `padUpdates` state', () => {
      const initialState = {
        stage: onboardingStages[0],
        keysPressed: 0,
        padUpdates: 4,
      };
      const action = experimentWithPad();

      const expectedState = {
        ...initialState,
        padUpdates: initialState.padUpdates + 1,
      };
      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });
});
