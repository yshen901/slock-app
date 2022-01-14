import React from 'react';
import { deleteMessage } from '../../actions/message_actions';
import { getFileTypeInfo, getUserName, UTF_CODE_NAMES } from '../../selectors/selectors';
import ChannelMessageForm from './channel_message_form';

class ChannelMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      filesOpen: true
    }

    this.toggleEditCancel = this.toggleEditCancel.bind(this);
    this.toggleEditSave = this.toggleEditSave.bind(this);
    this.toggleFileDelete = this.toggleFileDelete.bind(this);
    this.toggleMessageDelete = this.toggleMessageDelete.bind(this);
    this.toggleMessageReact = this.toggleMessageReact.bind(this);
    this.toggleMessageSave = this.toggleMessageSave.bind(this);
  }

  // Stop editing
  toggleEditCancel() {
    return (e) => {
      e.preventDefault();
      this.setState( {editing: false} );
    }
  }

  // Update the message and stop editing
  toggleEditSave(ref) {
    return (e) => {
      e.preventDefault();
      let body = ref.current.innerHTML;
      if (ref.current.textContent.length == 0) {
        this.toggleMessageDelete()();
        this.setState({ editing: false });
      }
      else
        this.props.updateMessage({id: this.props.message.id, body})
          .then(
            () => this.setState( {editing: false} )
          )
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
        }).then(({message_react, type}) => messageACChannel.speak({message_data: { type, message_react }}));
      else
        postMessageReact({
          message_id: message.id,
          react_code
        }).then(({message_react, type}) => messageACChannel.speak({message_data: { type, message_react }}));
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
        }).then(({message_save, type}) => messageACChannel.speak({message_data: { type, id: message_save.message_id }}))
      else
        postMessageSave({
          message_id: messageId,
          workspace_id: workspace_id
        }).then(({message_save, type}) => {
          messageACChannel.speak({
            message_data: { 
              type, 
              id: message_save.message_id, 
              message_save_id: message_save.id, 
              message: messages[message_save.message_id] 
            }})
        })
    }
  }

  toggleMessageDelete() {
    return (e) => {
      if (e) e.preventDefault();

      let { message } = this.props;
        let { deleteMessage, messageACChannel } = this.props;
        deleteMessage(message)
          .then(
            ({message}) => {
              messageACChannel.speak({message_data: {type: "DELETE", id: message.id, user_id: message.user_id}});
            }
          );
    };
  }

  toggleFileDelete(id) {
    return (e) => {
      if (e) e.preventDefault();

      let { message } = this.props;
      if (message.files.length > 1 || message.body != "")
        this.props.updateMessage({
          deleted_file_id: id,
          id: message.id
        });
      else
        this.props.deleteMessage(message)
          .then(
            ({message}) => {
              this.props.messageACChannel.speak({message_data: {type: "DELETE", id: message.id, user_id: message.user_id}});
            }
          );
    }
  }

  messageBanner(saved) {
    if (saved && this.props.match.params.channel_id != "saved-browser")
      return (
        <div className="saved-banner">
          <i className="fas fa-bookmark fa-fw magenta"></i>
          <div>Added to your saved items</div>
        </div>
      )
    else if (this.props.match.params.channel_id == "saved-browser") {
      let { channels, message } = this.props;
      let channel = channels[message.channel_id];
      return (
        <div className="message-channel-header" onClick={() => this.goToChannel(channel.id)}>
          {channel.dm_channel ? "Direct Message" : `#${channel.name}`}
        </div>
      )
    }
  }

  messageButtons(saved) {
    let { message } = this.props;
    if (!this.props.status.canJoin && !this.state.editing)
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
            <div className="black-popup">
              <div>Add to saved items</div>
            </div>
          </div>
          {this.messageEditButton()}
          {this.messageDeleteButton()}
        </div>
      );
  }

  messageEmojiButton(react_code) {
    return (
      <div className="message-button emoji" onClick={this.toggleMessageReact(react_code)}>
        {react_code}
        <div className="black-popup medium">
          <div>{UTF_CODE_NAMES[react_code]}</div>
        </div>
      </div>
    )
  }

  messageReactsList() {
    let total_reacts = Object.entries(this.props.message.total_reacts);
    if (total_reacts.length == 0) return;

    if (!this.state.editing)
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
    let { current_user_id, message } = this.props;
    if (message.user_id == current_user_id) 
      return (
        <div className="message-button"
          onClick={this.toggleMessageDelete()}>
          <i className="far fa-trash-alt fa-fw"></i>
          <div className="black-popup thin">
            <div>Delete</div>
          </div>
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
          <div className="black-popup thin">
            <div>Edit</div>
          </div>
        </div>
      );
  }

  messageHeader() {
    let { grouped, message, toggleUserPopup, users } = this.props;
    let { user_id, created_date, created_time } = message;

    if (!grouped)
      return (
        <div className="message-header">
          <div className="message-user" onClick={toggleUserPopup(user_id)}>{getUserName(users[user_id])}</div>
          <div className="message-time">
            <div className="black-popup">
              {created_date} at {created_time}
            </div>
            {created_time}
          </div>
        </div>
      )
  }

  messageIcon() {
    let { grouped, toggleUserPopup, message, users } = this.props;
    let { created_date, created_time, user_id } = message;

    if (grouped)
      return (
        <div className="message-time-tag">
          <div className="black-popup">
            {created_date}
          </div>
          {created_time}
        </div>
      )
    else
      return (
        <div className="message-user-icon">
          <img src={users[user_id].photo_url} onClick={toggleUserPopup(user_id)} loading="lazy"/>
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

  messageFiles() {
    let { files } = this.props.message;
    let fileTypeInfo;

    if (files.length > 0) {
      let fileNum = files.length;
      let { filesOpen } = this.state;
      return (
        <div className='message-files'>
          <div className="message-files-toggle">
            <div className='message-files-num'>
              {fileNum == 1 ? "1 file" : `${fileNum} files`}
            </div>
            <div 
              className={filesOpen ? "fas fa-caret-down fa-fw" : "fas fa-caret-right fa-fw"}
              onClick={() => this.setState({filesOpen: !filesOpen})}></div>
          </div>
          <div className="files-list">
            { files.map((file, i) => {
                fileTypeInfo = getFileTypeInfo(file);
                if (filesOpen && fileTypeInfo.iconSymbol == "image") { // irrelevant as we are currently using icons
                  return (
                    <div className="file" key={i}>
                      <div className="file-icon">
                        <img src={file.url} loading="lazy"/>
                      </div>
                      <div className="file-info">
                        <div className="file-name">{file.name.split(".")[0].slice(0, 19)}</div>
                        <div className="file-type">{fileTypeInfo.name}</div>
                      </div>
                      <div className="file-buttons">
                        <div className="far fa-trash-alt fa-fw"></div>
                        <div className="fas fa-cloud-download-alt fa-fw"></div>
                      </div>
                    </div>
                  );
                }
                else if (filesOpen) {
                  return (
                    <div className="file" key={i}>
                      <div className={`file-icon ${fileTypeInfo.iconSymbol} ${fileTypeInfo.iconBackground}`}></div>
                      <div className="file-info">
                        <div className="file-name">{file.name.split(".")[0].slice(0, 19)}</div>
                        <div className="file-type">{fileTypeInfo.name}</div>
                      </div>
                      <div className="file-buttons">
                        <div className="far fa-trash-alt fa-fw" onClick={this.toggleFileDelete(file.id)}></div>
                        <a className="fas fa-cloud-download-alt fa-fw" href={file.url} target="_blank"></a>
                      </div>
                    </div>
                  );
                }
            })}
          </div>
        </div>
      )
    }
  }

  render() {
    // For when message is deleted
    let { message, key } = this.props;
    if (!message)
      return <div className="message"></div>

    let saved = !!this.props.user_saved_messages[message.id];
    return (
      <div className={saved || this.state.editing ? "message saved" : "message"} key={key}>
        { this.messageBanner(saved) }
        <div className="message-content">
          { this.messageIcon() }
          <div className="message-text">
            {this.messageHeader()}
            {this.messageBody()}
            { this.messageFiles() }
          </div>
          { this.messageButtons(saved) }
        </div>
        { this.messageReactsList() }
      </div>
    )
  }
}

export default ChannelMessage;