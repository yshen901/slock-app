import * as APIUtil from "../util/user_api_util";
import { receiveUser } from "./session_actions";
import { receiveErrors } from "./error_actions";

export const updateUser = (formData) => (dispatch) => {
  return APIUtil
    .updateUser(formData) 
    .then(
      (user) => dispatch(receiveUser(user)),
      (errors) => dispatch(receiveErrors(errors))
    );
};