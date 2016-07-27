import { PRESS_KEY, RELEASE_KEY } from '../ducks/keyboard.duck';
import { UPDATE_POSITION, RELEASE_PAD } from '../ducks/x-y-pad.duck';
import { CHANGE_OSCILLATOR_WAVEFORM } from '../ducks/sounds.duck';
import {
  playNote,
  stopNote,
  updatePadCoordinates,
  updateOscillators,
  removeEffects,
} from '../utils/web-audio-manager';

let legacyState = {};


const webAudioMiddleware = store => next => action => {
  debugger;
  legacyState = store.getState();
  switch (action.type) {
    case PRESS_KEY: {
      // The action only includes the frequency required, not the waveform.
      // This is available in our state, and controlled by CHANGE_OSCILLATOR_WAVEFORM.
      // I don't like how this breaks encapsulation, but it's the best solution
      // I've found so far.
      const waveforms = store.getState().sounds.oscillators;

      playNote({ ...action, waveforms });
      break;
    }

    case RELEASE_KEY: {
      stopNote(action);
      break;
    }

    case UPDATE_POSITION: {
      updatePadCoordinates(action);
      break;
    }

    case RELEASE_PAD: {
      removeEffects();
      break;
    }

    case CHANGE_OSCILLATOR_WAVEFORM: {
      updateOscillators(action);
      break;
    }

    default: {
      // Do nothing. We ignore all other actions.
    }
  }

  return next(action);
}

export default webAudioMiddleware
