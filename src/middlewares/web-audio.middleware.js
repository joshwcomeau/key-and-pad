import { PRESS_KEY, RELEASE_KEY } from '../ducks/keyboard.duck';

const audioContext = new (AudioContext || webkitAudioContext)();

const oscillators = {};

const webAudioMiddleware = store => next => action => {
  switch (action.type) {
    case PRESS_KEY: {
      const { frequency } = action;

      // check to see if this frequency already exists in our oscillators
      if (typeof oscillators[frequency] !== 'undefined') {

      } else {
        const osc = audioContext.createOscillator();
        osc.frequency.value = frequency;
        osc.type = 'triangle';

        osc.start(0);
        osc.connect(audioContext.destination);

        oscillators[frequency] = osc;
      }
    }
  }

  return next(action);
}

export default webAudioMiddleware
