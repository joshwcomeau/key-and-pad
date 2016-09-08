/* eslint-disable no-undef */
import { expect } from 'chai';

import {
  DEACTIVATE_EFFECTS,
  UPDATE_EFFECTS_AMOUNT,
  CHANGE_AXIS_EFFECT,
  TWEAK_AXIS_PARAMETER,
  deactivateEffects,
  updateEffectsAmount,
  changeAxisEffect,
  tweakAxisParameter,
} from '../../src/actions';
import reducer from '../../src/reducers/effects.reducer';


describe('Effects reducer', () => {
  describe(DEACTIVATE_EFFECTS, () => {
    it('sets X and Y to inactive', () => {
      const initialState = {
        x: { name: 'filter', active: true },
        y: { name: 'reverb', active: true },
      };

      const expectedState = {
        x: { name: 'filter', active: false },
        y: { name: 'reverb', active: false },
      };

      const actualState = reducer(initialState, deactivateEffects());

      expect(actualState).to.deep.equal(expectedState);
    });

    it('Creates a fresh state even when effects were already inactive', () => {
      const initialState = {
        x: { name: 'filter', active: false },
        y: { name: 'reverb', active: false },
      };

      const expectedState = initialState;

      const actualState = reducer(initialState, deactivateEffects());

      expect(actualState).to.deep.equal(expectedState);
      expect(actualState).to.not.equal(initialState);
    });

    it('does not affect effect options', () => {
      const initialState = {
        x: {
          name: 'filter',
          active: true,
          options: {
            type: 'lowpass',
            cutoff: 400,
          },
        },
        y: { name: 'reverb', active: true },
      };

      const expectedState = {
        x: {
          ...initialState.x,
          active: false,
        },
        y: {
          ...initialState.y,
          active: false,
        },
      };

      const actualState = reducer(initialState, deactivateEffects());

      expect(actualState).to.deep.equal(expectedState);
      expect(actualState).to.not.equal(expectedState);
    });
  });


  describe(UPDATE_EFFECTS_AMOUNT, () => {

  });


  describe(CHANGE_AXIS_EFFECT, () => {

  });


  describe(TWEAK_AXIS_PARAMETER, () => {

  });
});
