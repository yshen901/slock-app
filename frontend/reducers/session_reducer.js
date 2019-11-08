import { RECEIVE_USER, LOGOUT_CURRENT_USER } from '../actions/session_actions';
import { RECEIVE_WORKSPACE } from '../actions/workspace_actions';

// TODO: NO NEED TO BOOSTRAP WORKSPACE, AS EVERYTHING CAN BE FOUND THROUGH CURRENT_USER
let DEFAULT_SESSION = {
  user_id: null, 
  workspace_id: null
};

const SessionReducer = (state = DEFAULT_SESSION, action) => {
  Object.freeze(state);
  let nextState = Object.assign({}, state);
  switch(action.type) {
    case RECEIVE_USER:
      nextState['user_id'] = action.user.id;
      return nextState;
    case RECEIVE_WORKSPACE:
      nextState['workspace_id'] = action.workspace.id;
      return nextState;
    case LOGOUT_CURRENT_USER:
      return DEFAULT_SESSION;
    default:
      return state;
  }
}

export default SessionReducer;