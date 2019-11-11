import { RECEIVE_USER, LOGOUT } from '../../actions/session_actions';

const UserReducer = (state = { }, action) => {
  Object.freeze(state);

  switch (action.type) {
    case LOGOUT:
      return {};
    case RECEIVE_USER:
      return {[action.user.id]: action.user};
    default:
      return state;
  }
}

export default UserReducer;