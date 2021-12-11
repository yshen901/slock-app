import { RECEIVE_USER, LOGOUT } from '../../actions/session_actions';
import { LOAD_WORKSPACE } from '../../actions/workspace_actions';

const UserReducer = (state = { }, action) => {
  Object.freeze(state);
  let nextState = Object.assign({}, state);

  switch (action.type) {
    // case REMOVE_WORKSPACE: TODO: CLEAR ALL BUT THE CURRENT USER
    case LOGOUT:
      return {};
    case LOAD_WORKSPACE:
      nextState = Object.assign({}, action.users); // add user login information from workspace
      let userIds = Object.keys(nextState);
      for (let i = 0; i < userIds.length; i++) 
        nextState[userIds[i]].logged_in = action.workspace.users[userIds[i]].logged_in;
      return nextState;
    case RECEIVE_USER:
      nextState[action.user.id] = action.user;
      return nextState;
    default:
      return state;
  }
}

export default UserReducer;