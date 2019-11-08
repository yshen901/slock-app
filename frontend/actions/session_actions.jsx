import * as SessionAPI from '../util/session_api_util';

export const RECEIVE_USER = 'RECEIVE_USER';
export const LOGOUT_CURRENT_USER = 'LOGOUT_CURRENT_USER';
export const RECEIVE_ERRORS = "RECEIVE_ERRORS";

// DEFAULT WORKSPACE EVERYONE IS PLACED INTO UPON SIGNUP
export const HOME_WORKSPACE = 'slack';

/* NOTE: How actions (thunk and creater) work
       1) Receives currentUser, as this action is the same regardless of signin/logout
             the change to the state is the same!
       2) This action after dispatched will go through each reducer, so an action
             like this can actually affect both session and user! 
*/
const receiveUser = currentUser => ({
  type: RECEIVE_USER,
  user: currentUser
});

const logoutCurrentUser = () => ({
  type: LOGOUT_CURRENT_USER
});

const receiveErrors = errors => ({
  type: RECEIVE_ERRORS,
  errors
})

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
    .then(user => dispatch(receiveUser(user)),
      errors => dispatch(receiveErrors(errors))
    )
);

export const logout = () => dispatch => (
  SessionAPI
    .logout()
    .then(() => dispatch(logoutCurrentUser()),
      errors => dispatch(receiveErrors(errors))
    )
);

