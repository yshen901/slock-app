import * as DmChannelUserAPI from "../util/dm_channel_user_util";
import { receiveErrors } from "./error_actions";

export const RECEIVE_DM_CHANNEL = "RECEIVE_DM_CHANNEL";
export const LEAVE_DM_CHANNEL = "LEAVE_DM_CHANNEL";

const joinDmChannel = (dmChannelUser) => ({
  type: RECEIVE_DM_CHANNEL,
  dmChannelUser
});

const leaveDmChannel = (dmChannelUser) => ({
  type: LEAVE_DM_CHANNEL,
  dmChannelUser
});

const receiveDmChannel = (dmChannelUser) => ({
  type: RECEIVE_DM_CHANNEL,
  dmChannelUser
})

export const startDmChannel = (channelInfo) => dispatch => (
  DmChannelUserAPI
    .startDmChannel(channelInfo)
    .then(
      dmChannelUser => dispatch(joinDmChannel(dmChannelUser)),
      errors => dispatch(receiveErrors(errors))
    )
);

export const endDmChannel = (channelInfo) => dispatch => (
  DmChannelUserAPI
    .endDmChannel(channelInfo)
    .then(
      dmChannelUser => dispatch(leaveDmChannel(dmChannelUser)),
      errors => dispatch(receiveErrors(errors))
    )
);

// Join dmChannel that has already been created
export const restartDmChannel = (channelInfo) => dispatch => (
  DmChannelUserAPI
    .endDmChannel(channelInfo)
    .then(
      dmChannelUser => dispatch(joinDmChannel(dmChannelUser)),
      errors => dispatch(receiveErrors(errors))
    )
);

// Update dmChannel's starred status
export const updateDmChannel = (channelInfo) => dispatch => (
  DmChannelUserAPI
    .updateDmChannel(channelInfo)
    .then(
      dmChannelUser => dispatch(receiveDmChannel(dmChannelUser)),
      errors => dispatch(receiveErrors(errors))
    )
);