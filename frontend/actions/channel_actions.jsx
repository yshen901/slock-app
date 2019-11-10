import * as ChannelAPI from '../util/channel_api_util';
import { receiveErrors } from './error_actions';

export const RECEIVE_CHANNEL = "RECEIVE_CHANNEL";

const receiveChannel = (channel) => ({
  type: RECEIVE_CHANNEL,
  channel
})

export const postChannel = (channel) => (dispatch) => (
  ChannelAPI
    .postChannel(channel)
    .then(
      (channel) => dispatch(receiveChannel(channel)),
      (errors) => dispatch(receiveErrors(errors))
    )
)