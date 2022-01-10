import React from 'react';
import { withRouter } from 'react-router-dom';
import { photoUrl } from '../../selectors/selectors';

import ChannelMessageForm from './channel_message_form';
import UserPopupModal from "../modals/user_popup_modal.jsx";
import { RECEIVE_MESSAGE_REACT, RECEIVE_MESSAGE_SAVE, REMOVE_MESSAGE_REACT, REMOVE_MESSAGE_SAVE } from '../../actions/message_actions';

class ChannelChat extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      messagesList: [],
      messagesData: [],
      currentDate: (new Date(Date())).toLocaleDateString(),
      popupUserId: 0,
      popupUserTarget: null
    };

    this.bottom = React.createRef();
    this.scrollBar = React.createRef();

    this.loadMessages = this.loadMessages.bind(this);
    this.receiveACData = this.receiveACData.bind(this);
    this.toggleUserPopup = this.toggleUserPopup.bind(this);
    this.toggleMessageReact = this.toggleMessageReact.bind(this);
    this.toggleMessageSave = this.toggleMessageSave.bind(this);
    this.calculatePos = this.calculatePos.bind(this);
  }

  componentDidMount() {
    this.messageACChannel = App.cable.subscriptions.create(
      { channel: "ChatChannel" }, //AC: MUST MATCH THE NAME OF THE CLASS IN CHAT_CHANNEL.RB
      {
        received: this.receiveACData,
        speak: function(data) {
          return this.perform('speak', data);
        }
      }
    );
    this.loadMessages();
  }

  // NOTE: CURRENT REFERS TO THE LAST ELEMENT WITH PROPERTY ref={this.bottom}
  // Only trigger for non-transitional channels (channel_id != 0)
  componentDidUpdate(oldProps, oldState) {
    let {channel_id} = this.props.match.params;
    if (channel_id != "0" && channel_id !== oldProps.match.params.channel_id) {
      this.loadMessages();
    }

    let { messagesData, messagesList } = this.state;
    let { current_user_id} = this.props;
    if (oldState.messagesData.length == 0) { // initial load
      if (this.bottom.current) this.bottom.current.scrollIntoView();
    } 
    else if (oldState.messagesData.length < messagesData.length) {
      if (messagesData[messagesData.length - 1].user_id == current_user_id) { // user creates new message
        if (this.bottom.current) this.bottom.current.scrollIntoView();
      }
      else {
        let { offsetHeight, scrollTop, scrollHeight } = this.scrollBar.current; 
        let distanceFromBottom = scrollHeight - offsetHeight - scrollTop;
        if (distanceFromBottom != messagesList[messagesList.length - 1].offsetHeight) {
          if (this.bottom.current) this.bottom.current.scrollIntoView();
        }
      }
    }
    else {
      let { offsetHeight, scrollTop, scrollHeight } = this.scrollBar.current; 
        let distanceFromBottom = scrollHeight - offsetHeight - scrollTop;
        if (distanceFromBottom == 30 || distanceFromBottom == 21) {     // from react/save elements pushing things down
          if (this.bottom.current) this.bottom.current.scrollIntoView();
        }
    }
  }

  componentWillUnmount() {
    if (this.messageACChannel) this.messageACChannel.unsubscribe();
  }

  profileName(user) {
    if (user.display_name != "")
      return user.display_name;
    else if (user.full_name != "")
      return user.full_name;
    else
      return user.email.split("@")[0];
  }

  // TODO1: CHANGE TIME, AND MAYBE SAVE DATE_NOW SOMEWHERE ELSE INSTEAD OF CONSTANTLY RECREATING IT
  getMessageTimestamp(message, seconds=false) {
    let message_time = new Date(message.created_at);
    if (message_time == "Invalid Date") 
      message_time = message.created_at;

    return this.processTime(message_time.toLocaleTimeString(), seconds);
  }

  processTime(timeString, seconds) {
    let len = timeString.length;
    let status = timeString.slice(len - 2);
    let timeData = timeString.split(" ")[0].split(":");

    let timeDiff = status == "PM" ? 12 : 0;
    
    if (seconds)
      return `${parseInt(timeData[0]) + timeDiff}:${timeData[1]}:${timeData[2]}`
    return `${parseInt(timeData[0]) + timeDiff}:${timeData[1]}`
  }

  getMessageDate(message) {
    let { currentDate } = this.state;
    let messageDate = new Date(message.created_at);
    messageDate = messageDate.toLocaleDateString();

    if (messageDate == "Invalid Date")
      return currentDate;
    return messageDate;
  }

  groupMessages(message, prevMessage) {
    if (message.created_date != prevMessage.created_date) return false;
    
    if (message.user_id == prevMessage.user_id)
      if (message.created_at.slice(0, 2) == prevMessage.created_at.slice(0, 2))
        return true;
    return false;
  }

  messageDeleteButton(messageData) {
    if (messageData.user_id == this.props.current_user_id) 
      return (
        <div className="message-button"
          onClick={() => this.messageACChannel.speak({message: {type: "DELETE", id: messageData.id}})}>
          <i className="far fa-trash-alt fa-fw"></i>
        </div>
      );
  }

  toggleMessageReact(messageData, react_code) {
    return (e) => {
      e.preventDefault();
      let { current_user_id } = this.props;
      if (messageData.user_reacts && messageData.user_reacts[current_user_id] && messageData.user_reacts[current_user_id][react_code])
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
      if (e) e.preventDefault();

      let {messages} = this.props;
      if (this.props.user_saved_messages[messageId])
        this.props.deleteMessageSave({
          message_id: messageId,
        }).then(({message_save, type}) => this.messageACChannel.speak({message: { type, id: message_save.message_id }}))
      else
        this.props.postMessageSave({
          message_id: messageId,
          workspace_id: this.props.workspace_id
        }).then(({message_save, type}) => {
          this.messageACChannel.speak({
            message: { 
              type, 
              id: message_save.message_id, 
              message_save_id: message_save.id, 
              message: messages[message_save.message_id] 
            }})
        })
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
  
  messageSavedBanner(saved) {
    if (saved)
      return (
        <div className="saved-banner">
          <i className="fas fa-bookmark fa-fw magenta"></i>
          <div>Added to your saved items</div>
        </div>
      )
  }

  processNewMessage(messagesData, messagesList, i) {
    i = i != null ? i : messagesData.length - 1;
    let { created_at, created_date, body, user_id, username, photo_url } = messagesData[i];
    let saved = !!this.props.user_saved_messages[messagesData[i].id];

    if (i == 0 || created_date !== messagesData[i-1].created_date) {
      let date = created_date;
      if (date == this.state.currentDate)
        date = "Today";
      messagesList.push(
        <div className="day-divider no-highlight">
          <div className="day-divider-line"></div>
          <div className="day-divider-date">{date}</div>
        </div>
      )        
    }

    

    return 
    if (i != 0 && this.groupMessages(messagesData[i], messagesData[i-1]))
      messagesList.push(
        <div className={saved ? "message saved" : "message"}>
          { this.messageSavedBanner(saved) }
          <div className="message-content">
            <div className="message-time-tag">
              <div className="black-popup">
                {created_date}
              </div>
              {created_at}
            </div>
            <div className="message-text">
              <div className="message-body" dangerouslySetInnerHTML={{__html: body}}></div>
            </div>
            <div className="message-buttons">
              { this.messageEmojiButton(messagesData[i], '\u{1F4AF}') } 
              { this.messageEmojiButton(messagesData[i], '\u{1F44D}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F642}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F602}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F60D}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F622}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F620}') }
              <div className="message-button" onClick={this.toggleMessageSave(messagesData[i].id)}>
                <i className={saved ? "fas fa-bookmark fa-fw magenta" : "far fa-bookmark fa-fw"}></i>
              </div>
              {this.messageDeleteButton(messagesData[i])}
            </div>
          </div>
          { this.messageReactsList(messagesData[i]) }
        </div>
      )
    else
      messagesList.push(
        <div className={saved ? "message saved" : "message"}>
          { this.messageSavedBanner(saved) }
          <div className="message-content">
            <div className="message-user-icon">
              <img src={photo_url} onClick={this.toggleUserPopup(user_id)}/>
            </div>
            <div className="message-text">
              <div className="message-header">
                <div className="message-user" onClick={this.toggleUserPopup(user_id)}>{username}</div>
                <div className="message-time">
                  <div className="black-popup">
                    {created_date} at {created_at}
                  </div>
                  {created_at}
                </div>
              </div>
              <div className="message-body" dangerouslySetInnerHTML={{__html: body}}></div>
            </div>
            <div className="message-buttons">
              { this.messageEmojiButton(messagesData[i], '\u{1F4AF}') } 
              { this.messageEmojiButton(messagesData[i], '\u{1F44D}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F642}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F602}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F60D}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F622}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F620}') }
              <div className="message-button" onClick={this.toggleMessageSave(messagesData[i].id)}>
                <i className={saved ? "fas fa-bookmark fa-fw magenta" : "far fa-bookmark fa-fw"}></i>
              </div>
              {this.messageDeleteButton(messagesData[i])}
            </div>
          </div>
          { this.messageReactsList(messagesData[i]) }
        </div>
      );
  }

  loadMessages() {
    let { getMessages, channel_id, users } = this.props;
    getMessages(channel_id)
      .then(
        ({ messages }) => {
          // update message data
          let messagesData = Object.values(messages).map((message) => {
            message.photo_url = photoUrl(users[message.user_id]);
            message.created_date = this.getMessageDate(message);
            message.created_at = this.getMessageTimestamp(message);
            message.username = this.profileName(users[message.user_id]);
            return message;
          });

          // popualate messagesList
          let messagesList = [];
          for (let i = 0; i < messagesData.length; i++)
            this.processNewMessage(messagesData, messagesList, i);

          this.setState({ messagesList, messagesData })
        }
      )
  }

  // Updates the relevant message and if necessary repopulates messagesList to redo time groupings
  updateMessage(messageData) {
    let { messagesData, messagesList } = this.state;
    for (let i = 0; i < messagesData.length; i++) {
      if (messagesData[i].id == messageData.id) {
        if (messageData.type == "DELETE") {
          messagesData.splice(i, 1);
        }
        else if (messageData.type == RECEIVE_MESSAGE_REACT) {
          let { user_id, react_code } = messageData;
          messagesData[i].total_reacts[react_code] ||= 0; // lazily initialize if non-existant
          messagesData[i].user_reacts[user_id] ||= {};

          messagesData[i].total_reacts[react_code] += 1;  // increment/toggle values
          messagesData[i].user_reacts[user_id][react_code] = true;
        }
        else if (messageData.type == REMOVE_MESSAGE_REACT) {
          let { user_id, react_code } = messageData;
          messagesData[i].total_reacts[react_code] -= 1;
          if (messagesData[i].total_reacts[react_code] <= 0)  // decrement and delete entries if necessary
            delete messagesData[i].total_reacts[react_code];
          delete messagesData[i].user_reacts[user_id][react_code];
        }                                                                    // called when user activates in another window
        else if (messageData.type == RECEIVE_MESSAGE_SAVE && !this.props.user_saved_messages[messageData.id]) {
          this.props.receiveMessageSave({
              message_id: messageData.id,
          })
        }
        else if (messageData.type == REMOVE_MESSAGE_SAVE && this.props.user_saved_messages[messageData.id]) {
          this.props.removeMessageSave({
              message_id: messageData.id
          });
        }
        break;
      }
    }
    messagesList = [];
    for (let i = 0; i < messagesData.length; i++)
        this.processNewMessage(messagesData, messagesList, i);
    this.setState({ messagesList, messagesData })
  }

  receiveACData(data) {
    let { message } = data;     //extract the data
    // For message updates and deletions
    if (message.type != "PUT") { 
      this.updateMessage(message);
    }
    else {
      let { user_id, channel_id, activate_dm_channel } = message;
  
      // loads the message if its to the current channel
      if (channel_id == this.props.channel_id) {
        message.username = this.profileName(this.props.users[user_id]);
        message.photo_url = photoUrl(this.props.users[user_id]);
        message.created_date = this.getMessageDate(message);
        message.created_at = this.processTime(message.created_at);
  
        let messagesData = this.state.messagesData.concat(message);
        let messagesList = this.state.messagesList;
        this.processNewMessage(messagesData, messagesList);
  
        this.setState({
          messagesData,
          messagesList
        });
      }
      else {
        // joins the dm channel if not already in it
        if (activate_dm_channel) {
          this.props.startDmChannel({
            user_1_id: this.props.current_user_id,
            user_2_id: user_id,
            workspace_id: this.props.workspace_id
          })
        }
      }
    }
  }

  toggleUserPopup(userId) {
    return (e) => {
      e.stopPropagation();
      this.setState({ popupUserId: userId, popupUserTarget: e.currentTarget });
    };
  }

  renderUserPopup() {
    let { users, showUser } = this.props;
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
      debugger;
      let top = popupUserTarget.offsetTop + popupUserTarget.offsetParent.offsetTop - this.scrollBar.current.scrollTop;
      if (top > viewHeight - minOffset)
        top = viewHeight - minOffset;
      let left = popupUserTarget.offsetLeft + popupUserTarget.offsetWidth + popupUserTarget.offsetParent.offsetLeft + 10;

    return {
      top,
      left
    };
  }

  render() {
    return (
      <div className="chatroom-container">
        <div className="message-filler"></div>
        <div className="message-list" ref={this.scrollBar}>
          {this.state.messagesList.map((item, idx) => 
            <div key={idx} className="messages-wrapper">
              {item}
            </div>
          )}
          <div ref={this.bottom} />
        </div>
        <ChannelMessageForm messageACChannel={this.messageACChannel} joinChannel={this.props.joinChannel} status={this.props.status}/>
        { this.renderUserPopup() }
      </div>
    );
  }
}

export default withRouter(ChannelChat);