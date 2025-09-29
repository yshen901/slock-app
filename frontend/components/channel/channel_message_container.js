import { connect } from 'react-redux'
import { 
  deleteMessage,
  deleteMessageReact,
  deleteMessageSave,
  postMessageReact, 
  postMessageSave,
  updateMessage
} from '../../actions/message_actions';
import ChannelMessage from './channel_message'

const mapStateToProps = (state, ownProps) => ({
  current_user_id: state.session.user_id,
  workspace_id: state.session.workspace_id,
  user_saved_messages: state.session.user_saved_messages,
  messages: state.entities.messages,
  message: state.entities.messages[ownProps.messageData.id],
  users: state.entities.users,
  channels: state.entities.channels // used for message banner in SavedBrowser
});

const mapDispatchToProps = dispatch => ({
  updateMessage: (message) => dispatch(updateMessage(message)),
  deleteMessage: (message) => dispatch(deleteMessage(message)),
  postMessageReact: (message_react) => dispatch(postMessageReact(message_react)),
  deleteMessageReact: (message_react) => dispatch(deleteMessageReact(message_react)),
  postMessageSave: (message_save) => dispatch(postMessageSave(message_save)),
  deleteMessageSave: (message_save) => dispatch(deleteMessageSave(message_save)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelMessage);