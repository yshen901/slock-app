import { cloneDeep } from 'lodash';
import { LOAD_MESSAGES, RECEIVE_MESSAGE_REACT, REMOVE_MESSAGE_REACT } from '../../actions/message_actions';

const MessageReducer = (state = {}, action) => {
  Object.freeze(state);
  let newState = cloneDeep(state);
  let react_code, user_id, message_id;

  switch(action.type) {
    case LOAD_MESSAGES:
      return action.messages;
    case RECEIVE_MESSAGE_REACT: // increment or start counting
      react_code = action.message_react.react_code;
      user_id = action.message_react.user_id;
      message_id = action.message_react.message_id;
      debugger;
      if (newState[message_id].total_reacts[react_code])
        newState[message_id].total_reacts[react_code] += 1;
      else
        newState[message_id].total_reacts[react_code] = 1;
      return newState;
    case REMOVE_MESSAGE_REACT: // only changes if it is greater than 0
      react_code = action.message_react.react_code;
      user_id = action.message_react.user_id;
      message_id = action.message_react.message_id;
      if (newState[message_id].total_reacts[react_code] > 0)
        newState[message_id].total_reacts[react_code] -= 1;
      return newState;
    default:
      return state;
  }
}

export default MessageReducer;