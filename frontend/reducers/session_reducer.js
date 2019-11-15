import { RECEIVE_USER, LOGOUT } from '../actions/session_actions';
import { REMOVE_WORKSPACE, LOAD_WORKSPACE } from '../actions/workspace_actions';
import { LOAD_CHANNEL, RECEIVE_CHANNEL, JOIN_CHANNEL, LEAVE_CHANNEL } from '../actions/channel_actions';

let DEFAULT_SESSION = {
  user_id: null, 
  workspace_id: null,
  channel_id: null,
  user_channels: {}
};

const SessionReducer = (state = DEFAULT_SESSION, action) => {
  Object.freeze(state);
  let nextState = Object.assign({}, state);
  let channel_id;

  switch(action.type) {
    case RECEIVE_USER:
      nextState.user_id = action.user.id;
      return nextState;

    case LOAD_WORKSPACE:
      nextState.user_channels = action.user_channels ? action.user_channels : {} ;
      nextState.workspace_id = action.workspace.id;
      return nextState;

    case REMOVE_WORKSPACE:
      nextState.workspace_id = null;
      nextState.channel_id = null;
      nextState.user_channels = {};
      return nextState;

    case RECEIVE_CHANNEL:
      channel_id = action.channel.id;
      nextState.user_channels[channel_id] = { [channel_id]: channel_id }
      return nextState;
      
    case LOAD_CHANNEL:
      nextState.channel_id = action.channel_id;
      return nextState;

    case JOIN_CHANNEL:
      channel_id = action.channel_user.channel_id;
      nextState.user_channels[channel_id] = { [channel_id]: channel_id};
      return nextState;

    case LEAVE_CHANNEL:
      channel_id = action.channel_user.channel_id;
      delete nextState.user_channels[channel_id];
      if (nextState.user_channels === undefined) nextState.user_channels = {}
      return nextState;

    case LOGOUT:
      return DEFAULT_SESSION;
    default:
      return state;
  }
}

export default SessionReducer;