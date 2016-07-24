const initialState = {
  x: 0,
  y: 0,
  isPressed: false,
};


// ////////////////////////
// ACTION TYPES //////////
// //////////////////////
export const UPDATE_POSITION = 'XYPAD/UPDATE_POSITION';
export const RELEASE_PAD = 'XYPAD/RELEASE_PAD';


// ////////////////////////
// REDUCERS //////////////
// //////////////////////
export default function XYPadReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_POSITION: {
      return {
        x: action.x,
        y: action.y,
        isPressed: true,
      };
    }

    case RELEASE_PAD: {
      return { ...initialState };
    }

    default:
      return state;
  }
}


// ////////////////////////
// ACTION CREATORS ///////
// //////////////////////
export const updatePosition = ({ x, y }) => ({
  type: UPDATE_POSITION,
  x,
  y,
});

export const releasePad = () => ({
  type: RELEASE_PAD,
});
