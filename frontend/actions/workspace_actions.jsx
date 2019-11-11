import * as WorkspaceAPI from "../util/workspace_api_util";
import * as ConnectionAPI from "../util/connection_api_util";
import { receiveErrors } from './error_actions';

export const RECEIVE_WORKSPACE = "RECEIVE_WORKSPACE";
export const REMOVE_WORKSPACE = "REMOVE_WORKSPACE";
export const RECEIVE_WORKSPACES = "RECEIVE_WORKSPACES";


const receiveWorkspace = (workspace) => ({
  type: RECEIVE_WORKSPACE,
  workspace
});

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
      workspace => dispatch(receiveWorkspace(workspace)),
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