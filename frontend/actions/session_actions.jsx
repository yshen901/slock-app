import * as SessionAPI from '../util/session_api_util';
import * as WorkspaceAPI from '../util/workspace_api_util';
import { receiveErrors } from './error_actions';

export const RECEIVE_USER = 'RECEIVE_USER';
export const LOGOUT = 'LOGOUT';

// DEFAULT WORKSPACE EVERYONE IS PLACED INTO UPON SIGNUP
export const DEMO_WORKSPACE = 'demo-workspace';

/* NOTE: How actions (thunk and creater) work
       1) Receives currentUser, as this action is the same regardless of signin/logout
             the change to the state is the same!
       2) This action after dispatched will go through each reducer, so an action
             like this can actually affect both session and user! 
*/
export const receiveUser = currentUser => ({
  type: RECEIVE_USER,
  user: currentUser
});

export const logoutCurrentUser = () => ({
  type: LOGOUT
});

export const signup = user => dispatch => (
  SessionAPI
    .signup(user) 
    .then(
      user => dispatch(receiveUser(user)),
      errors => dispatch(receiveErrors(errors))
    )
);

export const login = user => dispatch => (
  SessionAPI
    .login(user)
    .then(
      user => dispatch(receiveUser(user)),
      errors => dispatch(receiveErrors(errors))
    )
);

export const logout = () => dispatch => (
  SessionAPI
    .logout()
    .then(
      () => dispatch(logoutCurrentUser()),
      errors => dispatch(receiveErrors(errors))
    )
);