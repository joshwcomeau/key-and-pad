import { PRESS_KEY, RELEASE_KEY } from '../ducks/keyboard.duck';
import { playNote, stopNote } from '../utils/oscillators';


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
    default: {
      // Do nothing. We ignore all other actions.
    }
  }

  return next(action);
}

export default webAudioMiddleware
