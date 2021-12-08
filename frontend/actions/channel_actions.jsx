import * as ChannelAPI from '../util/channel_api_util';
import * as ChannelUserAPI from '../util/channel_user_api_util';
import * as DmChannelUserAPI from "../util/dm_channel_user_util";
import { receiveErrors } from './error_actions';

export const LOAD_CHANNEL = "LOAD_CHANNEL";
export const RECEIVE_CHANNEL = "RECEIVE_CHANNEL";
export const JOIN_CHANNEL = "JOIN_CHANNEL";
export const LEAVE_CHANNEL = "LEAVE_CHANNEL";

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

export const postChannel = (channel) => (dispatch) => (
  ChannelAPI
    .postChannel(channel)
    .then(
      (channel) => dispatch(receiveChannel(channel)),
      (errors) => dispatch(receiveErrors(errors))
    )
)

export const joinChannel = (channel_id) => (dispatch) => (
  ChannelUserAPI
    .postChannelUser(channel_id)
    .then(
      channel_user => dispatch(loginChannel(channel_user)),
      errors => dispatch(receiveErrors(errors))
    )
)

export const leaveChannel = (channel_id) => (dispatch) => (
  ChannelUserAPI
    .deleteChannelUser(channel_id)
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

export const startDmChannel = (channelInfo) => dispatch => (
  DmChannelUserAPI
    .startDmChannel(channelInfo)
    .then(
      channel => dispatch(loginChannel(channel)),
      errors => dispatch(receiveErrors(errors))
    )
)

export const leaveDmChannel = (channelInfo) => dispatch => (
  DmChannelUserAPI
    .leaveDmChannel(channelInfo)
    .then(
      channel => dispatch(logoutChannel(channel)),
      errors => dispatch(receiveErrors(errors))
    )
)