import { RECEIVE_USER, LOGOUT } from '../actions/session_actions';
import { RECEIVE_WORKSPACE, REMOVE_WORKSPACE, LOAD_WORKSPACE } from '../actions/workspace_actions';
import { LOAD_CHANNEL, RECEIVE_CHANNEL, JOIN_CHANNEL, LEAVE_CHANNEL } from '../actions/channel_actions';

let DEFAULT_SESSION = {
  user_id: null, 
  workspace_id: null,
  channel_id: null,
  user_channels: []
};

const SessionReducer = (state = DEFAULT_SESSION, action) => {
  Object.freeze(state);
  let nextState = Object.assign({}, state);
  let channel_id, channel_user;

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

    case RECEIVE_CHANNEL:
      if (!nextState['user_channels'].includes(action.channel.id))
        nextState['user_channels'].push(action.channel.id)
      return nextState;
    case LOAD_CHANNEL:
      nextState['channel_id'] = action.channel_id;
      return nextState;

    case JOIN_CHANNEL:
      channel_id = action.channel_user.channel_id;
      if (!nextState['user_channels'].includes(channel_id))
        nextState['user_channels'].push(channel_id);
      return nextState;
    case LEAVE_CHANNEL:
      channel_id = action.channel_user.channel_id;
      let { user_channels } = nextState;
      for (let i = 0; i < user_channels.length; i++)
        if (user_channels[i] === channel_id)
          user_channels.splice(i, 1)
      return nextState;

    case LOGOUT:
      return DEFAULT_SESSION;
    default:
      return state;
  }
}

export default SessionReducer;