import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { joinChannel, leaveChannel } from '../../actions/channel_actions';
import { endDmChannel, restartDmChannel } from '../../actions/dm_channel_actions';

import Channel from './channel';

const mapStateToProps = (state, ownProps) => ({
  workspace_address: ownProps.match.params.workspace_address,
  channel: state.entities.channels[ownProps.match.params.channel_id],
  channel_id: ownProps.match.params.channel_id,
  messages: state.entities.messages,
  user_id: state.session.user_id
})

const mapDispatchToProps = (dispatch) => ({
  joinChannel: (channelInfo) => dispatch(joinChannel(channelInfo)),
  leaveChannel: (channel_id) => dispatch(leaveChannel(channel_id)),
  restartDmChannel: (dmChannelInfo) => dispatch(restartDmChannel(dmChannelInfo)),
  endDmChannel: (dmChannelInfo) => dispatch(endDmChannel(dmChannelInfo))
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Channel))