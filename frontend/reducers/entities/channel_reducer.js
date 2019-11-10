import { RECEIVE_WORKSPACE } from '../../actions/workspace_actions';
import { RECEIVE_CHANNEL } from '../../actions/channel_actions'

const ChannelReducer = (state = {}, action) => {
  Object.freeze(state);
  let nextState;

  switch(action.type) {
    case RECEIVE_WORKSPACE:
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