import * as ChannelAPI from '../util/channel_api_util';
import { receiveErrors } from './error_actions';
import { arrayToObject } from '../selectors/selectors';

export const LOAD_CHANNEL = "LOAD_CHANNEL";
export const RECEIVE_CHANNEL = "RECEIVE_CHANNEL";
export const RECEIVE_CHANNELS = "RECEIVE_CHANNELS";

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