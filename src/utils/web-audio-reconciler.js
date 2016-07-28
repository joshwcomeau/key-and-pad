import { equalWithinPath } from './functions';

export default function reconcile(currentState, nextState) {
  // There are two main areas of 'change':
  //
  // - A change to the oscillators, either the notes being played or the waveforms
  //   being used
  // - A change to the pad effects, either moving the mouse across the pad,
  //   changing one of the effects, or tweaking one of the effect parameters.
  //
  // The changes should be independent; no single event should change both.
  // That said, let's leave it open to the option, since we may want to
  // throttle the subscribe callback.
  const updatedInNewState = !equalWithinPath(currentState, nextState);

  const oscillatorsUpdated = updatedInNewState('oscillators');
  const effectsUpdated = updatedInNewState('effects');

  // It's possible that this update isn't relevant for Web Audio.
  // If neither oscillators nor effects were updated, we're done.
  const soundsUpdated = oscillatorsUpdated || effectsUpdated;
  if (!soundsUpdated) { return; }

  if (oscillatorsUpdated) {
    // This should be easy; simply destroy all existing oscillators and re-create
    // new ones for the notes provided.
    stopAllOscillators();
    createOscillators({ ...next.oscillators })
  }

  if (effectsUpdated) {
    // This is a bit tougher...
    ['x', 'y'].forEach(axis => {
      // Skip this axis if it wasn't the one updated
      if (!updatedInNewState(['effects', axis])) { return; }

      // We know the axis has changed, but there are 3 possible axis changes:
      const positionChanged = updatedInNewState(['effects', axis, 'amount']);
      const effectNameChanged = updatedInNewState(['effects', axis, 'name']);
      const effectParamTweaked = updatedInNewState(['effects', axis, 'options']);

      // If the position has changed, we just need to tweak the amount
      if (positionChanged) {
        updateEffectAmount({ axis, amount: next});
      }

      // If the effect itself was swapped out, we need to destroy the effect
      // chain and recreate it
      if (effectNameChanged) {
        destroyEffectChain();
        rebuildEffectChain({ ...next.effects });
      }

      // If the effect's parameters were tweaked, update it
      if (effectParamTweaked) {
        updateEffectParameters({ axis, options: next.effects[axis].options });
      }
    })
  }
}

//
// STATE EXAMPLE
//
// {
//   oscillators: {
//     1: {
//       waveform: 'sawtooth',
//       notes: ['c4', 'e4', 'g4']
//     },
//     2: {
//       waveform: 'square',
//       notes: ['c4', 'e4', 'g4']
//     }
//   },
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
