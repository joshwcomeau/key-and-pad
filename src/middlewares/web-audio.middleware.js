import { PRESS_KEY, RELEASE_KEY } from '../ducks/keyboard.duck';
import { UPDATE_POSITION, RELEASE_PAD } from '../ducks/x-y-pad.duck';
import {
  playNote,
  stopNote,
  updatePadCoordinates,
  removeEffects,
} from '../utils/web-audio-manager';


const webAudioMiddleware = store => next => action => {
  switch (action.type) {
    case PRESS_KEY: {
      playNote(action);
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

    default: {
      // Do nothing. We ignore all other actions.
    }
  }

  return next(action);
}

export default webAudioMiddleware
