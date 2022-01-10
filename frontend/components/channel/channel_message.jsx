import React from 'react';

class ChannelMessage extends React.Component {
  constructor(props) {
    super(props);

    this.toggleMessageReact = this.toggleMessageReact.bind(this);
    this.toggleMessageSave = this.toggleMessageSave.bind(this);
  }

  toggleMessageReact(messageData, react_code) {
    return (e) => {
      e.preventDefault();
      let { current_user_id } = this.props;
      let { messageACChannel, deleteMessageReact, postMessageReact } = this.props;

      if (messageData.user_reacts && messageData.user_reacts[current_user_id] && messageData.user_reacts[current_user_id][react_code])
        deleteMessageReact({
          message_id: messageData.id,
          react_code
        }).then(({message_react, type}) => messageACChannel.speak({message: { type, message_react }}));
      else
        postMessageReact({
          message_id: messageData.id,
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

  messageDeleteButton(messageData) {
    let { current_user_id, messageACChannel } = this.props;
    if (messageData.user_id == current_user_id) 
      return (
        <div className="message-button"
          onClick={() => messageACChannel.speak({message: {type: "DELETE", id: messageData.id}})}>
          <i className="far fa-trash-alt fa-fw"></i>
        </div>
      );
  }

  render() {
    let { grouped, saved, messageData, toggleUserPopup } = this.props;
    let { created_at, created_date, body, user_id, username, photo_url, id } = messageData;

    if (grouped)
      return (
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
              { this.messageEmojiButton(messageData, '\u{1F4AF}') } 
              { this.messageEmojiButton(messageData, '\u{1F44D}') }
              { this.messageEmojiButton(messageData, '\u{1F642}') }
              { this.messageEmojiButton(messageData, '\u{1F602}') }
              { this.messageEmojiButton(messageData, '\u{1F60D}') }
              { this.messageEmojiButton(messageData, '\u{1F622}') }
              { this.messageEmojiButton(messageData, '\u{1F620}') }
              <div className="message-button" onClick={this.toggleMessageSave(id)}>
                <i className={saved ? "fas fa-bookmark fa-fw magenta" : "far fa-bookmark fa-fw"}></i>
              </div>
              {this.messageDeleteButton(messageData)}
            </div>
          </div>
          { this.messageReactsList(messageData) }
        </div>
      )
    else 
      return (
        <div className={saved ? "message saved" : "message"}>
          { this.messageSavedBanner(saved) }
          <div className="message-content">
            <div className="message-user-icon">
              <img src={photo_url} onClick={toggleUserPopup(user_id)}/>
            </div>
            <div className="message-text">
              <div className="message-header">
                <div className="message-user" onClick={toggleUserPopup(user_id)}>{username}</div>
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
              { this.messageEmojiButton(messageData, '\u{1F4AF}') } 
              { this.messageEmojiButton(messageData, '\u{1F44D}') }
              { this.messageEmojiButton(messageData, '\u{1F642}') }
              { this.messageEmojiButton(messageData, '\u{1F602}') }
              { this.messageEmojiButton(messageData, '\u{1F60D}') }
              { this.messageEmojiButton(messageData, '\u{1F622}') }
              { this.messageEmojiButton(messageData, '\u{1F620}') }
              <div className="message-button" onClick={this.toggleMessageSave(id)}>
                <i className={saved ? "fas fa-bookmark fa-fw magenta" : "far fa-bookmark fa-fw"}></i>
              </div>
              {this.messageDeleteButton(messageData)}
            </div>
          </div>
          { this.messageReactsList(messageData) }
        </div>
      )
  }
}

export default ChannelMessage;