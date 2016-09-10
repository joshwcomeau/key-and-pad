/* eslint-disable no-undef */
import { expect } from 'chai';

import {
  SET_ADMIN_MODE,
  setAdminMode,
} from '../../src/actions';
import reducer from '../../src/reducers/is-admin.reducer';


describe('isAdmin reducer', () => {
  describe(SET_ADMIN_MODE, () => {
    it('can be set to false', () => {
      const initialState = true;

      const action = setAdminMode({ adminMode: false });
      const newState = reducer(initialState, action);

      expect(newState).to.equal(false);
    });

    it('can be set to true', () => {
      const initialState = false;

      const action = setAdminMode({ adminMode: true });
      const newState = reducer(initialState, action);

      expect(newState).to.equal(true);
    });

    it('has no effect when the value is the same', () => {
      const initialState = false;

      const action = setAdminMode({ adminMode: false });
      const newState = reducer(initialState, action);

      expect(newState).to.equal(false);
    });
  });
});
