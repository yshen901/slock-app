import { RECEIVE_USER, LOGOUT } from '../actions/session_actions';
import { RECEIVE_WORKSPACE, REMOVE_WORKSPACE } from '../actions/workspace_actions';
import { RECEIVE_CHANNELS } from '../actions/channel_actions';

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
    case RECEIVE_CHANNELS: //DESIGN: RECEIVE_CHANNELS ALSO UPDATES WORKSPACE_ID
      nextState['workspace_id'] = action.channels[0].workspace_id
      return nextState;
    case REMOVE_WORKSPACE:
      nextState['workspace_id'] = null;
      return nextState;
    case LOGOUT:
      return DEFAULT_SESSION;
    default:
      return state;
  }
}

export default SessionReducer;