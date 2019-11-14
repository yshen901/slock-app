import React from 'react';
import { withRouter } from 'react-router-dom';

import MessageForm from './message_form';

// #AC
class ChannelChatRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = { messages: [] }
    this.bottom = React.createRef();

    this.loadMessages = this.loadMessages.bind(this);
  }

  loadMessages() {
    let { getMessages, channel_id, users } = this.props;
    getMessages(channel_id)
      .then(
        ({ messages }) => {
          let messagesInfo = Object.values(messages).map(
            message => { //NOTE: USEFUL FOR HANDLING DATES
              let created_at;
              let date = new Date(message.created_at);
              if (Date.now() - Date.parse(message.created_at) > 86400000)
                created_at = date.toLocaleDateString();
              else
                created_at = date.toLocaleTimeString();
              return {
                body: message.body,
                created_at: created_at,
                name: users[message.user_id].email.split("@")[0]
              }
            }
          )
          this.setState({ messages: messagesInfo })
        }
      )
  }

  componentDidMount() {
    App.cable.subscriptions.create(
      { channel: "ChatChannel" }, //AC: MUST MATCH THE NAME OF THE CLASS IN CHAT_CHANNEL.RB
      {
        received: data => {
          this.setState({
            messages: [data.message].concat(this.state.messages)
          });
        },
        speak: function(data) {
          return this.perform('speak', data);
        }
      }
    );

    this.loadMessages();
  }

  // NOTE: CURRENT REFERS TO THE LAST ELEMENT WITH PROPERTY ref={this.bottom}
  componentDidUpdate(oldProps) {
    if (this.props.match.params.channel_id !== oldProps.match.params.channel_id)
      this.loadMessages();
    if (this.bottom.current) this.bottom.current.scrollIntoView();
  }

  // TODO1: Group these nicely
  render() {
    const messageList = this.state.messages.map(message => {
      return (
        <div key={message.id} className="message">
          <div className="message-header">
            <div className="message-user">{message.name}</div>
            <div className="message-time">{message.created_at}</div>
          </div>
          <div className="message-body">{message.body}</div>
        </div>
      );
    });

    return (
      <div className="chatroom-container">
        <div className="message-list">
          {messageList}
          <div ref={this.bottom} />
        </div>
        <MessageForm />
      </div>
    );
  }
}

export default withRouter(ChannelChatRoom);