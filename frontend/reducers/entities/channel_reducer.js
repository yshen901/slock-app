import { 
  RECEIVE_CHANNEL, 
  JOIN_CHANNEL,
  LEAVE_CHANNEL,
} from '../../actions/channel_actions'

import { LOAD_WORKSPACE } from '../../actions/workspace_actions';
import { LOGOUT } from '../../actions/session_actions';

import { arrayToObject } from '../../selectors/selectors';

const ChannelReducer = (state = {}, action) => {
  Object.freeze(state);
  let nextState, channel_id, user_id, channel_users;

  switch(action.type) {
    case LOGOUT:
      return {};

    //EDIT THISSSS
    case LOAD_WORKSPACE:
      return arrayToObject(action.channels);
    case RECEIVE_CHANNEL:
      nextState = Object.assign({}, state);
      nextState[action.channel.id] = action.channel;
      return nextState;

    case JOIN_CHANNEL:
      nextState = Object.assign({}, state);
      channel_id = action.channel_user.channel_id;
      user_id = action.channel_user.user_id;
      channel_users = nextState[channel_id].users;
      if (!channel_users.includes(user_id))
        channel_users.push(user_id);
      return nextState;

    case LEAVE_CHANNEL:
      nextState = Object.assign({}, state);
      channel_id = action.channel_user.channel_id;
      user_id = action.channel_user.user_id;
      channel_users = nextState[channel_id].users;
      for (let i = 0; i < channel_users.length; i++)
        if (channel_users[i] === user_id) 
          channel_users.splice(i, 1);
      return nextState;

    default:
      return state
  }
}


export default ChannelReducer