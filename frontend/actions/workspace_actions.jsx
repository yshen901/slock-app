import * as WorkspaceAPI from "../util/workspace_api_util";
import * as ChannelAPI from '../util/channel_api_util';
import { arrayToObject } from '../selectors/selectors';

export const RECEIVE_WORKSPACE = "RECEIVE_WORKSPACE";

const receiveWorkspace = (workspace, channels) => ({
  type: RECEIVE_WORKSPACE,
  workspace,
  channels: arrayToObject(channels)
});

export const getWorkspace = (workspace_address) => dispatch => (
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