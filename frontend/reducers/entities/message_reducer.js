import { cloneDeep } from 'lodash';
import { 
  LOAD_MESSAGES, 
  RECEIVE_MESSAGE, 
  REMOVE_MESSAGE,
  RECEIVE_MESSAGE_REACT, 
  RECEIVE_MESSAGE_SAVE, 
  RECEIVE_MESSAGE_SAVES, 
  REMOVE_MESSAGE_REACT, 
} from '../../actions/message_actions';
import { getMessageDate, getMessageTimestamp } from '../../selectors/selectors';

const MessageReducer = (state = {}, action) => {
  Object.freeze(state);
  let newState = cloneDeep(state);
  let react_code, user_id, message_id, currentDate;

  switch(action.type) {
    case RECEIVE_MESSAGE_SAVES: 
    case LOAD_MESSAGES:
      let messageIds = Object.keys(action.messages);
      let messages = cloneDeep(action.messages);
      currentDate = (new Date(Date())).toLocaleDateString(); // initialized once to speed up the selector

      for (let i = 0; i < messageIds.length; i++) {
        messages[messageIds[i]].created_date = getMessageDate(messages[messageIds[i]], currentDate);
        messages[messageIds[i]].created_time = getMessageTimestamp(messages[messageIds[i]]);
      }
      return messages;
    case RECEIVE_MESSAGE:
      let message = cloneDeep(action.message);
      currentDate = (new Date(Date())).toLocaleDateString(); // initialized once to speed up the selector

      message.created_date = getMessageDate(message, currentDate);
      message.created_time = getMessageTimestamp(message);
      newState[message.id] = message;
      return newState;
    case REMOVE_MESSAGE:
      delete newState[action.message.id];
      return newState;
      
    case RECEIVE_MESSAGE_REACT: // increment or start counting
      react_code = action.message_react.react_code;
      user_id = action.message_react.user_id;
      message_id = action.message_react.message_id;

      if (newState[message_id].total_reacts[react_code])    // update total_reacts count
        newState[message_id].total_reacts[react_code] += 1;
      else
        newState[message_id].total_reacts[react_code] = 1;

      if (newState[message_id].user_reacts[user_id])        // update user_reacts flag
        newState[message_id].user_reacts[user_id][react_code] = true;
      else
        newState[message_id].user_reacts[user_id] = { [react_code]: true }
      return newState;

    case REMOVE_MESSAGE_REACT: // only changes if it is greater than 0
      react_code = action.message_react.react_code;
      user_id = action.message_react.user_id;
      message_id = action.message_react.message_id;
      
      // should never happen, safety
      if (!newState[message_id].total_reacts[react_code] || !newState[message_id].user_reacts[user_id]) return newState;  

      // decrement/delete total_reacts and user_react entries
      newState[message_id].total_reacts[react_code] -= 1;                   
      if (newState[message_id].total_reacts[react_code] <= 0)  
        delete newState[message_id].total_reacts[react_code];            
      delete newState[message_id].user_reacts[user_id][react_code]; 
      return newState;

    case RECEIVE_MESSAGE_SAVE: // receive saved_message data
      message_id = action.message_save.message_id;
      if (action.message_save.message) newState[message_id] = action.message_save.message;
      return newState;

    default:
      return state;
  }
}

export default MessageReducer;