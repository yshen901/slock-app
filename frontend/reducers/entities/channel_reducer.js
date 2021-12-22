import { 
  RECEIVE_CHANNEL, 
  JOIN_CHANNEL,
  LEAVE_CHANNEL,
  RECEIVE_CHANNEL_USER
} from '../../actions/channel_actions'

import { LOAD_WORKSPACE, REMOVE_WORKSPACE } from '../../actions/workspace_actions';
import { LOGOUT } from '../../actions/session_actions';
import { JOIN_DM_CHANNEL, LEAVE_DM_CHANNEL } from '../../actions/dm_channel_actions';
import { UPDATE_OTHER_USER_CHANNEL_STATUS } from '../../actions/user_actions';
import cloneDeep from "lodash/cloneDeep";


const ChannelReducer = (state = {}, action) => {
  Object.freeze(state);
  let nextState, channel_id, user_id, channel_users;

  switch(action.type) {
    case REMOVE_WORKSPACE:
    case LOGOUT:
      return {};

    //EDIT THIS
    case LOAD_WORKSPACE:
      return action.channels;
    case RECEIVE_CHANNEL:
      nextState = cloneDeep(state);
      nextState[action.channel.id] = action.channel;
      return nextState;

    case JOIN_CHANNEL:
      nextState = cloneDeep(state);
      channel_id = action.channel_user.channel_id;
      user_id = action.channel_user.user_id;
      if (nextState[channel_id].users === undefined) nextState[channel_id].users = {}
      nextState[channel_id].users[user_id] = { [user_id]: { id: user_id } }
      return nextState;

    case LEAVE_CHANNEL:
      nextState = cloneDeep(state);
      channel_id = action.channel_user.channel_id;
      user_id = action.channel_user.user_id;
      if (nextState[channel_id].users)
        delete nextState[channel_id].users[user_id]
        if (nextState[channel_id].users === undefined) nextState[channel_id].users = {}
      return nextState;

    // primarily pull out starred information, can add more later
    case RECEIVE_CHANNEL_USER:
      nextState = cloneDeep(state);
      channel_id = action.channel_user.channel_id;
      nextState[channel_id].starred = action.channel_user.starred;
      return nextState;

    // same as ReceiveChannel since we don't need to change users
    case JOIN_DM_CHANNEL: 
      nextState = cloneDeep(state);
      nextState[action.dmChannelUser.channel.id] = action.dmChannelUser.channel;
      return nextState;

    // Not needed, since we don't need to edit channel
    case LEAVE_DM_CHANNEL: 
      nextState = cloneDeep(state);
      nextState[action.dmChannelUser.channel.id] = action.dmChannelUser.channel;
      return nextState;

    // Update the channel's user list depending on whether its a login or logout action
    case UPDATE_OTHER_USER_CHANNEL_STATUS:
      let {user_id, channel_id, login} = action.userData
      nextState = cloneDeep(state);
      if (login)
        nextState[channel_id].users[user_id] = { id: user_id };
      else
        delete nextState[channel_id].users[user_id];
      return nextState;
    default:
      return state
  }
}


export default ChannelReducer