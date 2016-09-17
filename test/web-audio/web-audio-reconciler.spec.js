/* eslint-disable no-undef */
import { expect } from 'chai';

import configureStore from '../../src/store';
import initializeWebAudioReconciler from '../../src/utils/web-audio-reconciler';
import webAudioManagerFactory from './web-audio-manager-stub';
import {
  addNote,
  removeNote,
  updateOscillator,
  deactivateEffects,
  updateEffectsAmount,
  changeAxisEffect,
  tweakAxisParameter,
  openModal,
} from '../../src/actions';


let store;
let manager = webAudioManagerFactory();

const managerMethods = Object.keys(manager);

// This helper function asserts that _only_ the methods provided were
// called in the spec.
function expectManagerMethodsCalled(expectedMethods) {
  managerMethods.forEach(method => {
    const expectedCallCount = expectedMethods[method] || 0;
    const actualCallCount = manager[method].callCount;

    // Because we're doing this iteratively, failed tests aren't logged well.
    // Let's fix that.
    if (actualCallCount !== expectedCallCount) {
      // eslint-disable-next-line max-len, no-console
      console.info(`Expecting ${method} to be called ${expectedCallCount} time(s), but was actually called ${actualCallCount} time(s)`);
    }

    expect(actualCallCount).to.equal(expectedCallCount);
  });
}

describe('Web Audio Reconciler', () => {
  afterEach(() => {
    managerMethods.forEach(method => {
      manager[method].reset();
    });
  });

  describe('unrelated actions', () => {
    before(() => {
      store = configureStore();
      manager = webAudioManagerFactory();
      initializeWebAudioReconciler({ store, manager });
    });

    it('does not cause any methods to run', () => {
      store.dispatch(openModal({ name: 'terms' }));

      // Pass an empty object, since we expect no methods to have been called.
      expectManagerMethodsCalled({});
    });
  });

  describe('Notes', () => {
    before(() => {
      store = configureStore();
      manager = webAudioManagerFactory();
      initializeWebAudioReconciler({ store, manager });
    });

    it('stops and rebuilds oscillators when a note is added', () => {
      store.dispatch(addNote({ value: 'd4', letter: 'e' }));

      expectManagerMethodsCalled({
        stopAllOscillators: 1,
        createOscillators: 1,
      });
    });

    it('stops and rebuilds oscillators when a note is removed', () => {
      store.dispatch(removeNote({ value: 'd4' }));

      expectManagerMethodsCalled({
        stopAllOscillators: 1,
        createOscillators: 1,
      });
    });
  });

  describe('Oscillators', () => {
    before(() => {
      store = configureStore();
      manager = webAudioManagerFactory();
      initializeWebAudioReconciler({ store, manager });
    });

    it('updates the oscillators when a param changes', () => {
      store.dispatch(updateOscillator({ index: 0, options: { gain: 5 } }));

      expectManagerMethodsCalled({
        updateOscillators: 1,
      });
    });
  });

  describe('Effects', () => {
    it('handles activating the effects', () => {
      store.dispatch(updateEffectsAmount({
        x: {
          amount: 5,
          cursorPosition: 50,
        },
        y: {
          amount: 10,
          cursorPosition: 100,
        },
      }));

      expectManagerMethodsCalled({
        destroyEffectChain: 1,
        rebuildEffectChain: 1,
        updateEffectAmount: 2, // Once for each axis
      });
    });

    it('handles updating the effect amounts', () => {
      // While this is the same action as last time, the effects are already
      // enabled, so it doesn't need to destroy and rebuild the chain
      store.dispatch(updateEffectsAmount({
        x: {
          amount: 6,
          cursorPosition: 60,
        },
        y: {
          amount: 9,
          cursorPosition: 90,
        },
      }));

      expectManagerMethodsCalled({
        updateEffectAmount: 2, // Once for each axis
      });
    });

    it('handles updating a single effect (one axis)', () => {
      // While this is the same action as last time, the effects are already
      // enabled, so it doesn't need to destroy and rebuild the chain
      store.dispatch(updateEffectsAmount({
        x: {
          amount: 6,
          cursorPosition: 60,
        },
        y: {
          amount: 12,
          cursorPosition: 120,
        },
      }));

      expectManagerMethodsCalled({
        updateEffectAmount: 1, // Once for each axis
      });
    });

    it('handles deactivating the effects', () => {
      store.dispatch(deactivateEffects());

      expectManagerMethodsCalled({
        destroyEffectChain: 1,
      });
    });

    it('switches from one effect to another', () => {
      store.dispatch(changeAxisEffect({ axis: 'x', effect: 'delay' }));

      expectManagerMethodsCalled({
        destroyEffectChain: 1,
        updateEffectParameters: 1,
      });
    });

    it('tweaks an effect parameter', () => {
      store.dispatch(tweakAxisParameter({
        axis: 'x',
        options: { cutoff: 5000 },
      }));

      expectManagerMethodsCalled({
        updateEffectParameters: 1,
      });
    });
  });
});
