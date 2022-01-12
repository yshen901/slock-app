import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { joinChannel, leaveChannel } from '../../../actions/channel_actions';
import ChannelBrowser from "./channel_browser";

const mapStateToProps = (state, ownProps) => ({
  user_id: state.session.user_id,
  workspace_id: state.session.workspace_id,
  channels: state.entities.channels
});

const mapDispatchToProps = (dispatch) => ({
  leaveChannel: (channelId) => dispatch(leaveChannel(channelId)),
  joinChannel: (channelId) => dispatch(joinChannel(channelId)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ChannelBrowser)
);