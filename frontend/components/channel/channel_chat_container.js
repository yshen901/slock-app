import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ChannelChatRoom from './channel_chat_room';
import { getMessages } from '../../actions/message_actions';
import { startDmChannel } from '../../actions/dm_channel_actions';

const mapStateToProps = (state, ownProps) => ({
  channel_id: ownProps.match.params.channel_id,
  users: state.entities.users,
  joinChannels: ownProps.joinChannels,
  status: ownProps.status,
  current_user_id: state.session.user_id,
  workspace_id: state.session.workspace_id
})

const mapDispatchToProps = dispatch => ({
  getMessages: (channel_id) => dispatch(getMessages(channel_id)),
  startDmChannel: (dmChannel) => dispatch(startDmChannel(dmChannel))
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelChatRoom))