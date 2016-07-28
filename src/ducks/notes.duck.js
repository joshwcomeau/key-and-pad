const initialState = [];


// ////////////////////////
// ACTION TYPES //////////
// //////////////////////
export const ADD_NOTE = 'NOTES/ADD_NOTE';
export const REMOVE_NOTE = 'NOTES/REMOVE_NOTE';


// ////////////////////////
// REDUCERS //////////////
// //////////////////////
export default function notesReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_NOTE: {
      return [...state, action.note];
    }

    case REMOVE_NOTE: {
      return state.filter(note => note !== action.note);
    }

    default:
      return state;
  }
}


// ////////////////////////
// ACTION CREATORS ///////
// //////////////////////
export const addNote = note => ({
  type: ADD_NOTE,
  note,
});

export const removeNote = note => ({
  type: REMOVE_NOTE,
  note,
});
