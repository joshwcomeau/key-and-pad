/* eslint-disable no-undef */
import { expect } from 'chai';

import {
  ADD_NOTE,
  REMOVE_NOTE,
  addNote,
  removeNote,
} from '../../src/actions';
import reducer from '../../src/reducers/notes.reducer';


describe('Notes reducer', () => {
  describe(ADD_NOTE, () => {
    it('adds a first note', () => {
      const initialState = [];

      const action = addNote({
        letter: 'Z',
        value: 'G4',
      });
      const expectedState = [{
        letter: 'Z',
        value: 'G4',
      }];
      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });

    it('adds another note', () => {
      const initialState = [{
        letter: 'Z',
        value: 'G4',
      }];

      const action = addNote({
        letter: 'X',
        value: 'A5',
      });
      const expectedState = [{
        letter: 'Z',
        value: 'G4',
      }, {
        letter: 'X',
        value: 'A5',
      }];
      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });

  describe(REMOVE_NOTE, () => {
    it('removes the specified note', () => {
      const initialState = [{
        letter: 'Z',
        value: 'G4',
      }, {
        letter: 'X',
        value: 'A5',
      }];

      const action = removeNote({
        value: 'G4',
      });
      const expectedState = [{
        letter: 'X',
        value: 'A5',
      }];
      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });

    it('removes the final note', () => {
      const initialState = [{
        letter: 'Z',
        value: 'G4',
      }];

      const action = removeNote({
        value: 'G4',
      });
      const expectedState = [];
      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });

    it('does nothing when a nonexistent note is removed', () => {
      const initialState = [{
        letter: 'Z',
        value: 'G4',
      }];

      const action = removeNote({
        value: 'AHHH',
      });
      const expectedState = initialState;
      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });

    it('does nothing when no notes are playing', () => {
      const initialState = [];

      const action = removeNote({
        value: 'G4',
      });
      const expectedState = initialState;
      const actualState = reducer(initialState, action);

      expect(actualState).to.deep.equal(expectedState);
    });
  });
});
