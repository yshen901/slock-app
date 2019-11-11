import { RECEIVE_WORKSPACE, RECEIVE_WORKSPACES } from '../../actions/workspace_actions';
import { RECEIVE_CHANNEL } from '../../actions/channel_actions'
import { LOGOUT_CURRENT_USER } from '../../actions/session_actions';

const ChannelReducer = (state = {}, action) => {
  Object.freeze(state);
  let nextState;

  switch(action.type) {
    case LOGOUT_CURRENT_USER:
    case RECEIVE_WORKSPACES:
      return {};
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