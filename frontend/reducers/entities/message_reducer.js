import { cloneDeep } from 'lodash';
import { LOAD_MESSAGES, RECEIVE_MESSAGE_REACT, RECEIVE_MESSAGE_SAVE, RECEIVE_MESSAGE_SAVES, REMOVE_MESSAGE_REACT, REMOVE_MESSAGE_SAVE } from '../../actions/message_actions';

const MessageReducer = (state = {}, action) => {
  Object.freeze(state);
  let newState = cloneDeep(state);
  let react_code, user_id, message_id;

  switch(action.type) {
    case RECEIVE_MESSAGE_SAVES: 
    case LOAD_MESSAGES:
      return action.messages;
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
      newState[message_id] = action.message_save.message;
      return newState;

    default:
      return state;
  }
}

export default MessageReducer;