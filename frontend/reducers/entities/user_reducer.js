import { RECEIVE_USER } from '../../actions/session_actions';

const UserReducer = (state = { }, action) => {
  Object.freeze(state);
  let nextState = Object.assign({}, state);

  switch (action.type) {
    case RECEIVE_USER:
      nextState[action.user.id] = action.user;
      return nextState;
    // case LOGOUT_CURRENT_USER:
    //   delete nextState[action.user.id];
    //   return nextState;
    default:
      return state;
  }
}

export default UserReducer;