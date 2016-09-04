import { SET_ADMIN_MODE } from '../actions';

const initialState = false;

export default function isAdminReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ADMIN_MODE: return action.adminMode;
    default: return state;
  }
}
