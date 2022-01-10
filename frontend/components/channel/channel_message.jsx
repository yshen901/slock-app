import React from 'react';
import ChannelMessageForm from './channel_message_form';

class ChannelMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    }

    this.toggleEditCancel = this.toggleEditCancel.bind(this);
    this.toggleEditSave = this.toggleEditSave.bind(this);
    this.toggleMessageReact = this.toggleMessageReact.bind(this);
    this.toggleMessageSave = this.toggleMessageSave.bind(this);
  }

  toggleEditCancel() {
    return (e) => {
      e.preventDefault();
      this.setState( {editing: false} );
    }
  }

  toggleEditSave() {
    return (e) => {
      e.preventDefault();
      this.setState( {editing: false} );
    }
  }

  toggleMessageReact(react_code) {
    return (e) => {
      e.preventDefault();
      if (this.props.status.canJoin) return; // do not allow this action if not joined

      let { current_user_id, message } = this.props;
      let { messageACChannel, deleteMessageReact, postMessageReact } = this.props;

      if (message.user_reacts && message.user_reacts[current_user_id] && message.user_reacts[current_user_id][react_code])
        deleteMessageReact({
          message_id: message.id,
          react_code
        }).then(({message_react, type}) => messageACChannel.speak({message: { type, message_react }}));
      else
        postMessageReact({
          message_id: message.id,
          react_code
        }).then(({message_react, type}) => messageACChannel.speak({message: { type, message_react }}));
    };
  }

  toggleMessageSave(messageId) {
    return (e) => {
      if (e) e.preventDefault();

      let { messages, user_saved_messages, workspace_id } = this.props;
      let { deleteMessageSave, postMessageSave, messageACChannel } = this.props;
      if (user_saved_messages[messageId])
        deleteMessageSave({
          message_id: messageId,
        }).then(({message_save, type}) => messageACChannel.speak({message: { type, id: message_save.message_id }}))
      else
        postMessageSave({
          message_id: messageId,
          workspace_id: workspace_id
        }).then(({message_save, type}) => {
          messageACChannel.speak({
            message: { 
              type, 
              id: message_save.message_id, 
              message_save_id: message_save.id, 
              message: messages[message_save.message_id] 
            }})
        })
    }
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

  messageButtons(saved) {
    let { message } = this.props;
    if (!this.props.status.canJoin)
      return (
        <div className="message-buttons">
          { this.messageEmojiButton('\u{1F4AF}') } 
          { this.messageEmojiButton('\u{1F44D}') }
          { this.messageEmojiButton('\u{1F642}') }
          { this.messageEmojiButton('\u{1F602}') }
          { this.messageEmojiButton('\u{1F60D}') }
          { this.messageEmojiButton('\u{1F622}') }
          { this.messageEmojiButton('\u{1F620}') }
          <div className="message-button" onClick={this.toggleMessageSave(message.id)}>
            <i className={saved ? "fas fa-bookmark fa-fw magenta" : "far fa-bookmark fa-fw"}></i>
          </div>
          {this.messageEditButton()}
          {this.messageDeleteButton()}
        </div>
      );
  }

  messageEmojiButton(react_code) {
    return (
      <div className="message-button emoji" 
        onClick={this.toggleMessageReact(react_code)}>{react_code}</div>
    )
  }

  messageReactsList() {
    let total_reacts = Object.entries(this.props.message.total_reacts);
    if (total_reacts.length == 0) return;

    return (
      <div className="message-reacts-list">
        { total_reacts.map(([react_code, num], idx) => (
          <div className="message-react" key={idx} onClick={this.toggleMessageReact(react_code)}>
            <div className="emoji">{react_code}</div>
            <div className="number">{num}</div>
          </div>
        ))}
      </div>
    )
  }

  messageDeleteButton() {
    let { current_user_id, messageACChannel, message } = this.props;
    if (message.user_id == current_user_id) 
      return (
        <div className="message-button"
          onClick={() => messageACChannel.speak({message: {type: "DELETE", id: message.id}})}>
          <i className="far fa-trash-alt fa-fw"></i>
        </div>
      );
  }

  messageEditButton() {
    let { current_user_id, message } = this.props;
    if (message.user_id == current_user_id) 
      return (
        <div className="message-button"
          onClick={() => this.setState({ editing: true })}>
          <i className="far fa-edit fa-fw"></i>
        </div>
      );
  }

  messageHeader() {
    let { grouped, messageData, toggleUserPopup } = this.props;
    let { user_id, username, created_date, created_at } = messageData;

    if (!grouped)
      return (
        <div className="message-header">
          <div className="message-user" onClick={toggleUserPopup(user_id)}>{username}</div>
          <div className="message-time">
            <div className="black-popup">
              {created_date} at {created_at}
            </div>
            {created_at}
          </div>
        </div>
      )
  }

  messageIcon() {
    let { grouped, messageData, toggleUserPopup } = this.props;
    let { created_date, created_at, photo_url, user_id } = messageData;

    if (grouped)
      return (
        <div className="message-time-tag">
          <div className="black-popup">
            {created_date}
          </div>
          {created_at}
        </div>
      )
    else
      return (
        <div className="message-user-icon">
          <img src={photo_url} onClick={toggleUserPopup(user_id)}/>
        </div>
      )
  }

  messageBody() {
    let { messageACChannel, status, message } = this.props;
    let { body } = message;

    if (this.state.editing)
      return (
        <div className="message-edit-container">
          <ChannelMessageForm
            messageBody={body}
            messageACChannel={messageACChannel}
            status={status}
            toggleEditCancel={this.toggleEditCancel}
            toggleEditSave={this.toggleEditSave}/>
        </div>
      );
    else
      return (
        <div className="message-body" dangerouslySetInnerHTML={{__html: body}}></div>
      );
  }

  render() {
    let { message } = this.props;
    let saved = !!this.props.user_saved_messages[message.id];

    return (
      <div className={saved || this.state.editing ? "message saved" : "message"}>
        { this.messageSavedBanner(saved) }
        <div className="message-content">
          { this.messageIcon() }
          <div className="message-text">
            {this.messageHeader()}
            {this.messageBody()}
          </div>
          { this.messageButtons(saved) }
        </div>
        { this.messageReactsList() }
      </div>
    )
  }
}

export default ChannelMessage;