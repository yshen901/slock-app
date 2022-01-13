import React from 'react';
import { withRouter } from 'react-router-dom';
import { toggleFocusElements } from '../../util/modal_api_util';
import DOMPurify from 'dompurify';
import { dmChannelUserId, getFileTypeInfo } from '../../selectors/selectors';

class ChannelMessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      canJoin: props.status.canJoin,
      linkModal: false,
      linkText: "",
      linkUrl: "",
      formatBar: true,
      isActivated: {
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
        createLink: false,
        insertUnorderedList: false,
        insertOrderedList: false
      },
      files: [],
      fileUrls: [],
      fileError: ""
    };

    // Used to find chat input's content
    this.chatInput = React.createRef();

    this.readFile = this.readFile.bind(this);
    this.removeFile = this.removeFile.bind(this);

    this.format = this.format.bind(this);
    this.focusInput = this.focusInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateToolbarState = this.updateToolbarState.bind(this);
    this.handleChatKeyDown = this.handleChatKeyDown.bind(this);
    this.handleLinkKeyDown = this.handleLinkKeyDown.bind(this);
    this.toggleLinkForm = this.toggleLinkForm.bind(this);
    this.appendLink = this.appendLink.bind(this);
    this.goToChannel = this.goToChannel.bind(this);
  }

  componentDidMount() {
    if (this.chatInput.current && this.props.messageBody) {
      this.focusInput();
    }
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldProps.status.canJoin !== this.props.status.canJoin)
      this.setState({ canJoin: this.props.status.canJoin })
    if (oldState.formatBar != this.state.formatBar)
      document.getElementById("chat-input").focus();
  }

  goToChannel(channel_id) {
    let workspace_address = this.props.match.params.workspace_address;
    this.props.history.push(`/workspace/${workspace_address}/${channel_id}`);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.chatInput.current.textContent.length != 0) {

      this.props.messageACChannel.speak(
        {
          message: { 
            type: "PUT",
            body: DOMPurify.sanitize(this.chatInput.current.innerHTML),
            user_id: getState().session.user_id,
            channel_id: this.props.match.params.channel_id,
            created_at: new Date().toLocaleTimeString(),
          }
        }
      );
      this.chatInput.current.innerHTML = "";
    }
  }

  // Reads in the elements using FileReader, and set state when successful
  readFile(e) {
    const reader = new FileReader();
    const file = e.currentTarget.files[0];

    // Triggers when a file is done
    reader.onloadend = () => {
      this.setState({ 
        fileUrls: [...this.state.fileUrls, URL.createObjectURL(file)], 
        files: [...this.state.files, file], 
        fileError: ""
      });
      this.props.updateScroll(84);
    };

    if (file) 
      reader.readAsDataURL(file); // Triggers load
    else
      this.setState({ 
        files: this.state.files, 
        fileUrls: this.state.fileUrls,
        fileError: ""
      });
  }

  removeFile(idx) {
    return e => {
      e.preventDefault();
      this.state.fileUrls.splice(idx, 1);
      this.state.files.splice(idx, 1);
      this.setState({
        fileUrls: this.state.fileUrls,
        files: this.state.files
      });
    }
  }
      
  getDmChannelName(channel) {
    let { user_id } = getState().session;
    let id = dmChannelUserId(channel, user_id);
    return getState().entities.users[id].email;
  }

  focusInput() {
    let el = this.chatInput.current;
    if (el && document.activeElement != el) {
      el.focus();
      if (typeof window.getSelection != "undefined"
              && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse();
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse();
        textRange.select();
      }
    }
  }

  // Executes commands on contentEditable chat-input
  format(command, value) {
    return e => {
      e.preventDefault();
      e.stopPropagation();
      document.execCommand(command, false, value);
      this.setState({isActivated: Object.assign(this.state.isActivated, {[command]: !this.state.isActivated[command]})});
    }
  }

  // Handles events that updates the toolbar states
  updateToolbarState() {
    this.setState({
      isActivated: {
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strikethrough: document.queryCommandState("strikethrough"),
        createLink: document.queryCommandState("createLink"),
        insertUnorderedList: document.queryCommandState("insertUnorderedList"),
        insertOrderedList: document.queryCommandState("insertOrderedList")
      }
    });
  }

  // Handles key press on contentEditable chat-input
  handleChatKeyDown(e) {
    if (!e.shiftKey && e.key == "Enter") {
      e.preventDefault();
      if (this.props.messageBody)
        this.props.toggleEditSave()(e);
      else
        this.handleSubmit(e);
    } 
    else if (e.key == "Backspace") {
      let ele = document.getElementById("chat-input");
      if (ele.textContent.length == 1) {
        ele.innerHTML = "";
      }
    }
    else if (e.ctrlKey && !e.shiftKey) {
      if (e.key == "b")
        this.format("bold")(e);
      else if (e.key == "i")
        this.format("italic")(e);
      else if (e.key == "u")
        this.format("underline")(e);
      else if (e.key == "l")
        this.toggleLinkForm(true)(e);
    }
    else if (e.ctrlKey && e.shiftKey) {
      if (e.key == "X")
        this.format("strikethrough")(e);
      else if (e.key == "%")
        this.format("insertunorderedlist")(e);
      else if (e.key == "^")
        this.format("insertorderedlist")
    }
    this.updateToolbarState();
  }

  // Handles key press on link form
  handleLinkKeyDown(e) {
    if (e.key == "Enter" && this.state.linkUrl.length > 0 && this.state.linkText.length > 0)
      this.appendLink(e);
  }

  // Toggles link form, clears linkText/linkUrl, and resets focus and cursor location
  toggleLinkForm(linkModal) {
    return e => {
      if (e) e.stopPropagation();
      this.setState({linkModal, linkText: "", linkUrl: ""});
      if (!linkModal) {
        this.focusInput();
      }
    }
  }

  // Append the link to the chat input field
  appendLink(e) {
    e.preventDefault();

    let {linkUrl, linkText} = this.state;
    let anchorEle = `<a href="http://${linkUrl}" target="_blank">${linkText}</a>`;
    $(document.getElementById("chat-input")).append(anchorEle);
    this.toggleLinkForm(false)();
  }

  // Renders list of files depending on what kind of file
  renderFilesList() {
    let { fileUrls, files } = this.state;
    let fileTypeInfo;
    if (fileUrls.length > 0) {
      return (
        <div id="files-list" onClick={e => e.stopPropagation()}>
          { files.map((file, i) => {
            if (file.type.includes("image"))
              return (
                <div className="image-file" key={i}>
                  <div className="file-delete-button fas fa-times-circle fa-fw" onClick={this.removeFile(i)}></div>
                  <div className="image-container">
                    <div className="foreground"></div>
                    <img src={fileUrls[i]}/>
                  </div>
                </div>
              );
            else {
              fileTypeInfo = getFileTypeInfo(file);
              return (
                <div className="file" key={i}>
                  <div className="file-delete-button fas fa-times-circle fa-fw" onClick={this.removeFile(i)}></div>
                  <div className={`file-icon ${fileTypeInfo.iconSymbol} ${fileTypeInfo.iconBackground}`}></div>
                  <div className="file-info">
                    <div className="file-name">{file.name.split(".")[0].slice(0, 19)}</div>
                    <div className="file-type">{fileTypeInfo.name}</div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )
    }
  }

  // Generates a link form modal that will update the 
  renderLinkForm() {
    if (!this.state.linkModal) return;
    return (
      <div className="link-form-modal">
        <div className="part-modal-background" onClick={this.toggleLinkForm(false) }></div>
        <div className="create-form">
          <div className="modal-header">
            <h1>Add link</h1>
            <div className="modal-close-button" onClick={this.toggleLinkForm(false)}>&#10005;</div>
          </div>     
          <div className="create-form-header">
            <h2>Text</h2>
          </div>
          <div className="channel-name-input">
            <input
              autoFocus
              type="text"
              onChange={(e) => this.setState({linkText: e.currentTarget.value})}
              onKeyDown={this.handleLinkKeyDown}
              value={this.state.linkText}></input>
          </div> 
          <div className="create-form-header">
            <h2>Link</h2>
          </div>
          <div className="channel-name-input">
            <div className='input-prefix gray'>http://</div>
            <input
              type="text" className="with-prefix"
              onChange={(e) => this.setState({linkUrl: e.currentTarget.value})}
              onKeyDown={this.handleLinkKeyDown}
              value={this.state.linkUrl}></input>
          </div> 
          <div className="form-buttons">
            <button onClick={this.toggleLinkForm(false)}>Cancel</button>
            <button className="green-button" onMouseDown={e => e.preventDefault() } onClick={this.appendLink} disabled={this.state.linkUrl.length == 0 || this.state.linkText.length == 0}>Save</button>
          </div>
        </div>
      </div>
    )
  }

  // Only render footer when not editing
  renderMessageFooter() {
    if (!this.props.messageBody)
      return (
        <div id="message-footer">
          <div>
            <b>Shift + Return</b> to add a new line.
          </div>
        </div>
      );
  }

  // Determines whether we render an arrow button for form, or cancel/save buttons for editor
  renderMessageSend() {
    if (this.props.messageBody)
      return (
        <div id="message-send-buttons">
          <div className="button" onClick={this.props.toggleEditCancel()}>Cancel</div>
          <div className="button green-button" onClick={this.props.toggleEditSave(this.chatInput)}>Save</div>
        </div>
      )
  }

  render() {
    let { channels } = getState().entities;
    let { channel_id } = this.props.match.params;    
    let channel = channels[channel_id];

    let { bold, italic, underline, strikethrough, createLink, insertUnorderedList, insertOrderedList } = this.state.isActivated;

    if (this.state.canJoin && channel) {
      let channelName = channel.dm_channel ? this.getDmChannelName(channel) : `#${channel.name}`;
      let buttonText = channel.dm_channel ? "Join Chat" : "Join Channel";
      return (
        <div className="channel-preview-panel">
          <h1>You are viewing {channel.dm_channel ? "your chat with " : ""} <strong>{channelName}</strong> </h1>
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
        <div id="message-form-container" className={this.props.messageBody ? "editor" : ""} >
          <div id="message-box">
            <div id="message-form" onMouseUp={this.updateToolbarState} onClick={() => {setTimeout(() => this.focusInput(), 0)}}>
              <div id="chat-toolbar" className={this.state.formatBar ? "" : "hidden"} onMouseDown={e => e.preventDefault()}>
                <div 
                  className={`toolbar-button fa fa-bold fa-fw ${bold ? "selected" : ""}`}
                  aria-hidden="true" 
                  onMouseDown={e => e.preventDefault()} 
                  onClick={this.format('bold')}>
                    <div className="black-popup">
                      <div>Bold</div>
                      <div className="buttons">
                        <div>Ctrl</div>
                        <div>B</div>
                      </div>
                    </div>
                  </div>
                <div 
                  className={`toolbar-button fa fa-italic fa-fw ${italic ? "selected" : ""}`}
                  aria-hidden="true" 
                  onMouseDown={e => e.preventDefault()} 
                  onClick={this.format('italic')}>
                    <div className="black-popup">
                      <div>Italic</div>
                      <div className="buttons">
                        <div>Ctrl</div>
                        <div>I</div>
                      </div>
                    </div>
                  </div>
                <div 
                  className={`toolbar-button fa fa-underline fa-fw ${underline ? "selected" : ""}`}
                  aria-hidden="true" 
                  onMouseDown={e => e.preventDefault()} 
                  onClick={this.format('underline')}>
                    <div className="black-popup">
                      <div>Underline</div>
                      <div className="buttons">
                        <div>Ctrl</div>
                        <div>U</div>
                      </div>
                    </div>
                  </div>
                <div 
                  className={`toolbar-button fa fa-strikethrough fa-fw ${strikethrough ? "selected" : ""}`}
                  aria-hidden="true" 
                  onMouseDown={e => e.preventDefault()} 
                  onClick={this.format('strikethrough')}>
                    <div className="black-popup">
                      <div>Strikethrough</div>
                      <div className="buttons">
                        <div>Ctrl</div>
                        <div>Shift</div>
                        <div>X</div>
                      </div>
                    </div>
                  </div>
                <div className="toolbar-divider"></div>
                <div 
                  className={`toolbar-button fa fa-link fa-fw ${createLink ? "selected" : ""}`} 
                  aria-hidden="true" 
                  onClick={this.toggleLinkForm(true)}>
                    <div className="black-popup">
                      <div>Link</div>
                      <div className="buttons">
                        <div>Ctrl</div>
                        <div>L</div>
                      </div>
                    </div>
                  </div>
                <div className="toolbar-divider"></div>
                <div 
                  className={`toolbar-button fa fa-list fa-fw ${insertUnorderedList ? "selected" : ""}`}
                  aria-hidden="true" 
                  onMouseDown={e => e.preventDefault()} 
                  onClick={this.format('insertUnorderedList')}>
                    <div className="black-popup">
                      <div>Unordered List</div>
                      <div className="buttons">
                        <div>Ctrl</div>
                        <div>Shift</div>
                        <div>5</div>
                      </div>
                    </div>
                  </div>
                <div 
                  className={`toolbar-button fa fa-list-ol fa-fw ${insertOrderedList ? "selected" : ""}`}
                  aria-hidden="true" 
                  onMouseDown={e => e.preventDefault()} 
                  onClick={this.format('insertOrderedList')}>
                    <div className="black-popup">
                      <div>Ordered List</div>
                      <div className="buttons">
                        <div>Ctrl</div>
                        <div>Shift</div>
                        <div>6</div>
                      </div>
                    </div>
                  </div>
              </div>
              <div id="chat-input" 
                contentEditable 
                dangerouslySetInnerHTML={{__html: this.props.messageBody ? this.props.messageBody : ""}}
                onKeyDown={this.handleChatKeyDown}
                ref={this.chatInput}>
              </div>
              { this.renderFilesList() }
              <div id="chat-footer" onMouseDown={e => e.preventDefault()}>
                {/* <div className="toolbar-button fa fa-upload fa-fw"></div>
                <div className="toolbar-divider"></div> */}
                <div className="toolbar-button fas fa-upload fa-fw" onClick={() => document.getElementById("message-file-input").click()}>
                  <input 
                    type="file" 
                    id="message-file-input"
                    onChange={this.readFile}
                    className="hidden">
                  </input>
                  <div className="black-popup">
                    <div>Upload file</div>
                  </div>
                </div>
                <div className="toolbar-divider"></div>
                <div className="toolbar-button" onMouseDown={e => { e.preventDefault(); document.getElementById("chat-toolbar").classList.toggle("hidden"); }}>
                  Aa
                  <div className="black-popup">
                    <div>Hide formatting</div>
                  </div>
                </div>
                <div className="toolbar-divider"></div>
                <div className="toolbar-button" onMouseDown={e => e.preventDefault()} onClick={this.format("insertHTML", '\u{1F4AF}')}>{'\u{1F4AF}'}</div>
                <div className="toolbar-button" onMouseDown={e => e.preventDefault()} onClick={this.format("insertHTML", '\u{1F44D}')}>{'\u{1F44D}'}</div>
                <div className="toolbar-button" onMouseDown={e => e.preventDefault()} onClick={this.format("insertHTML", '\u{1F642}')}>{'\u{1F642}'}</div>
                <div className="toolbar-button" onMouseDown={e => e.preventDefault()} onClick={this.format("insertHTML", '\u{1F602}')}>{'\u{1F602}'}</div>
                <div className="toolbar-button" onMouseDown={e => e.preventDefault()} onClick={this.format("insertHTML", '\u{1F60D}')}>{'\u{1F60D}'}</div>
                <div className="toolbar-button" onMouseDown={e => e.preventDefault()} onClick={this.format("insertHTML", '\u{1F622}')}>{'\u{1F622}'}</div>
                <div className="toolbar-button" onMouseDown={e => e.preventDefault()} onClick={this.format("insertHTML", '\u{1F620}')}>{'\u{1F620}'}</div>
                { this.renderMessageSend() }
              </div>
            </div>
            { this.renderMessageFooter() }
          </div>
          { this.renderLinkForm() }
        </div>
      )
  }
}

export default withRouter(ChannelMessageForm);