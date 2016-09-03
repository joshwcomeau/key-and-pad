import {
  OPEN_MODAL,
  CLOSE_MODAL,
} from '../actions';


const initialState = null;

export default function modalReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_MODAL: return action.name;
    case CLOSE_MODAL: return null;
    default: return state;
  }
}
