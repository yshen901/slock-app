import * as WorkspaceAPI from "../util/workspace_api_util";
import * as ChannelAPI from '../util/channel_api_util';
import { arrayToObject } from '../selectors/selectors';
import { receiveErrors } from './error_actions';

export const RECEIVE_WORKSPACE = "RECEIVE_WORKSPACE";
export const RECEIVE_WORKSPACES = "RECEIVE_WORKSPACES";


const receiveWorkspace = (workspace, channels) => ({
  type: RECEIVE_WORKSPACE,
  workspace,
  channels: arrayToObject(channels)
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

export const getWorkspace = workspace_address => dispatch => (
  WorkspaceAPI
    .getWorkspace(workspace_address)
    .then(
      workspace => {
        ChannelAPI
          .getChannels(workspace.id)
          .then(channels => dispatch(receiveWorkspace(workspace, channels)))
      },
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
      workspace => {
        ChannelAPI
          .getChannels(workspace.id)
          .then(channels => dispatch(receiveWorkspace(workspace, channels)))
      }
    )
)