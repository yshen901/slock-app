import { RECEIVE_USER, LOGOUT_CURRENT_USER } from '../actions/session_actions';

const SessionReducer = (state = {id: null}, action) => {
  Object.freeze(state);
  let nextState = Object.assign({}, state);

  switch(action.type) {
    case RECEIVE_USER:
      return {id: action.user.id}
    case LOGOUT_CURRENT_USER:
      return {id: null}
    default:
      return state;
  }
}

export default SessionReducer;