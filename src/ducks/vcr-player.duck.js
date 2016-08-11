const initialState = {
  casettes: {},
  selectedCasette: null,
  casetteStatus: 'idle', // One of 'idle', 'selecting', 'loaded'
  casettePageNumber: 0,
  casettePageLimit: 3,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CASETTES_LIST_RECEIVE: {
      return {
        ...state,
        casettes: action.casettes,
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

    default:
      return state;
  }
}
