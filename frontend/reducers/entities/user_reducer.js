import { RECEIVE_USER, LOGOUT } from '../../actions/session_actions';
import { arrayToObject } from '../../selectors/selectors';
import { LOAD_WORKSPACE } from '../../actions/workspace_actions';

const UserReducer = (state = { }, action) => {
  Object.freeze(state);
  let nextState = Object.assign({}, state);

  switch (action.type) {
    case LOGOUT:
      return {}
    case LOAD_WORKSPACE:
      return arrayToObject(action.users);
    case RECEIVE_USER:
      nextState[action.user.id] = action.user;
      return nextState;
    default:
      return state;
  }
}

export default UserReducer;