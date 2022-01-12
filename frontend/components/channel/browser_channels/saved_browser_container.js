import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SavedBrowser from "./saved_browser";
import {
  receiveMessageReact,
  removeMessageReact,
  postMessageReact, 
  deleteMessageReact, 
  getMessageSaves, 
  postMessageSave,
  deleteMessageSave,
  receiveMessageSave,
  removeMessageSave,
} from "../../../actions/message_actions";

const mapStateToProps = (state, ownProps) => ({
  users: state.entities.users,
  messages: state.entities.messages,
  user_id: state.session.user_id,
  user_saved_messages: state.session.user_saved_messages,
  workspace_id: state.session.workspace_id
});

const mapDispatchToProps = (dispatch) => ({
  getMessageSaves: (workspace_id) => dispatch(getMessageSaves(workspace_id)),

  receiveMessageReact: (message) => dispatch(receiveMessageReact(message)),
  removeMessageReact: (message) => dispatch(removeMessageReact(message)),
  postMessageReact: (message_react) => dispatch(postMessageReact(message_react)),
  deleteMessageReact: (message_react) => dispatch(deleteMessageReact(message_react)),
  
  receiveMessageSave: (message) => dispatch(receiveMessageSave(message)),
  removeMessageSave: (message) => dispatch(removeMessageSave(message)),
  postMessageSave: (message_save) => dispatch(postMessageSave(message_save)),
  deleteMessageSave: (message_save) => dispatch(deleteMessageSave(message_save)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SavedBrowser)
);