const initialState = {
  casettes: {},
  actions: {},
  selectedCasette: null,
  playStatus: 'stopped', // One of 'playing', 'paused', 'stopped'
  casetteStatus: 'idle', // One of 'idle', 'selecting', 'loaded'
  casettePageNumber: 0,
  casettePageLimit: 3,
};


// ////////////////////////
// ACTION TYPES //////////
// //////////////////////
export const CASETTES_LIST_REQUEST = 'VCR_PLAYER/CASETTES_LIST_REQUEST';
export const CASETTES_LIST_RECEIVE = 'VCR_PLAYER/CASETTES_LIST_RECEIVE';
export const CASETTES_LIST_FAILURE = 'VCR_PLAYER/CASETTES_LIST_FAILURE';
export const VIEW_CASETTES = 'VCR_PLAYER/VIEW_CASETTES';
export const HIDE_CASETTES = 'VCR_PLAYER/HIDE_CASETTES';
export const SELECT_CASETTE = 'VCR_PLAYER/SELECT_CASETTE';
export const EJECT_CASETTE = 'VCR_PLAYER/EJECT_CASETTE';
export const CASETTE_ACTIONS_RECEIVE = 'VCR_PLAYER/CASETTE_ACTIONS_RECEIVE';
export const TOGGLE_PLAY_PAUSE = 'VCR_PLAYER/TOGGLE_PLAY_PAUSE';

// ////////////////////////
// REDUCERS //////////////
// //////////////////////
export default function vcrPlayerReducer(state = initialState, action) {
  switch (action.type) {
    case CASETTES_LIST_REQUEST: {
      // TODO: loading screen? Blank placeholder casettes would be cute.
      return state;
    }

    case CASETTES_LIST_RECEIVE: {
      return {
        ...state,
        casettes: action.casettes,
      };
    }

    case CASETTES_LIST_FAILURE: {
      console.error('Failed to receive casettes :(');
      return state;
    }

    case CASETTE_ACTIONS_RECEIVE: {
      return {
        ...state,
        actions: {
          ...state.actions,
          [action.id]: action.casetteActions,
        },
      };
    }

    case VIEW_CASETTES: {
      return {
        ...state,
        casetteStatus: 'selecting',
      };
    }

    case HIDE_CASETTES: {
      return {
        ...state,
        casetteStatus: 'idle',
      };
    }

    case SELECT_CASETTE: {
      return {
        ...state,
        casetteStatus: 'loaded',
        selectedCasette: action.id,
      };
    }

    case EJECT_CASETTE: {
      return {
        ...state,
        casetteStatus: 'idle',
        playStatus: 'stopped',
      };
    }

    case TOGGLE_PLAY_PAUSE: {
      return {
        ...state,
        playStatus: state.playStatus === 'playing' ? 'paused' : 'playing',
      };
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
});

export const casettesListReceive = ({ casettes }) => ({
  type: CASETTES_LIST_RECEIVE,
  casettes,
});

export const viewCasettes = () => ({
  type: VIEW_CASETTES,
});

export const hideCasettes = () => ({
  type: HIDE_CASETTES,
});

export const selectCasette = ({ id }) => ({
  type: SELECT_CASETTE,
  id,
});

export const ejectCasette = () => ({
  type: EJECT_CASETTE,
});

export const casetteActionsReceive = ({ id, casetteActions }) => ({
  type: CASETTE_ACTIONS_RECEIVE,
  id,
  casetteActions,
});

export const togglePlayPause = () => ({
  type: TOGGLE_PLAY_PAUSE,
});
