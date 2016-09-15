/* eslint-disable no-undef */
import { expect } from 'chai';

import {
  UPDATE_OSCILLATOR,
  updateOscillator,
} from '../../src/actions';
import reducer from '../../src/reducers/oscillators.reducer';


describe('Oscillators reducer', () => {
  describe(UPDATE_OSCILLATOR, () => {
    it('updates the sole oscillator', () => {
      const initialState = [
        {
          type: 'triangle',
          gain: 0.5,
          octaveAdjustment: 0,
          detune: 0,
        },
      ];

      const action = updateOscillator({
        index: 0,
        options: {
          waveform: 'sawtooth',
        },
      });

      const expectedState = [
        {
          ...initialState[0],
          waveform: 'sawtooth',
        },
      ];

      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });

    it('updates one of multiple oscillators', () => {
      const initialState = [
        {
          type: 'triangle',
          gain: 0.5,
          octaveAdjustment: 0,
          detune: 0,
        }, {
          type: 'square',
          gain: 0.15,
          octaveAdjustment: -1,
          detune: 0,
        },
      ];

      const action = updateOscillator({
        index: 1,
        options: {
          waveform: 'sine',
          detune: 50,
        },
      });

      const expectedState = [
        initialState[0],
        {
          ...initialState[1],
          waveform: 'sine',
          detune: 50,
        },
      ];

      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });
});
