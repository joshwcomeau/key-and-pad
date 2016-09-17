import { updatedWithinPath } from './misc-helpers';


export default function initializeWebAudioReconciler({ store, manager }) {
  let currentState = store.getState();

  // This reconcile function is called whenever the store updates.
  const reconcile = () => {
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

    // Bind our two states to our convenience helper function, so that we can
    // pass it a path and know if that path has changed in this state change.
    const updatedInNewState = updatedWithinPath(previousState, currentState);

    const notesUpdated = updatedInNewState('notes');
    const oscillatorsUpdated = updatedInNewState('oscillators');
    const effectsUpdated = updatedInNewState('effects');

    // It's possible that this update isn't relevant for Web Audio.
    const soundsUpdated = notesUpdated || oscillatorsUpdated || effectsUpdated;
    if (!soundsUpdated) { return; }

    // In certain circumstances, we want to destroy and rebuild all oscillators.
    // These circumstances include:
    //   - when the user plays or releases a note
    //   - when the user tweaks the "octave" parameter
    //
    // In other circumstances, though, we want to mutate the existing oscillators:
    //   - detune changes
    //   - gain changes
    //
    // The reason is that the latter need to be smooth, as the user may change
    // them several times a second, and there are audible clicks and pops
    // if we destroy and rebuild the oscillators on every mutation.
    if (notesUpdated) {
      manager
        .stopAllOscillators()
        .createOscillators(currentState);
    }

    else if (oscillatorsUpdated) {
      manager.updateOscillators(currentState);
    }

    else if (effectsUpdated) {
      const { effects } = currentState;

      // First, deal with the effects being toggled on or off (by touching the
      // pad and activating/deactivating the effects)
      const isToggled = updatedInNewState('effects.x.active') &&
                        updatedInNewState('effects.y.active');
      const isActive = effects.x.active && effects.y.active;

      if (isToggled && isActive) {
        // If we're activating, we simply need to rebuild the chain.
        manager
          .destroyEffectChain()
          .rebuildEffectChain({ ...currentState.effects });
      } else if (isToggled && !isActive) {
        manager.destroyEffectChain({
          rerouteOscillators: true,
          softRelease: true,
        });
      }

      // Next, deal with changes to individual axes.
      ['x', 'y'].forEach(axis => {
        // Skip this axis if it wasn't updated
        if (!updatedInNewState(['effects', axis])) { return; }

        // We know the axis has changed, but there are 3 possible axis changes:
        const positionChanged = updatedInNewState(['effects', axis, 'amount']);
        const effectNameChanged = updatedInNewState(['effects', axis, 'name']);
        const effectParamTweaked = updatedInNewState(['effects', axis, 'options']);

        // If the position has changed, we just need to tweak the amount
        if (positionChanged) {
          manager.updateEffectAmount({
            axis,
            effect: currentState.effects[axis],
          });
        }

        // If the effect itself was swapped out, we need to destroy the effect
        // chain and recreate it
        if (effectNameChanged) {
          manager.destroyEffectChain({ rerouteOscillators: true });
        }

        // If the effect's parameters were tweaked, update it
        if (effectParamTweaked) {
          manager.updateEffectParameters(currentState.effects[axis]);
        }
      });
    }
  };

  const unsubscribe = store.subscribe(reconcile);

  return unsubscribe;
}
