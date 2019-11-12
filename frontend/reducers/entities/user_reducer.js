import { RECEIVE_USER, LOGOUT } from '../../actions/session_actions';
import { RECEIVE_CHANNELS } from '../../actions/channel_actions';
import { arrayToObject } from '../../selectors/selectors';

const UserReducer = (state = { }, action) => {
  Object.freeze(state);
  let nextState = Object.assign({}, state);

  switch (action.type) {
    case LOGOUT:
      return {}
    case RECEIVE_USER:
      nextState[action.user.id] = action.user;
      return nextState;
    case RECEIVE_CHANNELS: //DESIGN: RECEIVE_CHANNELS ALSO PULLS IN USERS
      nextState = Object.assign({}, state, arrayToObject(action.users));
      return nextState;
    default:
      return state;
  }
}

export default UserReducer;