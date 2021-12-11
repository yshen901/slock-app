import * as APIUtil from "../util/user_api_util";
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

export const updateUser = (formData) => (dispatch) => {
  return APIUtil
    .updateUser(formData) 
    .then(
      (user) => dispatch(receiveUser(user)),
      (errors) => dispatch(receiveErrors(errors))
    );
};