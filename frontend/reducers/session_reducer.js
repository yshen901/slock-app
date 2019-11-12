import { RECEIVE_USER, LOGOUT } from '../actions/session_actions';
import { RECEIVE_WORKSPACE, REMOVE_WORKSPACE, LOAD_WORKSPACE } from '../actions/workspace_actions';
import { LOAD_CHANNEL } from '../actions/channel_actions';

let DEFAULT_SESSION = {
  user_id: null, 
  workspace_id: null,
  channel_id: null,
  user_channels: null
};

const SessionReducer = (state = DEFAULT_SESSION, action) => {
  Object.freeze(state);
  let nextState = Object.assign({}, state);
  switch(action.type) {
    case RECEIVE_USER:
      nextState['user_id'] = action.user.id;
      return nextState;

    case LOAD_WORKSPACE:
      nextState['user_channels'] = action.user_channels;
    case RECEIVE_WORKSPACE:
      nextState['workspace_id'] = parseInt(action.workspace.id);
      return nextState;

    case REMOVE_WORKSPACE:
      nextState['workspace_id'] = null;
      return nextState;

    case LOAD_CHANNEL:
      nextState['channel_id'] = action.channel_id;
      return nextState;

    case LOGOUT:
      return DEFAULT_SESSION;
    default:
      return state;
  }
}

export default SessionReducer;