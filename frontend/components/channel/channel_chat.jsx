import React from 'react';
import { withRouter } from 'react-router-dom';
import { photoUrl } from '../../selectors/selectors';

import ChannelMessageForm from './channel_message_form';

// #AC
class ChannelChat extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      messagesList: [],
      messagesData: [],
      currentDate: (new Date(Date())).toLocaleDateString()
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
    
    if (messageDate == "Invalid Date")
      currentDate;
    return messageDate.toLocaleDateString();
  }

  groupMessages(message, prevMessage) {
    if (message.user_id == prevMessage.user_id)
      if (message.created_at.slice(0, 2) == prevMessage.created_at.slice(0, 2))
        return true;
    return false;
  }

  processNewMessage(messagesData, messagesList, i) {
    i = i != null ? i : messagesData.length - 1;
    let { created_at, created_date, body, user_id, username, photo_url, id} = messagesData[i];

    if (i == 0 || created_date !== messagesData[i-1].created_date) {
      let date = created_date;
      if (date == this.state.currentDate)
        date = "Today";
      messagesList.push(
        <div className="day-divider">
          <div className="day-divider-line"></div>
          <div className="day-divider-date">{date}</div>
        </div>
      )        
    }

    if (i != 0 && this.groupMessages(messagesData[i], messagesData[i-1]))
      messagesList.push(
        <div className='message'>
          <div className="message-time-tag">{created_at}</div>
          <div className="message-text">
            <div className="message-body">{body}</div>
          </div>
        </div>
      )
    else
      messagesList.push(
        <div className='message'>
          <div className="message-user-icon">
            <img src={photo_url} onClick={() => this.props.showUser(user_id)}/>
          </div>
          <div className="message-text">
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

  receiveACData(data) {
    let { message } = data;     //extract the data
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
          {this.state.messagesList.map((item, idx) => 
            <div key={idx}>
              {item}
            </div>
          )}
          <div ref={this.bottom} />
        </div>
        <ChannelMessageForm messageACChannel={this.messageACChannel} joinChannel={this.props.joinChannel} status={this.props.status}/>
      </div>
    );
  }
}

export default withRouter(ChannelChat);