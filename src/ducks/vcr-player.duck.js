const initialState = {
  casettes: {},
  actions: {},
  selectedCasette: null,
  playStatus: 'stopped', // One of 'playing', 'paused', 'stopped'
  casetteStatus: 'idle', // One of 'idle', 'selecting', 'loaded'
  casettePageNumber: 0,
  casettePageLimit: 3,
  numOfCasetteActionsPlayed: 0,
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
export const PLAY_CASETTE = 'VCR_PLAYER/PLAY_CASETTE';
export const PAUSE_CASETTE = 'VCR_PLAYER/PAUSE_CASETTE';
export const STOP_CASETTE = 'VCR_PLAYER/STOP_CASETTE';
export const REWIND_CASETTE_AND_RESTORE_APP = 'VCR_PLAYER/REWIND_CASETTE_AND_RESTORE_APP';
export const GO_TO_NEXT_CASETTE_PAGE = 'VCR_PLAYER/GO_TO_NEXT_CASETTE_PAGE';
export const GO_TO_PREVIOUS_CASETTE_PAGE = 'VCR_PLAYER/GO_TO_PREVIOUS_CASETTE_PAGE';
export const CASETTE_ACTIONS_RECEIVE = 'VCR_PLAYER/CASETTE_ACTIONS_RECEIVE';
export const TOGGLE_PLAY_PAUSE = 'VCR_PLAYER/TOGGLE_PLAY_PAUSE';
export const INCREMENT_ACTIONS_PLAYED = 'VCR_PLAYER/INCREMENT_ACTIONS_PLAYED';

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

    case PLAY_CASETTE: {
      return {
        ...state,
        playStatus: 'playing',
      };
    }

    case PAUSE_CASETTE: {
      return {
        ...state,
        playStatus: 'paused',
      };
    }

    case STOP_CASETTE: {
      return {
        ...state,
        playStatus: 'stopped',
        numOfCasetteActionsPlayed: 0,
      };
    }

    case GO_TO_NEXT_CASETTE_PAGE: {
      return {
        ...state,
        casettePageNumber: state.casettePageNumber + 1,
      };
    }

    case GO_TO_PREVIOUS_CASETTE_PAGE: {
      return {
        ...state,
        casettePageNumber: state.casettePageNumber - 1,
      };
    }

    case INCREMENT_ACTIONS_PLAYED: {
      return {
        ...state,
        numOfCasetteActionsPlayed: state.numOfCasetteActionsPlayed + 1,
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

export const playCasette = () => ({
  type: PLAY_CASETTE,
});

export const pauseCasette = () => ({
  type: PAUSE_CASETTE,
});

export const stopCasette = () => ({
  type: STOP_CASETTE,
});

// This is a special action, used by our higher-order reducer to wipe the state.
// It ensures that when a tape is played, it plays in the right context.
export const rewindCasetteAndRestoreApp = () => ({
  type: REWIND_CASETTE_AND_RESTORE_APP,
});

export const goToNextCasettePage = () => ({
  type: GO_TO_NEXT_CASETTE_PAGE,
});

export const goToPreviousCasettePage = () => ({
  type: GO_TO_PREVIOUS_CASETTE_PAGE,
});

export const casetteActionsReceive = ({ id, casetteActions }) => ({
  type: CASETTE_ACTIONS_RECEIVE,
  id,
  casetteActions,
});

export const incrementActionsPlayed = () => ({
  type: INCREMENT_ACTIONS_PLAYED,
});
