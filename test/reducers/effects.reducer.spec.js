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
import effectDefaultOptions from '../../src/data/effect-default-options.js';


// Test Helpers
const generateEffect = (name = filter) => ({
  active = false,
  amount = 0,
  cursorPosition = 0,
  options = effectDefaultOptions[name],
} = {}) => ({
  name,
  active,
  amount,
  cursorPosition,
  options,
});

const generateFilter = generateEffect('filter');
const generateReverb = generateEffect('reverb');


describe('Effects reducer', () => {
  describe(DEACTIVATE_EFFECTS, () => {
    it('sets X and Y to inactive', () => {
      const initialState = {
        x: generateFilter({ active: true }),
        y: generateReverb({ active: true }),
      };

      const expectedState = {
        x: { ...initialState.x, active: false },
        y: { ...initialState.y, active: false },
      };

      const actualState = reducer(initialState, deactivateEffects());

      expect(actualState).to.deep.equal(expectedState);
    });

    it('creates a fresh state even when effects were already inactive', () => {
      const initialState = {
        x: generateFilter(),
        y: generateReverb(),
      };

      const expectedState = initialState;

      const actualState = reducer(initialState, deactivateEffects());

      expect(actualState).to.deep.equal(expectedState);
      expect(actualState).to.not.equal(initialState);
    });
  });


  describe(UPDATE_EFFECTS_AMOUNT, () => {
    it('updates a single axis', () => {
      const initialState = {
        x: generateFilter({ active: true }),
        y: generateReverb({ active: true }),
      };

      const action = updateEffectsAmount({
        y: {
          amount: 50,
          cursorPosition: 300,
        },
      });

      const expectedState = {
        x: initialState.x,
        y: { ...initialState.y, amount: 50, cursorPosition: 300 },
      };

      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });

    it('updates both axes', () => {
      const initialState = {
        x: generateFilter({ active: true }),
        y: generateReverb({ active: true }),
      };

      const action = updateEffectsAmount({
        x: {
          amount: 10,
          cursorPosition: 60,
        },
        y: {
          amount: 50,
          cursorPosition: 300,
        },
      });

      const expectedState = {
        x: { ...initialState.x, amount: 10, cursorPosition: 60 },
        y: { ...initialState.y, amount: 50, cursorPosition: 300 },
      };

      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });

    it('sets the axes to active', () => {
      const initialState = {
        x: generateFilter(),
        y: generateReverb(),
      };

      const action = updateEffectsAmount({
        x: {
          amount: 10,
          cursorPosition: 60,
        },
      });

      const expectedState = {
        x: { ...initialState.x, amount: 10, cursorPosition: 60, active: true },
        y: { ...initialState.y },
      };

      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });


  describe(CHANGE_AXIS_EFFECT, () => {
    let initialState;
    let actualState;

    before(() => {
      initialState = {
        x: generateFilter(),
        y: generateReverb(),
      };

      const action = changeAxisEffect({
        axis: 'x',
        effect: 'distortion',
      });

      actualState = reducer(initialState, action);
    });

    it('updates the specified axis effect', () => {
      expect(actualState.x.name).to.equal('distortion');
    });

    it('uses the new effect\'s default options', () => {
      expect(
        actualState.x.options
      ).to.deep.equal(
        effectDefaultOptions.distortion
      );
    });

    it('does not affect active/amount/cursorPosition', () => {
      expect(actualState.x).to.deep.equal({
        ...initialState.x,
        name: 'distortion',
        options: effectDefaultOptions.distortion,
      });
    });

    it('does not affect the alternate axis', () => {
      expect(actualState.y).to.deep.equal(initialState.y);
    });
  });


  describe(TWEAK_AXIS_PARAMETER, () => {
    const newCutoff = 10000;
    let initialState;
    let actualState;

    before(() => {
      initialState = {
        x: generateFilter(),
        y: generateReverb(),
      };

      const action = tweakAxisParameter({
        axis: 'y',
        options: {
          cutoff: newCutoff,
        },
      });

      actualState = reducer(initialState, action);
    });

    it('updates the specified option', () => {
      expect(actualState.y.options.cutoff).to.equal(newCutoff);
    });

    it('does not affect adjacent options', () => {
      expect(actualState.y.options).to.deep.equal({
        ...initialState.y.options,
        cutoff: newCutoff,
      });
    });

    it('does not affect other axis state', () => {
      expect(actualState.y).to.deep.equal({
        ...initialState.y,
        options: {
          ...initialState.y.options,
          cutoff: newCutoff,
        },
      });
    });

    it('does not affect alternate axis', () => {
      expect(actualState.x).to.deep.equal(initialState.x);
    });
  });
});
