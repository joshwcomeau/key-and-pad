/* eslint-disable no-undef */
import { expect } from 'chai';

import {
  OPEN_MODAL,
  CLOSE_MODAL,
  openModal,
  closeModal,
} from '../../src/actions';
import reducer from '../../src/reducers/modal.reducer';


describe('Modal reducer', () => {
  describe(OPEN_MODAL, () => {
    it('opens the modal specified', () => {
      const initialState = null;

      const action = openModal({ name: 'login' });
      const newState = reducer(initialState, action);

      expect(newState).to.equal('login');
    });

    it('switches a currently-open modal', () => {
      const initialState = 'register';

      const action = openModal({ name: 'login' });
      const newState = reducer(initialState, action);

      expect(newState).to.equal('login');
    });
  });

  describe(CLOSE_MODAL, () => {
    it('closes an open modal', () => {
      const initialState = 'register';

      const action = closeModal();
      const newState = reducer(initialState, action);

      expect(newState).to.equal(null);
    });

    it('has no effect when the modal is already closed', () => {
      const initialState = null;

      const action = closeModal();
      const newState = reducer(initialState, action);

      expect(newState).to.equal(null);
    });
  });
});
