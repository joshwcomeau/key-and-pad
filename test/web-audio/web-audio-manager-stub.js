/* eslint-disable no-unused-vars */
import sinon from 'sinon';

const webAudioManagerFactory = (context = sinon.stub()) => {
  const manager = {
    stopAllOscillators() {
      return this;
    },
    createOscillators({ notes, oscillators }) {
      return this;
    },
    updateOscillators({ notes, oscillators }) {
      return this;
    },
    destroyEffectChain({ rerouteOscillators, softRelease } = {}) {
      return this;
    },
    rebuildEffectChain({ x, y }) {
      return this;
    },
    updateEffectAmount({ effect }) {
      return this;
    },
    updateEffectParameters({ name, options }) {
      return this;
    },
  };

  sinon.spy(manager, 'stopAllOscillators');
  sinon.spy(manager, 'createOscillators');
  sinon.spy(manager, 'updateOscillators');
  sinon.spy(manager, 'destroyEffectChain');
  sinon.spy(manager, 'rebuildEffectChain');
  sinon.spy(manager, 'updateEffectAmount');
  sinon.spy(manager, 'updateEffectParameters');

  return manager;
};

export default webAudioManagerFactory;
