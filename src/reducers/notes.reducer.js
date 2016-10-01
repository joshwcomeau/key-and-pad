import { ADD_NOTE, REMOVE_NOTE, REMOVE_ALL_NOTES } from '../actions';

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

    case REMOVE_ALL_NOTES: {
      return [];
    }

    default:
      return state;
  }
}
