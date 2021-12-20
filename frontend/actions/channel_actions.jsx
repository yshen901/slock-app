import * as ChannelAPI from '../util/channel_api_util';
import * as ChannelUserAPI from '../util/channel_user_api_util';
import { receiveErrors } from './error_actions';

export const LOAD_CHANNEL = "LOAD_CHANNEL";
export const RECEIVE_CHANNEL = "RECEIVE_CHANNEL";
export const JOIN_CHANNEL = "JOIN_CHANNEL";
export const LEAVE_CHANNEL = "LEAVE_CHANNEL";
export const RECEIVE_CHANNEL_USER = "RECEIVE_CHANNEL_USER";

// DESIGN: SIMPLY CHANGES SESSION.CHANNEL_ID
export const loadChannel = (channel_id) => ({
  type: LOAD_CHANNEL,
  channel_id
})

const receiveChannel = (channel) => ({
  type: RECEIVE_CHANNEL,
  channel
})

const loginChannel = (channel_user) => ({
  type: JOIN_CHANNEL,
  channel_user
})

const logoutChannel = (channel_user) => ({
  type: LEAVE_CHANNEL,
  channel_user
})

const receiveChannelUser = (channel_user) => ({
  type: RECEIVE_CHANNEL_USER,
  channel_user
})

export const postChannel = (channel) => (dispatch) => (
  ChannelAPI
    .postChannel(channel)
    .then(
      (channel) => dispatch(receiveChannel(channel)),
      (errors) => dispatch(receiveErrors(errors))
    )
)

// passes up channel_id and workspace_id
export const joinChannel = (data) => (dispatch) => (
  ChannelUserAPI
    .postChannelUser(data)
    .then(
      channel_user => dispatch(loginChannel(channel_user)),
      errors => dispatch(receiveErrors(errors))
    )
)

// Instead of deleting channel_user, make active false
export const leaveChannel = (channel_id) => (dispatch) => (
  ChannelUserAPI
    .updateChannelUser({
      channel_id,
      active: false
    })
    .then(
      channel_user => dispatch(logoutChannel(channel_user)),
      errors => dispatch(receiveErrors(errors))
    )
)

export const updateChannel = (channel) => (dispatch) => (
  ChannelAPI
    .updateChannel(channel)
    .then(
      channel => dispatch(receiveChannel(channel)),
      errors => dispatch(receiveErrors(errors))
    )
)

export const updateChannelUser = (channel_user) => (dispatch) => (
  ChannelUserAPI
    .updateChannelUser(channel_user)
    .then(
      channel_user => dispatch(receiveChannelUser(channel_user)),
      errors => dispatch(receiveErrors(errors))
    )
)