import { updatedWithinPath } from './misc-helpers';
import WebAudioManager from './web-audio-manager';

let currentState,
    store,
    unsubscribe;

export function initializeWebAudio(reduxStore) {
  store = reduxStore;
  unsubscribe = store.subscribe(reconcile);
  currentState = store.getState();

  WebAudioManager.initialize(currentState);
}

// Currently unused
export function destroy() {
  unsubscribe();
}

export function reconcile() {
  const previousState = currentState;
  currentState = store.getState();

  // There are three main areas of 'change':
  //
  // - A change to the notes being played,
  // - A change to the oscillators' setting (eg. waveform),
  // - A change to the pad effects, either moving the mouse across the pad,
  //   changing one of the effects, or tweaking one of the effect parameters.
  //
  // The changes should be independent; no single event should change both.
  // That said, let's leave it open to the option, since we may want to
  // throttle the subscribe callback.

  // bind our two states to our convenience helper function, so that we can
  // pass it a path and know if that path has changed in this state change.
  const updatedInNewState = updatedWithinPath(previousState, currentState);

  const notesUpdated = updatedInNewState('notes');
  const oscillatorsUpdated = updatedInNewState('oscillators');
  const effectsUpdated = updatedInNewState('effects');

  // It's possible that this update isn't relevant for Web Audio.
  const soundsUpdated = notesUpdated || oscillatorsUpdated || effectsUpdated;
  if (!soundsUpdated) { return; }

  // If the notes changed, simply destroy all oscillators and rebuild.
  if (notesUpdated) {
    WebAudioManager
      .stopAllOscillators()
      .createOscillators(currentState)
  }

  if (oscillatorsUpdated) {
    // Even though only one oscillator has changed, I believe it's faster
    // to simply update both, rather than do a deep equality check to find
    // the updated one. Test this theory!
    currentState.oscillators.forEach((oscillator, index) => {
      WebAudioManager.updateOscillator({
        oscillatorIndex: index,
        ...oscillator,
      });
    })

  }

  if (effectsUpdated) {
    const { effects } = currentState;

    // First, deal with the effects being toggled on or off (by touching the
    // pad and activating/deactivating the effects)
    const isToggled = updatedInNewState('effects.x.active') &&
                      updatedInNewState('effects.y.active');
    const isActive = effects.x.active && effects.y.active;

    if (isToggled && isActive) {
      // If we're activating, we simply need to rebuild the chain.
      WebAudioManager
        .destroyEffectChain()
        .rebuildEffectChain({ ...currentState.effects });
    } else if (isToggled && !isActive) {
      WebAudioManager.destroyEffectChain({ rerouteOscillators: true });
    }

    // Next, deal with changes to individual axes.
    ['x', 'y'].forEach(axis => {
      // Skip this axis if it wasn't the one updated
      if (!updatedInNewState(['effects', axis])) { return; }

      // We know the axis has changed, but there are 3 possible axis changes:
      const positionChanged = updatedInNewState(['effects', axis, 'amount']);
      const effectNameChanged = updatedInNewState(['effects', axis, 'name']);
      const effectParamTweaked = updatedInNewState(['effects', axis, 'options']);

      // If the position has changed, we just need to tweak the amount
      if (positionChanged) {
        WebAudioManager.updateEffectAmount({
          axis,
          effect: currentState.effects[axis],
        });
      }

      // If the effect itself was swapped out, we need to destroy the effect
      // chain and recreate it
      if (effectNameChanged) {
        WebAudioManager
          .destroyEffectChain()
          .rebuildEffectChain({ ...currentState.effects });
      }

      // If the effect's parameters were tweaked, update it
      if (effectParamTweaked) {
        WebAudioManager.updateEffectParameters(currentState.effects[axis]);
      }
    })
  }
}

//
// STATE EXAMPLE
//
// {
//   keys: ['c4', 'e4', 'g4'],
//   oscillators: [
//     {
//       waveform: 'sawtooth',
//       gain: 0.15,
//       octaveAdjustment: 0,
//     }, {
//       waveform: 'square',
//       gain: 0.5,
//       octaveAdjustment: -1,
//     }
//   ],
//   effects: {
//     x: {
//       name: 'filter',
//       amount: 0.4,
//       options: {
//         type: 'lowpass',
//         resonance: '5'
//       }
//     }
//   },
//   y: {
//     name: 'distortion',
//     amount: 0.75,
//     options: {
//       oversampling: '4x'
//     }
//   }
// }
