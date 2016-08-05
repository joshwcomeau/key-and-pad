/* eslint-disable no-unused-vars, no-undef */
import { expect } from 'chai';

import reducer, {
  DEACTIVATE_EFFECTS,
  UPDATE_EFFECTS_AMOUNT,
  CHANGE_AXIS_EFFECT,
  TWEAK_AXIS_PARAMETER,
  deactivateEffects,
  updateEffectsAmount,
  changeAxisEffect,
  tweakAxisParameter,
} from '../../src/ducks/effects.duck';


describe('Effects reducer', () => {
  describe(DEACTIVATE_EFFECTS, () => {
    it('sets X and Y to inactive', () => {
      const initialState = {
        x: { name: 'filter', active: true },
        y: { name: 'reverb', active: true },
      }

      const expectedState = {
        x: { name: 'filter', active: false },
        y: { name: 'reverb', active: false },
      }

      const actualState = reducer(initialState, deactivateEffects());

      expect(actualState).to.deep.equal(expectedState);
    });

    it('Creates a fresh state even when no values have changed', () => {
      const initialState = {
        x: { name: 'filter', active: false },
        y: { name: 'reverb', active: false },
      }

      const expectedState = {
        x: { name: 'filter', active: false },
        y: { name: 'reverb', active: false },
      }

      const actualState = reducer(initialState, deactivateEffects());

      expect(actualState).to.deep.equal(expectedState);
      expect(actualState).to.not.equal(expectedState);
    });
  });
});
