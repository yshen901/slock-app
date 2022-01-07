import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ChannelChat from './channel_chat';
import { deleteMessageReact, getMessages, postMessageReact } from '../../actions/message_actions';
import { startDmChannel } from '../../actions/dm_channel_actions';

const mapStateToProps = (state, ownProps) => ({
  users: state.entities.users,
  messages: state.entities.messages,
  current_user_id: state.session.user_id,
  workspace_id: state.session.workspace_id,
  channel_id: ownProps.match.params.channel_id,
  joinChannels: ownProps.joinChannels,
  status: ownProps.status,
})

const mapDispatchToProps = dispatch => ({
  getMessages: (channel_id) => dispatch(getMessages(channel_id)),
  startDmChannel: (dmChannel) => dispatch(startDmChannel(dmChannel)),
  postMessageReact: (message_react) => dispatch(postMessageReact(message_react)),
  deleteMessageReact: (message_react) => dispatch(deleteMessageReact(message_react)),
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelChat))