import * as WorkspaceAPI from "../util/workspace_api_util";
import * as ConnectionAPI from "../util/connection_api_util";
import { receiveErrors } from './error_actions';
import { arrayToObject } from "../selectors/selectors";

export const RECEIVE_WORKSPACE = "RECEIVE_WORKSPACE";   //adds workspace to state
export const RECEIVE_WORKSPACES = "RECEIVE_WORKSPACES"; //adds all workspaces to state
export const REMOVE_WORKSPACE = "REMOVE_WORKSPACE";     //removes workspace from state
export const LOAD_WORKSPACE = "LOAD_WORKSPACE";         //adds workspace info (users, id, and current_user_channels) to state

const receiveWorkspace = (workspace) => ({
  type: RECEIVE_WORKSPACE,
  workspace
});

const loadWorkspace = ({workspace, users, user_channels}) => {
  user_channels = Object.keys(arrayToObject(user_channels))
                        .map((id) => parseInt(id));
  return {
    type: LOAD_WORKSPACE,
    workspace,
    users,
    user_channels
  }
}

const removeWorkspace = (workspace) => ({
  type: REMOVE_WORKSPACE,
  workspace
})

const receiveWorkspaces = (workspaces) => ({
  type: RECEIVE_WORKSPACES,
  workspaces: workspaces
});


export const findWorkspace = workspace_address => dispatch => (
  WorkspaceAPI
    .getWorkspace(workspace_address)
    .then(
      null,
      errors => dispatch(receiveErrors(errors))
    )
)

export const getWorkspace = workspace_address => dispatch => (
  WorkspaceAPI
    .getWorkspace(workspace_address)
    .then(
      workspaceInfo => dispatch(loadWorkspace(workspaceInfo)),
      errors => dispatch(receiveErrors(errors))
    )
)

// NOTE: Only gets workspaces of current_user
export const getWorkspaces = () => dispatch => (
  WorkspaceAPI
    .getWorkspaces()
    .then(
      workspaces => dispatch(receiveWorkspaces(workspaces))
    )
)

export const postWorkspace = workspace => dispatch => (
  WorkspaceAPI
    .postWorkspace(workspace)
    .then(
      workspace => dispatch(receiveWorkspace(workspace)),
      errors => dispatch(receiveErrors(errors))
    )
)

export const logoutWorkspace = workspace_id => dispatch => (
  ConnectionAPI
    .logoutWorkspace(workspace_id)
    .then(
      workspace => dispatch(removeWorkspace(workspace)), 
      errors => dispatch(receiveErrors(errors))
    )
)