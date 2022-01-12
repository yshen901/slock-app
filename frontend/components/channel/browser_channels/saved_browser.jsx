import React from "react";
import { withRouter } from "react-router";
import { 
  RECEIVE_MESSAGE_REACT,
  REMOVE_MESSAGE_REACT,
  REMOVE_MESSAGE_SAVE,
  RECEIVE_MESSAGE_SAVE,
} from "../../../actions/message_actions";
import UserPopupModal from "../../modals/user_popup_modal";
import ChannelMessageContainer from "../channel_message_container";

class SavedBrowser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popupUserId: 0,
      popupUserTarget: null, 
      loaded: false
    }

    this.toggleUserPopup = this.toggleUserPopup.bind(this);
    this.calculatePos = this.calculatePos.bind(this);
    this.receiveACData = this.receiveACData.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.goToChannel = this.goToChannel.bind(this);
  }

  // Load user's saved messages and begin listening for changes to reacts or saved
  componentDidMount() {
    this.props.getMessageSaves(this.props.workspace_id)
      .then(() => this.setState({ loaded: true }));
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
    
    if (message.type != "PUT") 
      this.updateMessage(message);
  }

  // Updates message when other users react to my saved message
  updateMessage(message) {
    let { user_id, user_saved_messages } = this.props;
    if (message.type == RECEIVE_MESSAGE_REACT && user_id != message.user_id && user_saved_messages[message.id]) {
      message.message_id = message.id;
      this.props.receiveMessageReact(message);
    }
    else if (message.type == REMOVE_MESSAGE_REACT && user_id != message.user_id && user_saved_messages[message.id]) {
      message.message_id = message.id;
      this.props.removeMessageReact(message);
    }
    else if (message.type == "DELETE" && user_saved_messages[message.id]) {
      message.message_id = message.id;
      this.props.removeMessageSave(message);
    }
    else if (message.type == REMOVE_MESSAGE_SAVE && user_saved_messages[message.id]) {
      message.message_id = message.id;
      this.props.removeMessageSave(message);
    }
    else if (message.type == RECEIVE_MESSAGE_SAVE && !user_saved_messages[message.id]) {
      message.message_id = message.id;
      this.props.receiveMessageSave(message);
    }
  }

  toggleUserPopup(userId) {
    return (e) => {
      e.stopPropagation();
      this.setState({ popupUserId: userId, popupUserTarget: e.currentTarget });
    };
  }

  renderUserPopup() {
    let { users } = this.props;
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
      let { user_id } = this.props;
      if (messageData.user_reacts && messageData.user_reacts[user_id] && messageData.user_reacts[user_id][react_code])
        this.props.deleteMessageReact({
          message_id: messageData.id,
          react_code
        }).then(({message_react, type}) => this.messageACChannel.speak({message: { type, message_react }}));
      else
        this.props.postMessageReact({
          message_id: messageData.id,
          react_code
        }).then(({message_react, type}) => this.messageACChannel.speak({message: { type, message_react }}));
    };
  }

  toggleMessageSave(messageId) {
    return (e) => {
      e.preventDefault();
      let { user_saved_messages, workspace_id } = this.props;
      if (user_saved_messages[messageId]) {
        this.props.deleteMessageSave({      // updates channel chat
          message_id: messageId,
        }).then(({message_save, type}) => this.messageACChannel.speak({message: {type, id: message_save.message_id}}))
      }
      else
        this.props.postMessageSave({        // never called
          message_id: messageId,
          workspace_id: workspace_id
        }).then(({message_save, type}) => this.messageACChannel.speak({message: {type, id: message_save.message_id}}))
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

  renderMessage(id) {
    return (
      <ChannelMessageContainer
          status={{canJoin: false}}  // decides whether you can interact with messages
          grouped={false}
          messageData={this.props.messages[id]}
          messageACChannel={this.messageACChannel}
          toggleUserPopup={this.toggleUserPopup}
          key={id}/>
    )
  }

  render() {
    let user_saved_messages = Object.values(this.props.user_saved_messages);
    user_saved_messages.sort((a, b) => a.message_save_id > b.message_save_id ? -1 : 1);

    if (this.state.loaded)
      return (
        <div className="browser-channel" onClick={e => e.stopPropagation()}>
          <div className="browser-channel-top no-search">
            <div className="browser-channel-nav">
              <h1 className="browser-channel-title">Saved items</h1>
            </div>
          </div>
          <div className="message-list browser">
            { user_saved_messages.map(({id}) => this.renderMessage(id)) }
          </div>
          { this.renderUserPopup() }
        </div>
      )
    else 
      return (
        <div className="browser-channel" onClick={e => e.stopPropagation()}>
          <div className="browser-channel-top no-search">
            <div className="browser-channel-nav">
              <h1 className="browser-channel-title">Saved items</h1>
            </div>
          </div>
          <div className="message-list browser">
          </div>
        </div>
      )
  }
}

export default withRouter(SavedBrowser);