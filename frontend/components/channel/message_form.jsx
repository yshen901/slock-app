import React from 'react';

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { body: "" };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  update(field) {
    return e =>
      this.setState({ [field]: e.currentTarget.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.body !== "") {
      App.cable.subscriptions.subscriptions[0].speak(
        { 
          message: { 
            body: this.state.body,
            user_id: getState().session.user_id,
            channel_id: getState().session.channel_id
          }
        }
      );
      this.setState({ body: "" });
    }
  }

  render() {
    return(
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input className="chat-input" autoFocus
            type="text"
            value={this.state.body}
            onChange={this.update("body")}
            placeholder="Type message here"
          />
          <input type="submit" value=""/>
        </form>
      </div>
    )
  }
}

export default MessageForm;