import { RECEIVE_CHANNEL, RECEIVE_CHANNELS } from '../../actions/channel_actions'
import { LOGOUT } from '../../actions/session_actions';

const ChannelReducer = (state = {}, action) => {
  Object.freeze(state);
  let nextState;

  switch(action.type) {
    case LOGOUT:
      return {};
    case RECEIVE_CHANNELS:
      return action.channels;
    case RECEIVE_CHANNEL:
      nextState = Object.assign({}, state);
      nextState[action.channel.id] = action.channel;
      return nextState;
    default:
      return state
  }
}


export default ChannelReducer