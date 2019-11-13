import * as ChannelAPI from '../util/channel_api_util';
import * as ChannelUserAPI from '../util/channel_user_api_util';
import { receiveErrors } from './error_actions';
import { arrayToObject } from '../selectors/selectors';

export const LOAD_CHANNEL = "LOAD_CHANNEL";
export const RECEIVE_CHANNEL = "RECEIVE_CHANNEL";
export const RECEIVE_CHANNELS = "RECEIVE_CHANNELS";
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

const receiveChannels = ({channels}) => {
  // converts an array {id: user_id} objects to an array of user_ids
  for (let i = 0; i < channels.length; i++) 
    channels[i].users = Object.keys(arrayToObject(channels[i].users))
                              .map((id) => parseInt(id));

  return {
    type: RECEIVE_CHANNELS,
    channels
  }
}

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

export const getChannels = (workspace_id) => (dispatch) => (
  ChannelAPI
    .getChannels(workspace_id)
    .then(
      channelsInfo => dispatch(receiveChannels(channelsInfo)),
      errors => dispatch(receiveErrors(errors))
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