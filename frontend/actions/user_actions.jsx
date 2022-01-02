import * as APIUtil from "../util/user_api_util";
import * as ConnectionAPI from "../util/connection_api_util";

import { receiveUser } from "./session_actions";
import { receiveErrors } from "./error_actions";

export const UPDATE_OTHER_USER_WORKSPACE_STATUS = "UPDATE_OTHER_USER_WORKSPACE_STATUS";
export const updateOtherUserWorkspaceStatus = userData => ({
  type: UPDATE_OTHER_USER_WORKSPACE_STATUS,
  userData
});

export const UPDATE_OTHER_USER_CHANNEL_STATUS = "UPDATE_OTHER_USER_CHANNEL_STATUS";
export const updateOtherUserChannelStatus = userData => ({
  type: UPDATE_OTHER_USER_CHANNEL_STATUS,
  userData
});

export const RECEIVE_WORKSPACE_USER = "RECEIVE_WORKSPACE_USER";
export const receiveWorkspaceUser = workspace_user => ({
  type: RECEIVE_WORKSPACE_USER,
  workspace_user
});

export const updateUser = (formData) => (dispatch) => {
  return APIUtil 
    .updateUser(formData) 
    .then(
      (user) => dispatch(receiveUser(user)),
      (errors) => dispatch(receiveErrors(errors))
    );
};

export const updateWorkspaceUser = (workspace_id, workspace_user) => dispatch => (
  ConnectionAPI
    .updateWorkspaceUser(workspace_id, workspace_user)
    .then(
      workspace_user => dispatch(receiveWorkspaceUser(workspace_user)),
      errors => dispatch(receiveErrors(errors))
    )
)