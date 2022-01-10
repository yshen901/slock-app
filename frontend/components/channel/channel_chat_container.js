import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ChannelChat from './channel_chat';
import { startDmChannel } from '../../actions/dm_channel_actions';
import { 
  getMessages, 
  receiveMessageReact, 
  receiveMessageSave, 
  removeMessageReact, 
  removeMessageSave
} from '../../actions/message_actions';

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
  receiveMessageSave: (message_save) => dispatch(receiveMessageSave(message_save)), // used to update local state due to other users/windows' actions
  removeMessageSave: (message_save) => dispatch(removeMessageSave(message_save)),
  receiveMessageReact: (message_react) => dispatch(receiveMessageReact(message_react)),
  removeMessageReact: (message_react) => dispatch(removeMessageReact(message_react)),
})

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelChat))