import React from 'react';
import { withRouter } from 'react-router-dom';

import MessageForm from './message_form';

const DEFAULT_PHOTO_URL = '/images/profile/default.jpg';

// #AC
class ChannelChatRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      messages: []
    };

    this.bottom = React.createRef();

    this.loadMessages = this.loadMessages.bind(this);
    this.receiveACData = this.receiveACData.bind(this);
  }

  loadMessages() {
    let { getMessages, channel_id, users } = this.props;
    getMessages(channel_id)
      .then(
        ({ messages }) => {
          let messagesInfo = Object.values(messages).map(
            message => { //NOTE: USEFUL FOR HANDLING DATES
              let created_at, len;
              let date_now = new Date(Date());
              let message_date = new Date(message.created_at);
              let username = users[message.user_id].email.split("@")[0];
              let photo_url = users[message.user_id].photo_url;
              if (!photo_url)
                photo_url = DEFAULT_PHOTO_URL;

              if (date_now.toDateString() !== message_date.toDateString()) // TODO1: CHANGE TIME, AND MAYBE SAVE DATE_NOW SOMEWHERE ELSE INSTEAD OF CONSTANTLY RECREATING IT
                created_at = message_date.toLocaleDateString();
              else {
                created_at = message_date.toLocaleTimeString();
                len = created_at.length;
                created_at = created_at.slice(0, len-6) + created_at.slice(len-3);
              }

              return {
                body: message.body,
                created_at,
                username,
                photo_url,
              }
            }
          )
          this.setState({ messages: messagesInfo })
        }
      )
  }

  receiveACData(data) {
    let { message } = data;     //extract the data
    let { user_id } = message;

    message.username = this.props.users[user_id].email.split("@")[0];
    message.photo_url = this.props.users[user_id].photo_url;
    if (!message.photo_url)
      message.photo_url = DEFAULT_PHOTO_URL;

    this.setState({
      messages: this.state.messages.concat(message)
    });
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

  // TODO1: Group these nicely
  render() {
    const messageList = this.state.messages.map((message, idx) => {
      return (
        <div className='message' key={idx}>
          <div className="message-user-icon">
            <img src={message.photo_url}/>
          </div>
          <div key={message.id} className="message-text">
            <div className="message-header">
              <div className="message-user">{message.username}</div>
              <div className="message-time">{message.created_at}</div>
            </div>
            <div className="message-body">{message.body}</div>
          </div>
        </div>
      );
    });

    return (
      <div className="chatroom-container">
        <div className="message-list">
          {messageList}
          <div ref={this.bottom} />
        </div>
        <MessageForm messageACChannel={this.messageACChannel} joinChannel={this.props.joinChannel} status={this.props.status}/>
      </div>
    );
  }
}

export default withRouter(ChannelChatRoom);