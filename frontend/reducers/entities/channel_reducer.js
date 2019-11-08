import { RECEIVE_WORKSPACE } from '../../actions/workspace_actions';

const ChannelReducer = (state = {}, action) => {
  Object.freeze(state);

  switch(action.type) {
    case RECEIVE_WORKSPACE:
      return action.channels;
    default:
      return state
  }
}


export default ChannelReducer