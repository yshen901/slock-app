import { RECEIVE_USER, LOGOUT } from '../actions/session_actions';
import { REMOVE_WORKSPACE, LOAD_WORKSPACE } from '../actions/workspace_actions';
import { LOAD_CHANNEL, RECEIVE_CHANNEL, JOIN_CHANNEL, LEAVE_CHANNEL } from '../actions/channel_actions';
import { JOIN_DM_CHANNEL, LEAVE_DM_CHANNEL } from '../actions/dm_channel_actions';
import { RECEIVE_ERRORS } from '../actions/error_actions';
import cloneDeep from "lodash/cloneDeep"

let DEFAULT_SESSION = {
  user_id: null, 
  workspace_id: null,
  channel_id: null,
  user_channels: {}
};

const SessionReducer = (state = DEFAULT_SESSION, action) => {
  Object.freeze(state);
  let nextState = cloneDeep(state);
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

    // Same as join channel, we just add it to the list
    case JOIN_DM_CHANNEL:
      channel_id = action.dmChannelUser.channel.id;
      nextState.user_channels[channel_id] = { [channel_id]: channel_id};
      return nextState;
    
    // Same as leave channel, we just add it to the list
    case LEAVE_DM_CHANNEL:
      channel_id = action.dmChannelUser.channel.id;
      delete nextState.user_channels[channel_id];
      if (nextState.user_channels === undefined) nextState.user_channels = {} // in case that was the last channel
      return nextState;

    case LOGOUT:
      return DEFAULT_SESSION;
    default:
      return state;
  }
}

export default SessionReducer;