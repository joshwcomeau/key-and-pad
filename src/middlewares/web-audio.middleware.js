import { PRESS_KEY, RELEASE_KEY } from '../ducks/keyboard.duck';


const oscillators = {};

const webAudioMiddleware = store => next => action => {
  switch (action.type) {
    case PRESS_KEY: {
      const { note, frequency } = action;

      const osc = audioContext.createOscillator();
      osc.frequency.value = frequency;
      osc.type = 'square';

      osc.start(0);
      osc.connect(audioContext.destination);

      oscillators[frequency] = osc;

      break;
    }
    case RELEASE_KEY: {
      const { note, frequency } = action;

      if (typeof oscillators[frequency] === 'undefined') {
        break;
      }

      oscillators[frequency].stop();

      break;
    }
    default: {
      // Do nothing. We ignore all other actions.
    }
  }

  return next(action);
}

export default webAudioMiddleware
