import React from 'react';
import { withRouter } from 'react-router-dom';
import { photoUrl } from '../../selectors/selectors';

import ChannelMessageForm from './channel_message_form';
import UserPopupModal from "../modals/user_popup_modal.jsx";
import ChannelMessageContainer from "./channel_message_container";

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

  processNewMessage(messagesData, messagesList, i) {
    i = i != null ? i : messagesData.length - 1;
    let { created_at, created_date, body, user_id, username, photo_url } = messagesData[i];
    let saved = !!this.props.user_saved_messages[messagesData[i].id];
    let grouped = i != 0 && this.groupMessages(messagesData[i], messagesData[i-1]);

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

    messagesList.push(
      <ChannelMessageContainer
        grouped={grouped}
        saved={saved}
        messageData={messagesData[i]}
        messageACChannel={this.messageACChannel}
        toggleUserPopup={this.toggleUserPopup}/>
    )
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

    let minOffset = 524;
    if (hasStatus)
      minOffset = 580;
    
      let viewHeight = $(window).innerHeight();
      let top = popupUserTarget.offsetTop + popupUserTarget.offsetParent.offsetTop - this.scrollBar.current.scrollTop + 38;
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