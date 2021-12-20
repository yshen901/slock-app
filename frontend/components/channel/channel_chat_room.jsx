import React from 'react';
import { withRouter } from 'react-router-dom';
import { photoUrl } from '../../selectors/selectors';

import MessageForm from './message_form';

// #AC
class ChannelChatRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      messagesList: [],
      messagesData: []
    };

    this.bottom = React.createRef();

    this.loadMessages = this.loadMessages.bind(this);
    this.receiveACData = this.receiveACData.bind(this);
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
    let new_created_at, len, hour;
    let { created_at } = message;
    let message_date = new Date(created_at);

    // Not a datetime string - results from AC
    if (message_date == "Invalid Date") {
      new_created_at = this.processTime(created_at, seconds);
    }
    else {
      // Remove date information in lieu of date separators
      // let date_now = new Date(Date());
      // if (date_now.toDateString() !== message_date.toDateString()) 
      //   new_created_at = message_date.toLocaleDateString();
      // else 
        new_created_at = this.processTime(message_date.toLocaleTimeString(), seconds);
    }
      
    return new_created_at;
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

  groupMessages(message, prevMessage) {
    if (message.user_id == prevMessage.user_id)
      if (message.created_at.slice(0, 2) == prevMessage.created_at.slice(0, 2))
        return true;
    return false;
  }

  processNewMessage(messagesData, i) {
    let { created_at, body, user_id, username, photo_url } = messagesData[i];

    if (i != 0 && this.groupMessages(messagesData[i], messagesData[i-1]))
      return (
        <div className='message' key={i}>
          <div className="message-time-tag">{created_at}</div>
          <div key={i} className="message-text">
            <div className="message-body">{body}</div>
          </div>
        </div>
      )
    else
      return (
        <div className='message' key={i}>
          <div className="message-user-icon">
            <img src={photo_url} onClick={() => this.props.showUser(user_id)}/>
          </div>
          <div key={i} className="message-text">
            <div className="message-header">
              <div className="message-user" onClick={() => this.props.showUser(user_id)}>{username}</div>
              <div className="message-time">{created_at}</div>
            </div>
            <div className="message-body">{body}</div>
          </div>
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
            message.created_at = this.getMessageTimestamp(message);
            message.username = this.profileName(users[message.user_id]);
            return message;
          });

          let messagesList = [];
          for (let i = 0; i < messagesData.length; i++) {
            messagesList.push(this.processNewMessage(messagesData, i));
          }
          this.setState({ messagesList, messagesData })
        }
      )
  }

  receiveACData(data) {
    let { message } = data;     //extract the data
    let { user_id, channel_id, activate_dm_channel } = message;

    // loads the message if its to the current channel
    if (channel_id == this.props.channel_id) {
      message.username = this.profileName(this.props.users[user_id]);
      message.photo_url = photoUrl(this.props.users[user_id]);
      message.created_at = this.processTime(message.created_at);

      this.setState({
        newMessages: this.state.newMessages.concat(message)
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
  componentDidUpdate(oldProps) {
    let {channel_id} = this.props.match.params;
    if (channel_id != "0" && channel_id !== oldProps.match.params.channel_id)
      this.loadMessages();
    if (this.bottom.current) this.bottom.current.scrollIntoView();
  }

  render() {
    return (
      <div className="chatroom-container">
        <div className="message-list">
          {this.state.messagesList}
          <div ref={this.bottom} />
        </div>
        <MessageForm messageACChannel={this.messageACChannel} joinChannel={this.props.joinChannel} status={this.props.status}/>
      </div>
    );
  }
}

export default withRouter(ChannelChatRoom);