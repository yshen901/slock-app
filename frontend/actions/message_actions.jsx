import * as MessageAPI from '../util/message_api_util';
import * as MessageReactAPI from '../util/message_react_api_util';
import * as MessageSaveAPI from '../util/message_save_api_util';
import { receiveErrors } from './error_actions'

export const LOAD_MESSAGES = "LOAD_MESSAGES";
export const RECEIVE_MESSAGE = "RECEIVE_MESSAGE";
export const RECEIVE_MESSAGE_REACT = "RECEIVE_MESSAGE_REACT";
export const REMOVE_MESSAGE_REACT = "REMOVE_MESSAGE_REACT";
export const RECEIVE_MESSAGE_SAVES = "RECEIVE_MESSAGE_SAVES";
export const RECEIVE_MESSAGE_SAVE = "RECEIVE_MESSAGE_SAVE";
export const REMOVE_MESSAGE_SAVE = "REMOVE_MESSAGE_SAVE";

const loadMessages = (messages) => ({
  type: LOAD_MESSAGES,
  messages
});

export const receiveMessage = (message) => ({
  type: RECEIVE_MESSAGE,
  message
});

export const getMessages = channel_id => dispatch => (
  MessageAPI
    .getMessages(channel_id)
    .then(
      (messages) => dispatch(loadMessages(messages)),
      (errors) => dispatch(receiveErrors(errors))
    )
);

export const updateMessage = (message) => dispatch => (
  MessageAPI
    .updateMessage(message)
    .then(
      (message) => dispatch(receiveMessage(message)),
      (errors) => dispatch(receiveErrors(errors))
    )
);

// REACT ACTIONS
export const receiveMessageReact = (message_react) => ({
  type: RECEIVE_MESSAGE_REACT,
  message_react
});

export const removeMessageReact = (message_react) => ({
  type: REMOVE_MESSAGE_REACT,
  message_react
});

export const postMessageReact = message_react => dispatch => (
  MessageReactAPI
    .postMessageReact(message_react)
    .then(
      (message_react) => dispatch(receiveMessageReact(message_react)),
      (errors) => dispatch(receiveErrors(errors))
    )
);

export const deleteMessageReact = message_react => dispatch => (
  MessageReactAPI
    .deleteMessageReact(message_react)
    .then(
      (message_react) => dispatch(removeMessageReact(message_react)),
      (errors) => dispatch(receiveErrors(errors))
    )
);


// SAVE ACTIONS
const receiveMessageSaves = ({message_saves, messages}) => ({
  type: RECEIVE_MESSAGE_SAVES,
  message_saves,
  messages
});

export const receiveMessageSave = (message_save) => {
  message_save.message_save_id = message_save.id;
  return {
    type: RECEIVE_MESSAGE_SAVE,
    message_save
  };
};

export const removeMessageSave = (message_save) => {
  message_save.message_save_id = message_save.id;
  return {
    type: REMOVE_MESSAGE_SAVE,
    message_save
  };
};

export const getMessageSaves = workspace_id => dispatch => (
  MessageSaveAPI
    .getMessageSaves(workspace_id)
    .then(
      (message_saves_data) => dispatch(receiveMessageSaves(message_saves_data)),
      (errors) => dispatch(receiveErrors(errors))
    )
);

export const postMessageSave = message_save => dispatch => (
  MessageSaveAPI
    .postMessageSave(message_save)
    .then(
      (message_save) => dispatch(receiveMessageSave(message_save)),
      (errors) => dispatch(receiveErrors(errors))
    )
);

export const deleteMessageSave = message_save => dispatch => (
  MessageSaveAPI
    .deleteMessageSave(message_save)
    .then(
      (message_save) => dispatch(removeMessageSave(message_save)),
      (errors) => dispatch(receiveErrors(errors))
    )
);