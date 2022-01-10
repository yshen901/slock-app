import React from 'react';

class ChannelMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  

  render() {
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
              { this.messageEmojiButton(messagesData[i], '\u{1F4AF}') } 
              { this.messageEmojiButton(messagesData[i], '\u{1F44D}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F642}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F602}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F60D}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F622}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F620}') }
              <div className="message-button" onClick={this.toggleMessageSave(messagesData[i].id)}>
                <i className={saved ? "fas fa-bookmark fa-fw magenta" : "far fa-bookmark fa-fw"}></i>
              </div>
              {this.messageDeleteButton(messagesData[i])}
            </div>
          </div>
          { this.messageReactsList(messagesData[i]) }
        </div>
      )
    else 
      return (
        <div className={saved ? "message saved" : "message"}>
          { this.messageSavedBanner(saved) }
          <div className="message-content">
            <div className="message-user-icon">
              <img src={photo_url} onClick={this.toggleUserPopup(user_id)}/>
            </div>
            <div className="message-text">
              <div className="message-header">
                <div className="message-user" onClick={this.toggleUserPopup(user_id)}>{username}</div>
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
              { this.messageEmojiButton(messagesData[i], '\u{1F4AF}') } 
              { this.messageEmojiButton(messagesData[i], '\u{1F44D}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F642}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F602}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F60D}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F622}') }
              { this.messageEmojiButton(messagesData[i], '\u{1F620}') }
              <div className="message-button" onClick={this.toggleMessageSave(messagesData[i].id)}>
                <i className={saved ? "fas fa-bookmark fa-fw magenta" : "far fa-bookmark fa-fw"}></i>
              </div>
              {this.messageDeleteButton(messagesData[i])}
            </div>
          </div>
          { this.messageReactsList(messagesData[i]) }
        </div>
      )
  }
}

export default ChannelMessage;