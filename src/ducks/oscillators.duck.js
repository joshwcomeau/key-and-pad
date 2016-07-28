import omit from 'lodash.omit';

const initialState = {
  keys: {},
};


// ////////////////////////
// ACTION TYPES //////////
// //////////////////////
export const PRESS_KEY = 'KEYBOARD/PRESS_KEY';
export const RELEASE_KEY = 'KEYBOARD/RELEASE_KEY';


// ////////////////////////
// REDUCERS //////////////
// //////////////////////
export default function keyboardReducer(state = initialState, action) {
  switch (action.type) {
    case PRESS_KEY: {
      return {
        keys: {
          ...state.keys,
          [action.letter]: action.frequency,
        },
      };
    }

    case RELEASE_KEY: {
      return {
        keys: omit(state.keys, action.letter),
      }
    }

    default:
      return state;
  }
}


// ////////////////////////
// ACTION CREATORS ///////
// //////////////////////
export const pressKey = ({ letter, note, frequency}) => ({
  type: PRESS_KEY,
  letter,
  note,
  frequency,
});

export const releaseKey = ({ letter, note, frequency}) => ({
  type: RELEASE_KEY,
  letter,
  note,
  frequency,
});
