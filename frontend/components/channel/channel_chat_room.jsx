import React from 'react';
import { withRouter } from 'react-router-dom';

import MessageForm from './message_form';

// #AC
class ChannelChatRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = { messages: [] }
    this.bottom = React.createRef();
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

    let {getMessages, channel_id, users} = this.props;
    debugger
    getMessages(channel_id)
      .then(
        ({messages}) => {
          let messagesInfo = Object.values(messages).map(
            message => {return{
              body: message.body,
              created_at: message.created_at.slice(0,10),
              // email: users[message.user_id].email
            }}
          )
          this.setState({ messages: messagesInfo})
        }
      )
  }

  // NOTE: CURRENT REFERS TO THE LAST ELEMENT WITH PROPERTY ref={this.bottom}
  componentDidUpdate() {
    if (this.bottom.current) this.bottom.current.scrollIntoView();
  }

  // TODO1: Group these nicely
  render() {
    const messageList = this.state.messages.map(message => {
      return (
        <div key={message.id} className="message">
          Body: {message.body}
          <br/>
          Time: {message.created_at}
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