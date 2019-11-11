import * as ChannelAPI from '../util/channel_api_util';
import { receiveErrors } from './error_actions';

export const RECEIVE_CHANNEL = "RECEIVE_CHANNEL";
export const RECEIVE_CHANNELS = "RECEIVE_CHANNELS";

const receiveChannel = (channel) => ({
  type: RECEIVE_CHANNEL,
  channel
})

const receiveChannels = (channels) => ({
  type: RECEIVE_CHANNELS,
  channels
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
      channels => dispatch(receiveChannels(channels)),
      errors => dispatch(receiveErrors(errors))
    )
)