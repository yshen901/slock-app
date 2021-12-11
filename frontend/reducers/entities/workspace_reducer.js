import { LOAD_WORKSPACE, RECEIVE_WORKSPACE, RECEIVE_WORKSPACES, REMOVE_WORKSPACE } from "../../actions/workspace_actions";
import { LOGOUT, RECEIVE_USER } from "../../actions/session_actions";
import { UPDATE_OTHER_USER_WORKSPACE_STATUS } from "../../actions/user_actions";

const WorkspaceReducer = (state = {}, action) => {
  Object.freeze(state);
  let nextState;

  switch(action.type) {
    case LOGOUT:
      return {};
    case RECEIVE_WORKSPACES:
      return action.workspaces;
    case RECEIVE_USER:
      return action.user.workspaces;
    case RECEIVE_WORKSPACE:
      nextState = Object.assign({}, state);
      nextState[action.workspace.id] = action.workspace;
      return nextState;
    case REMOVE_WORKSPACE:
      nextState = Object.assign({}, state);
      delete nextState[action.workspace.workspace_id];
      if (nextState === undefined) nextState = {};
      return nextState;
    case UPDATE_OTHER_USER_WORKSPACE_STATUS:
      let { user_id, logged_in } = action.userData;
      nextState = Object.assign({}, state);

      // Update workspace user login information
      if (nextState.users[user_id].logged_in != logged_in) {
        nextState.users[user_id].logged_in = logged_in;
        if (logged_in)
          nextState.num_logged_in_users += 1;
        else
          nextState.num_logged_in_users -= 1;
      }
      return nextState;
    default:
      return state;
  }
}

export default WorkspaceReducer;