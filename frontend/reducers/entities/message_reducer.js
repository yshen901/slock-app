import { LOAD_MESSAGES } from '../../actions/message_actions';

const MessageReducer = (state = {}, action) => {
  Object.freeze(state);

  switch(action.type) {
    case LOAD_MESSAGES:
      return action.messages;
    default:
      return state;
  }
}

export default MessageReducer;