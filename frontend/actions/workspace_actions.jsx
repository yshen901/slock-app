import * as WorkspaceAPI from "../util/workspace_api_util";
import * as ConnectionAPI from "../util/connection_api_util";
import { receiveErrors } from './error_actions';

export const RECEIVE_WORKSPACE = "RECEIVE_WORKSPACE";   //adds workspace to state
export const RECEIVE_WORKSPACES = "RECEIVE_WORKSPACES"; //adds all workspaces to state
export const REMOVE_WORKSPACE = "REMOVE_WORKSPACE";     //removes workspace from state
export const LOAD_WORKSPACE = "LOAD_WORKSPACE";         //adds workspace info (users, id, and current_user_channels) to state

const receiveWorkspace = ({workspace, users, user_channels, channels}) => ({
  type: RECEIVE_WORKSPACE,
  workspace,
  channels,
  users,
  user_channels,
});

const loadWorkspace = ({workspace, users, user_channels, channels, user_dm_channels, dm_channels}) => ({
  type: LOAD_WORKSPACE,
  workspace,
  users,
  channels,
  user_channels,
  dm_channels,
  user_dm_channels
})

const removeWorkspace = (workspace) => ({
  type: REMOVE_WORKSPACE,
  workspace
});

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

// Gets workspaces of current user, only outputs id and address for each
export const getWorkspaces = () => dispatch => (
  WorkspaceAPI
    .getWorkspaces()
    .then(
      workspaces => dispatch(receiveWorkspaces(workspaces)),
      errors => dispatch(receiveErrors(errors))
    )
)

// Uses address to get all of the information about a workspace
export const getWorkspace = workspace_address => dispatch => (
  WorkspaceAPI
    .getWorkspace(workspace_address)
    .then(
      workspaceInfo => dispatch(loadWorkspace(workspaceInfo)),
      errors => dispatch(receiveErrors(errors))
    )
)

// After creating workspaces, load the workspace  as well
export const postWorkspace = workspace => dispatch => (
  WorkspaceAPI
    .postWorkspace(workspace)
    .then(
      workspace => dispatch(receiveWorkspace(workspace)),
      errors => dispatch(receiveErrors(errors))
    )
)

// Logs out of a single workspace by setting connection logged_in flag to false
// Then removes it from state
export const logoutWorkspace = workspace_id => dispatch => (
  ConnectionAPI
    .logoutWorkspace(workspace_id)
    .then(
      workspace => dispatch(removeWorkspace(workspace)), 
      errors => dispatch(receiveErrors(errors))
    )
)