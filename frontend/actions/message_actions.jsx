import * as MessageAPI from '../util/message_api_util';
import { receiveErrors } from './error_actions'

export const LOAD_MESSAGES = "LOAD_MESSAGES";

const loadMessages = (messages) => ({
  type: LOAD_MESSAGES,
  messages
})

export const getMessages = channel_id => dispatch => (
  MessageAPI
    .getMessages(channel_id)
    .then(
      (messages) => dispatch(loadMessages(messages)),
      (errors) => dispatch(receiveErrors(errors))
    )
)