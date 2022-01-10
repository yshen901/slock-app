import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { 
  deleteMessageReact,
  deleteMessageSave,
  postMessageReact, 
  postMessageSave,
} from '../../actions/message_actions';
import ChannelMessage from './channel_message'

const mapStateToProps = (state, ownProps) => ({
  current_user_id: state.session.user_id,
  messages: state.entities.messages,
  user_saved_messages: state.session.user_saved_messages,
  workspace_id: state.session.workspace_id,
  message: state.entities.messages[ownProps.messageData.id],
});

const mapDispatchToProps = dispatch => ({
  postMessageReact: (message_react) => dispatch(postMessageReact(message_react)),
  deleteMessageReact: (message_react) => dispatch(deleteMessageReact(message_react)),
  postMessageSave: (message_save) => dispatch(postMessageSave(message_save)),
  deleteMessageSave: (message_save) => dispatch(deleteMessageSave(message_save)),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelMessage));