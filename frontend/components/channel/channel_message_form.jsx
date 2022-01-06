import React from 'react';
import { withRouter } from 'react-router-dom';
import { joinChannel } from "../../actions/channel_actions";
import { toggleFocusElements } from '../../util/modal_api_util';

class ChannelMessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      canJoin: props.status.canJoin,
      linkModal: false,
      linkText: "",
      linkUrl: "",
    };

    this.format = this.format.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.toggleLinkForm = this.toggleLinkForm.bind(this);
    this.appendLink = this.appendLink.bind(this);
    this.goToChannel = this.goToChannel.bind(this);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.status.canJoin !== this.props.status.canJoin)
      this.setState({ canJoin: this.props.status.canJoin })
  }

  goToChannel(channel_id) {
    let workspace_address = this.props.match.params.workspace_address;
    this.props.history.push(`/workspace/${workspace_address}/${channel_id}`);
  }

  handleSubmit(e) {
    if (e.currentTarget.textContent.length != 0) {
      let { users } = getState().entities;
      let { user_id } = getState().session;

      this.props.messageACChannel.speak(
        {
          message: { 
            body: e.currentTarget.innerHTML,
            user_id: getState().session.user_id,
            channel_id: getState().session.channel_id,
            created_at: new Date().toLocaleTimeString(),
          }
        }
      );
      e.currentTarget.innerHTML = "";
    }
  }

  getDmChannelName(channel) {
    let { currentUserId } = getState().session.user_id;
    let { users } = getState().entities;
    let ids = Object.keys(channel.users);

    if (ids[0] == currentUserId)
      return users[ids[1]].email
    return users[ids[0]].email
  }

  // Executes commands on contentEditable chat-input
  format(command, value) {
    return e => {
      e.preventDefault();
      document.execCommand(command, false, value);
    }
  }

  // Handles key press on contentEditable chat-input
  handleKeyDown(e) {
    if (!e.shiftKey && e.key == "Enter") {
      e.preventDefault();
      this.handleSubmit(e);
    }
  }

  // Toggles link form and clears linkText/linkUrl
  toggleLinkForm(linkModal) {
    this.setState({linkModal, linkText: "", linkUrl: ""});
  }

  // Append the link to the chat input field
  appendLink(e) {
    e.preventDefault();

    let {linkUrl, linkText} = this.state;
    let anchorEle = `<a href="http://${linkUrl}" target="_blank">${linkText}</a>`;
    $(document.getElementById("chat-input")).append(anchorEle);
    this.toggleLinkForm(false);
  }

  // Generates a link form modal that will update the 
  renderLinkForm() {
    if (!this.state.linkModal) return;
    return (
      <div className="link-form-modal">
        <div className="part-modal-background" onClick={() => this.toggleLinkForm(false) }></div>
        <div className="create-form">
          <div className="modal-header">
            <h1>Add link</h1>
            <div className="modal-close-button" onClick={() => this.toggleLinkForm(false)}>&#10005;</div>
          </div>     
          <div className="create-form-header">
            <h2>Text</h2>
          </div>
          <div className="channel-name-input">
            <input
              type="text" id="invite-user-input"
              onChange={(e) => this.setState({linkText: e.currentTarget.value})}
              value={this.state.linkText}></input>
          </div> 
          <div className="create-form-header">
            <h2>Link</h2>
          </div>
          <div className="channel-name-input">
            <div className='input-prefix gray'>http://</div>
            <input
              type="text" id="invite-user-input" className="with-prefix"
              onChange={(e) => this.setState({linkUrl: e.currentTarget.value})}
              value={this.state.linkUrl}></input>
          </div> 
          <div className="form-buttons">
            <button onClick={() => this.toggleLinkForm(false)}>Cancel</button>
            <button className="green-button" onMouseDown={e => e.preventDefault() } onClick={this.appendLink} disabled={this.state.linkUrl.length == 0 || this.state.linkText.length == 0}>Save</button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    let { channels } = getState().entities;
    let { channel_id } = this.props.match.params;    
    let channel = channels[channel_id];

    if (this.state.canJoin && channel) {
      let channelName = channels.dm_channel ? this.getDmChannelName(channel) : `#${channel.name}`;
      let buttonText = channels.dm_channel ? "Join Chat" : "Join Channel";
      return (
        <div className="channel-preview-panel">
          <h1>You are viewing {channels.dm_channel ? "your chat with " : ""} <strong>{channelName}</strong> </h1>
          <div className="buttons">
            <div className="channel-preview-button green" onClick={this.props.joinChannel}>{buttonText}</div>
            <div className="channel-preview-button" onClick={toggleFocusElements("channel-details-modal")}>See More Details</div>
          </div>
          <div className="channel-preview-link" onClick={() => this.goToChannel("channel-browser")}>Back to Channel Browser</div>
        </div>
      )
    }
    else
      return (
        <div id="message-box">
          <div id="message-form">
            <div id="chat-toolbar">
              <div className="toolbar-button fa fa-bold fa-fw" aria-hidden="true" onMouseDown={e => e.preventDefault()} onClick={this.format('bold')}></div>
              <div className="toolbar-button fa fa-italic fa-fw" aria-hidden="true" onMouseDown={e => e.preventDefault()} onClick={this.format('italic')}></div>
              <div className="toolbar-button fa fa-strikethrough fa-fw" aria-hidden="true" onMouseDown={e => e.preventDefault()} onClick={this.format('strikeThrough')}></div>
              <div className="toolbar-divider"></div>
              <div className="toolbar-button fa fa-link fa-fw" aria-hidden="true" onClick={() => this.toggleLinkForm(true)}></div>
            </div>
            <div id="chat-input" autoFocus contentEditable onKeyDown={this.handleKeyDown}>
            </div>
            <div id="chat-footer">
              <div className="toolbar-button"></div>
              <div className="toolbar-divider"></div>
              <div className="toolbar-button"></div>
              <div className="toolbar-button"></div>
            </div>
          </div>
          <div id="message-footer">
            <div>
              <b>Shift + Return</b> to add a new line.
            </div>
          </div>
          { this.renderLinkForm() }
        </div>
      )
  }
}

export default withRouter(ChannelMessageForm);