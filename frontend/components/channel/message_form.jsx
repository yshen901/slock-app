import React from 'react';
import { withRouter } from 'react-router-dom';
import { joinChannel } from "../../actions/channel_actions";

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { body: "" };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.joinChannel = this.joinChannel.bind(this);
  }

  update(field) {
    return e =>
      this.setState({ [field]: e.currentTarget.value });
  }

  joinChannel(e) {
    let { channel_id } = this.props.match.params;
    dispatch(joinChannel(parseInt(channel_id)))
      .then(
        () => this.setState(this.state)
      )
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.body !== "") {
      let { users } = getState().entities;
      let { user_id } = getState().session;

      App.cable.subscriptions.subscriptions[0].speak(
        { 
          message: { 
            body: this.state.body,
            user_id: getState().session.user_id,
            channel_id: getState().session.channel_id,
            created_at: new Date().toLocaleTimeString(),
            username: users[user_id].email.split('@')[0],
          }
        }
      );
      this.setState({ body: "" });
    }
  }

  render() {
    let { user_channels } = getState().session;
    let { channels } = getState().entities;
    let { channel_id } = this.props.match.params;

    if (user_channels[channel_id])
      return (
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input className="chat-input" autoFocus
            type="text"
            value={this.state.body}
            onChange={this.update("body")}
            placeholder="Type message here"
          />
          <input type="submit" value=""/>
        </form>
      )
    else
      return (
        <div className="channel-preview-panel">
          <h1>You are viewing <strong>#{channels[channel_id].name}</strong> </h1>
          <div className="channel-preview-button" onClick={this.joinChannel}>Join Channel</div>
        </div>
      )
  }
}

export default withRouter(MessageForm);