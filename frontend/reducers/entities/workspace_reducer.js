import { RECEIVE_WORKSPACE, RECEIVE_WORKSPACES } from "../../actions/workspace_actions";

const WorkspaceReducer = (state = {}, action) => {
  Object.freeze(state);
  let nextState;

  switch(action.type) {
    case RECEIVE_WORKSPACES:
      return action.workspaces;
    case RECEIVE_WORKSPACE:
      nextState = Object.assign({}, state);
      nextState[action.workspace.id] = action.workspace;
      return nextState;
    default:
      return state;
  }
}

export default WorkspaceReducer;