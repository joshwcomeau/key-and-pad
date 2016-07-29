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
  const { type, ...note } = action;
  switch (type) {
    case ADD_NOTE: {
      return [...state, note];
    }

    case REMOVE_NOTE: {
      return state.filter(note => note.value !== action.value);
    }

    default:
      return state;
  }
}


// ////////////////////////
// ACTION CREATORS ///////
// //////////////////////
export const addNote = ({ value, letter }) => ({
  type: ADD_NOTE,
  value,
  letter
});

export const removeNote = ({ value }) => ({
  type: REMOVE_NOTE,
  value,
});
