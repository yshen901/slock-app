import { RECEIVE_USER, LOGOUT } from '../../actions/session_actions';
import { LOAD_WORKSPACE, REMOVE_WORKSPACE } from '../../actions/workspace_actions';

const UserReducer = (state = { }, action) => {
  Object.freeze(state);
  let nextState = Object.assign({}, state);

  switch (action.type) {
    // case REMOVE_WORKSPACE: TODO: CLEAR ALL BUT THE CURRENT USER
    case LOGOUT:
      return {}
    case LOAD_WORKSPACE:
      return action.users;
    case RECEIVE_USER:
      nextState[action.user.id] = action.user;
      return nextState;
    default:
      return state;
  }
}

export default UserReducer;