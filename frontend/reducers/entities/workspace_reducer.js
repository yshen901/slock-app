import { LOAD_WORKSPACE, RECEIVE_WORKSPACE, RECEIVE_WORKSPACES, REMOVE_WORKSPACE } from "../../actions/workspace_actions";
import { LOGOUT, RECEIVE_USER } from "../../actions/session_actions";
import { UPDATE_OTHER_USER_WORKSPACE_STATUS } from "../../actions/user_actions";
import cloneDeep from "lodash/cloneDeep"

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
    case LOAD_WORKSPACE: 
    case RECEIVE_WORKSPACE:
      nextState = cloneDeep(state);
      nextState[action.workspace.id] = action.workspace;
      return nextState;
    case REMOVE_WORKSPACE:
      nextState = cloneDeep(state);
      delete nextState[action.workspace.workspace_id];
      if (nextState === undefined) nextState = {};
      return nextState;
    case UPDATE_OTHER_USER_WORKSPACE_STATUS:
      let { user, logged_in, workspace_id } = action.userData;
      nextState = cloneDeep(state);

      // Updates workspace login info
      // Adds user if user doesn't already exist (automatically increments)
      if (!nextState[workspace_id].users[user.id]) {
        nextState[workspace_id].users[user.id] = {
          id: user.id,
          logged_in
        };
        nextState[workspace_id].num_logged_in_users += 1;
      }
      else if (nextState[workspace_id].users[user.id].logged_in != logged_in) {
        nextState[workspace_id].users[user.id].logged_in = logged_in;
        if (logged_in)
          nextState[workspace_id].num_logged_in_users += 1;
        else
          nextState[workspace_id].num_logged_in_users -= 1;
      }
      return nextState;
    default:
      return state;
  }
}

export default WorkspaceReducer;