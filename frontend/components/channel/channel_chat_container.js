import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ChannelChat from './channel_chat';
import { 
  getMessages, 
  deleteMessageReact, 
  postMessageReact, 
  deleteMessageSave, 
  postMessageSave,
  removeMessageSave,
  receiveMessageSave, 
} from '../../actions/message_actions';
import { startDmChannel } from '../../actions/dm_channel_actions';

const mapStateToProps = (state, ownProps) => ({
  users: state.entities.users,
  messages: state.entities.messages,
  current_user_id: state.session.user_id,
  workspace_id: state.session.workspace_id,
  channel_id: ownProps.match.params.channel_id,
  joinChannels: ownProps.joinChannels,
  status: ownProps.status,
  user_saved_messages: state.session.user_saved_messages
})

const mapDispatchToProps = dispatch => ({
  getMessages: (channel_id) => dispatch(getMessages(channel_id)),
  startDmChannel: (dmChannel) => dispatch(startDmChannel(dmChannel)),
  postMessageReact: (message_react) => dispatch(postMessageReact(message_react)),
  deleteMessageReact: (message_react) => dispatch(deleteMessageReact(message_react)),
  postMessageSave: (message_save) => dispatch(postMessageSave(message_save)),
  deleteMessageSave: (message_save) => dispatch(deleteMessageSave(message_save)),
  receiveMessageSave: (message_save) => dispatch(receiveMessageSave(message_save)),
  removeMessageSave: (message_save) => dispatch(removeMessageSave(message_save)),
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelChat))