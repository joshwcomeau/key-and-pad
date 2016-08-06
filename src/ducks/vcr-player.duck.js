const initialState = {
  casettes: [],
};


// ////////////////////////
// ACTION TYPES //////////
// //////////////////////
export const CASETTES_LIST_REQUEST = 'VCR_PLAYER/CASETTES_LIST_REQUEST';
export const CASETTES_LIST_SUCCESS = 'VCR_PLAYER/CASETTES_LIST_SUCCESS';
export const CASETTES_LIST_FAILURE = 'VCR_PLAYER/CASETTES_LIST_FAILURE';


// ////////////////////////
// REDUCERS //////////////
// //////////////////////
export default function vcrPlayerReducer(state = initialState, action) {
  switch (action.type) {
    case CASETTES_LIST_REQUEST: {
      // TODO: loading screen? Blank placeholder casettes would be cute.
      return state;
    }

    case CASETTES_LIST_SUCCESS: {
      return {
        ...state,
        casettes: action.casettes,
      };
    }

    case CASETTES_LIST_FAILURE: {
      console.error("Failed to receive casettes :(")
      return state;
    }

    default:
      return state;
  }
}


// ////////////////////////
// ACTION CREATORS ///////
// //////////////////////
export const casettesListRequest = () => ({
  type: CASETTES_LIST_REQUEST,
})
