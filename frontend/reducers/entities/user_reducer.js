import { RECEIVE_USER, LOGOUT } from '../../actions/session_actions';
import { RECEIVE_WORKSPACE_USER, UPDATE_OTHER_USER_WORKSPACE_STATUS } from '../../actions/user_actions';
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
      for (let i = 0; i < userIds.length; i++) {
        nextState[userIds[i]].logged_in = action.workspace.users[userIds[i]].logged_in;
        nextState[userIds[i]].status = action.workspace.users[userIds[i]].status;
        nextState[userIds[i]].active = action.workspace.users[userIds[i]].active;
        nextState[userIds[i]].paused = action.workspace.users[userIds[i]].paused;
      }
      return nextState;
    case RECEIVE_USER:
      nextState[action.user.id] = action.user;
      return nextState;
    case RECEIVE_WORKSPACE_USER:
      let { user_id, active, status, paused } = action.workspace_user;
      Object.assign(nextState[user_id], {active, status, paused});
      return nextState;
    case UPDATE_OTHER_USER_WORKSPACE_STATUS:
      let { user, logged_in, workspace_id } = action.userData;
      nextState = Object.assign({}, state);

      // Copy over all of the user's data that they passed up
      nextState[user.id] = user;
      // Update workspace user login information (not deprecated for logout)
      nextState[user.id].logged_in = logged_in;
      return nextState;
    default:
      return state;
  }
}

export default UserReducer;