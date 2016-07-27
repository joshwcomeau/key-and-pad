import { PRESS_KEY, RELEASE_KEY } from '../ducks/keyboard.duck';
import { UPDATE_POSITION, RELEASE_PAD } from '../ducks/x-y-pad.duck';
import {
  CHANGE_OSCILLATOR_WAVEFORM,
  CHANGE_AXIS_EFFECT,
} from '../ducks/sounds.duck';
import {
  initialize,
  playNote,
  stopNote,
  updatePadCoordinates,
  updateOscillators,
  removeEffects,
  changeEffect,
} from '../utils/web-audio-manager';


const webAudioMiddleware = store => next => action => {
  switch (action.type) {
    case WEB_AUDIO_INITIALIZATION: {
      initialize(store.getState().sounds);
      break;
    }

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

    case CHANGE_AXIS_EFFECT: {
      changeEffect(action);
      break;
    }

    default: {
      // Do nothing. We ignore all other actions.
    }
  }

  return next(action);
}

export default webAudioMiddleware
