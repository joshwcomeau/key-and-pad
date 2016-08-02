const initialState = [
  {
    waveform: 'triangle',
    gain: 0.5,
    octaveAdjustment: 0,
    detune: 0
  }, {
    waveform: 'square',
    gain: 0.15,
    octaveAdjustment: -1,
    detune: 0
  },
];


// ////////////////////////
// ACTION TYPES //////////
// //////////////////////
export const UPDATE_OSCILLATOR = 'OSCILLATORS/UPDATE_OSCILLATOR';


// ////////////////////////
// REDUCERS //////////////
// //////////////////////
export default function keyboardReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_OSCILLATOR: {
      return state.map((oscillator, index) => {
        if (action.index !== index) {
          return oscillator;
        }

        return {
          ...oscillator,
          ...action.options,
        };
      })
    }

    default:
      return state;
  }
}


// ////////////////////////
// ACTION CREATORS ///////
// //////////////////////
export const updateOscillator = ({ index, options }) => ({
  type: UPDATE_OSCILLATOR,
  index,
  options,
});
