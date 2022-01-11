import React from "react";
import { withRouter } from "react-router";
import { 
  RECEIVE_MESSAGE_REACT,
  REMOVE_MESSAGE_REACT,
  receiveMessageReact,
  removeMessageReact,
  postMessageReact, 
  deleteMessageReact, 
  getMessageSaves, 
  postMessageSave,
  deleteMessageSave,
  receiveMessageSave,
  removeMessageSave,
  REMOVE_MESSAGE_SAVE,
  RECEIVE_MESSAGE_SAVE,
} from "../../../actions/message_actions";
import { getUserName, photoUrl } from "../../../selectors/selectors";
import UserPopupModal from "../../modals/user_popup_modal";

class SavedBrowser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popupUserId: 0,
      popupUserTarget: null
    }

    this.toggleUserPopup = this.toggleUserPopup.bind(this);
    this.calculatePos = this.calculatePos.bind(this);
    this.receiveACData = this.receiveACData.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.goToChannel = this.goToChannel.bind(this);
  }

  // Load user's saved messages and begin listening for changes to reacts or saved
  componentDidMount() {
    dispatch(getMessageSaves(getState().session.workspace_id));
    this.messageACChannel = App.cable.subscriptions.create(
      { channel: "ChatChannel" }, //AC: MUST MATCH THE NAME OF THE CLASS IN CHAT_CHANNEL.RB
      {
        received: this.receiveACData,
        speak: function(data) {
          return this.perform('speak', data);
        }
      }
    );
  }

  // No need to listen for new messages
  receiveACData(data) {
    let { message } = data;
    let { user_saved_messages } = getState().session;
    
    if (message.type != "PUT") 
      this.updateMessage(message);
  }

  // Updates message when other users react to my saved message
  updateMessage(message) {
    let { user_id, user_saved_messages } = getState().session;
    if (message.type == RECEIVE_MESSAGE_REACT && user_id != message.user_id && user_saved_messages[message.id]) {
      message.message_id = message.id;
      dispatch(receiveMessageReact(message));
    }
    else if (message.type == REMOVE_MESSAGE_REACT && user_id != message.user_id && user_saved_messages[message.id]) {
      message.message_id = message.id;
      dispatch(removeMessageReact(message));
    }
    else if (message.type == "DELETE" && user_saved_messages[message.id]) {
      message.message_id = message.id;
      dispatch(removeMessageSave(message));
    }
    else if (message.type == REMOVE_MESSAGE_SAVE && user_saved_messages[message.id]) {
      message.message_id = message.id;
      dispatch(removeMessageSave(message));
    }
    else if (message.type == RECEIVE_MESSAGE_SAVE && !user_saved_messages[message.id]) {
      message.message_id = message.id;
      dispatch(receiveMessageSave(message));
    }
  }

  toggleUserPopup(userId) {
    return (e) => {
      e.stopPropagation();
      this.setState({ popupUserId: userId, popupUserTarget: e.currentTarget });
    };
  }

  renderUserPopup() {
    let { users } = getState().entities;
    let { showUser } = this.props;
    let { popupUserId } = this.state; 

    if (popupUserId)
      return (
        <UserPopupModal 
          user={users[popupUserId]} 
          hidePopup={() => this.setState({popupUserId: 0})}
          showUser={showUser}
          startVideoCall={this.props.startVideoCall}
          calculatePos={this.calculatePos}/>
      )
  }

  calculatePos(hasStatus) {
    let { popupUserTarget } = this.state;

    let minOffset = 520;
    if (hasStatus)
      minOffset = 576;
    
    let viewHeight = $(window).innerHeight();
    let top = popupUserTarget.offsetTop + popupUserTarget.offsetParent.offsetTop - popupUserTarget.offsetParent.offsetParent.scrollTop + 40;
    if (top > viewHeight - minOffset)
      top = viewHeight - minOffset;
    let left = popupUserTarget.offsetLeft + popupUserTarget.offsetWidth + popupUserTarget.offsetParent.offsetLeft + 260 + 10;

    debugger;

    return {
      top,
      left
    };
  }

  goToChannel(channel_id) {
    let workspace_address = this.props.match.params.workspace_address;
    this.props.history.push(`/workspace/${workspace_address}/${channel_id}`);
  }

  toggleMessageReact(messageData, react_code) {
    return (e) => {
      e.preventDefault();
      let { user_id } = getState().session;
      if (messageData.user_reacts && messageData.user_reacts[user_id] && messageData.user_reacts[user_id][react_code])
        dispatch(deleteMessageReact({
          message_id: messageData.id,
          react_code
        })).then(({message_react, type}) => this.messageACChannel.speak({message: { type, message_react }}));
      else
        dispatch(postMessageReact({
          message_id: messageData.id,
          react_code
        })).then(({message_react, type}) => this.messageACChannel.speak({message: { type, message_react }}));
    };
  }

  toggleMessageSave(messageId) {
    return (e) => {
      e.preventDefault();
      let { user_saved_messages, workspace_id } = getState().session;
      if (user_saved_messages[messageId]) {
        dispatch(deleteMessageSave({      // updates channel chat
          message_id: messageId,
        })).then(({message_save, type}) => this.messageACChannel.speak({message: {type, id: message_save.message_id}}))
      }
      else
        dispatch(postMessageSave({        // never called
          message_id: messageId,
          workspace_id: workspace_id
        })).then(({message_save, type}) => this.messageACChannel.speak({message: {type, id: message_save.message_id}}))
    }
  }

  messageEmojiButton(messageData, react_code) {
    return (
      <div className="message-button emoji" 
        onClick={this.toggleMessageReact(messageData, react_code)}>{react_code}</div>
    )
  }

  messageReactsList(messageData) {
    let total_reacts = Object.entries(messageData.total_reacts);
    if (total_reacts.length == 0) return;

    return (
      <div className="message-reacts-list">
        { total_reacts.map(([react_code, num], idx) => (
          <div className="message-react" key={idx} onClick={this.toggleMessageReact(messageData, react_code)}>
            <div className="emoji">{react_code}</div>
            <div className="number">{num}</div>
          </div>
        ))}
      </div>
    )
  }

  renderMessage(messageId) {
    let message = getState().entities.messages[messageId];
    if (!message) return;

    let { created_at, created_date, body, user_id, username, photo_url, id, channel_id} = message;

    let { users } = getState().entities;
    let user = users[user_id];

    let {user_saved_messages} = getState().session;
    let saved = !!user_saved_messages[id];

    let { channels } = getState().entities;
    let channel = channels[channel_id];

    return (
      <div className='message' key={message.id}>
        <div className="message-channel-header" onClick={() => this.goToChannel(channel.id)}>
          {channel.dm_channel ? "Direct Message" : `#${channel.name}`}
        </div>
        <div className="message-content">
          <div className="message-user-icon">
            <img src={user.photo_url} onClick={this.toggleUserPopup(user_id)}/>
          </div>
          <div className="message-text">
            <div className="message-header">
              <div className="message-user" onClick={this.toggleUserPopup(user_id)}>{getUserName(user)}</div>
              {/* <div className="message-time">
                <div className="black-popup">
                  {created_date} at {created_at}
                </div>
                {created_at}
              </div> */}
            </div>
            <div className="message-body" dangerouslySetInnerHTML={{__html: body}}></div>
          </div>
          <div className="message-buttons">
            { this.messageEmojiButton(message, '\u{1F4AF}') } 
            { this.messageEmojiButton(message, '\u{1F44D}') }
            { this.messageEmojiButton(message, '\u{1F642}') }
            { this.messageEmojiButton(message, '\u{1F602}') }
            { this.messageEmojiButton(message, '\u{1F60D}') }
            { this.messageEmojiButton(message, '\u{1F622}') }
            { this.messageEmojiButton(message, '\u{1F620}') }
            <div className="message-button" onClick={this.toggleMessageSave(message.id)}>
              <i className={saved ? "fas fa-bookmark fa-fw magenta" : "far fa-bookmark fa-fw"}></i>
            </div>
            {/* {this.messageDeleteButton(message)} */}
          </div>
        </div>
        { this.messageReactsList(message) }
      </div>
    )
  }

  render() {
    let user_saved_messages = Object.values(getState().session.user_saved_messages);
    user_saved_messages.sort((a, b) => a.message_save_id > b.message_save_id ? -1 : 1);

    return (
      <div className="browser-channel" onClick={e => e.stopPropagation()}>
        <div className="browser-channel-top no-search">
          <div className="browser-channel-nav">
            <h1 className="browser-channel-title">People</h1>
          </div>
        </div>
        <div className="message-list browser">
          { user_saved_messages.map(({id}) => this.renderMessage(id)) }
        </div>
        { this.renderUserPopup() }
      </div>
    )
  }
}

export default withRouter(SavedBrowser);