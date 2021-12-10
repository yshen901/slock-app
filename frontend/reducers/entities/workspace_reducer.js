import { RECEIVE_WORKSPACE, RECEIVE_WORKSPACES, REMOVE_WORKSPACE } from "../../actions/workspace_actions";
import { LOGOUT, RECEIVE_USER } from "../../actions/session_actions";

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
    default:
      return state;
  }
}

export default WorkspaceReducer;