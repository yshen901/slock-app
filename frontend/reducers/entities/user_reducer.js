import { RECEIVE_USER, LOGOUT } from '../../actions/session_actions';

const UserReducer = (state = { }, action) => {
  Object.freeze(state);
  // let nextState = Object.assign({}, state);

  switch (action.type) {
    case LOGOUT:
      return {}
    case RECEIVE_USER:
      return {[action.user.id]: action.user};
      // nextState[action.user.id] = action.user;
      // return nextState;
    default:
      return state;
  }
}

export default UserReducer;