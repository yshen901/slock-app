import * as DmChannelUserAPI from "../util/dm_channel_user_util";

export const JOIN_DM_CHANNEL = "JOIN_DM_CHANNEL";
export const LEAVE_DM_CHANNEL = "LEAVE_DM_CHANNEL";

const joinDmChannel = (dmChannelUser) => ({
  type: JOIN_DM_CHANNEL,
  dmChannelUser
});

const leaveDmChannel = (dmChannelUser) => ({
  type: LEAVE_DM_CHANNEL,
  dmChannelUser
});

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