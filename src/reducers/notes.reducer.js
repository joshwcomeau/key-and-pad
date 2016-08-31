import { ADD_NOTE, REMOVE_NOTE } from '../actions';

const initialState = [];

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
