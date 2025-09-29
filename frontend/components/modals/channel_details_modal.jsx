import React from 'react';
import { DEFAULT_PHOTO_URL, dmChannelUserId, getFileTypeInfo, getLocalTime, getUserActivity, getUserName, userInSearch } from '../../selectors/selectors';
import { hideElements, toggleFocusElements } from '../../util/modal_api_util';
import UserPopupModal from "./user_popup_modal";

import { withRouter } from "../../withRouter"

class ChannelDetailsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: "About",
      search: "",
      popupUserId: 0,
      popupUserTarget: null
    }

    this.starClick = this.starClick.bind(this);
    this.userClick = this.userClick.bind(this);
    this.leaveChannel = this.leaveChannel.bind(this);
    this.toggleHide = this.toggleHide.bind(this);
    this.calculatePos = this.calculatePos.bind(this);
  }

  toggleHide(e) {
    e.stopPropagation();
    this.setState({tab: "About", search: ""});
    hideElements("channel-details-modal");
  }

  userClick(userId) {
    return (e) => {
      e.stopPropagation();
      this.setState({ popupUserId: userId, popupUserTarget: e.currentTarget });
    }
  }

  starClick(e) {
    let { channel } = this.props;

    if (channel.dm_channel)
      this.props.updateDmChannelUser({ channel_id: channel.id, starred: !channel.starred })
    else
      this.props.updateChannelUser({ starred: !channel.starred, channel_id: channel.id })
        .then(
          () => this.setState(this.state)
        );
  }

  star() {
    let {channel} = this.props;
    if (channel.starred)
      return (
        <div className='channel-details-button' id="star filled hidden" onClick={this.starClick}>
          <i className='fas fa-star'></i>
        </div>
      );
    else
      return(
        <div className='channel-details-button' id="star empty" onClick={this.starClick}>
          <i className='far fa-star'></i>
        </div >
      );
  }

  leaveChannel() {
    return e => {
      this.props.leaveChannel(e);
      hideElements("channel-details-modal");
    }
  }

  leaveSection() {
    if (this.props.canLeave)
     return (
       <div>
        <div className="horizontal-divider"></div>
        <div className="section" onClick={this.leaveChannel()}>
          <div className="section-header">
            <div className="section-name magenta bold-700">Leave Channel</div>
          </div>
        </div>
       </div>
     )
  }

  renderUserPopup() {
    let { users, showUser } = this.props;
    let { popupUserId } = this.state; 

    if (popupUserId)
      return (
        <UserPopupModal 
          user={users[popupUserId]} 
          hidePopup={() => { this.setState({popupUserId: 0}); hideElements("channel-details-modal"); } }
          showUser={showUser}
          startVideoCall={this.props.startVideoCall}
          calculatePos={this.calculatePos}/>
      )
  }

  // offsetTop is from its parent, rather than from the top
  // must add parent offsetTop to make up for this
  calculatePos() {
    let { popupUserTarget } = this.state;
    let viewHeight = $(window).innerHeight();
    let top = popupUserTarget.offsetTop + popupUserTarget.offsetParent.offsetTop + popupUserTarget.offsetHeight;
    if (top > viewHeight - 520)
      top = viewHeight - 520; 

    return {
      top,
      left: "calc(50vw - 290px + 28px)"
    };
  }

  // Deletes a file from a message
  toggleFileDelete(fileId, messageId) {
    return (e) => {
      if (e) e.preventDefault();

      let message = this.props.messages[messageId];
      if (message) {
        if (message.files.length > 1 || message.body != "")
          this.props.updateMessage({
            deleted_file_id: fileId,
            id: message.id
          });
        else
          this.props.deleteMessage({id: message.id})
            .then(
              ({message}) => {
                this.props.messageACChannel.speak({message_data: {type: "DELETE", id: message.id, user_id: message.user_id}});
              }
            );
      }
    }
  }

  // Renders all files in the channel
  channelFiles() {
    let files = [];
    let messages = Object.values(this.props.messages);
    let fileTypeInfo; 

    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].files.length > 0) {
        files = files.concat(messages[i].files);
      }
    }

    if (files.length > 0) {
      return (
        <div className="channel-files-list">
          { files.map((file, i) => {
            fileTypeInfo = getFileTypeInfo(file);
            if (fileTypeInfo.iconSymbol == "image") { // irrelevant as we are currently using icons
              return (
                <div className="file" key={i}>
                  <div className="file-icon">
                    <img src={file.url} loading="lazy"/>
                  </div>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-type">{fileTypeInfo.name}</div>
                  </div>
                  <div className="file-buttons">
                    <div className="far fa-trash-alt fa-fw" onClick={this.toggleFileDelete(file.id)}>
                      <div className="black-popup">
                        <div>Delete</div>
                      </div>
                    </div>
                    <a className="fas fa-cloud-download-alt fa-fw" href={file.url} target="_blank">
                      <div className="black-popup">
                        <div>Download</div>
                      </div>
                    </a>
                  </div>
                </div>
              );
            }
            else {
              return (
                <div className="file" key={i}>
                  <div className={`file-icon ${fileTypeInfo.iconSymbol} ${fileTypeInfo.iconBackground}`}></div>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-type">{fileTypeInfo.name}</div>
                  </div>
                  <div className="file-buttons">
                    <div className="file-button far fa-trash-alt fa-fw" onClick={this.toggleFileDelete(file.id)}>
                      <div className="black-popup">
                        <div>Delete</div>
                      </div>
                    </div>
                    <a className="file-button fas fa-cloud-download-alt fa-fw" href={file.url} target="_blank">
                      <div className="black-popup">
                        <div>Download</div>
                      </div>
                    </a>
                  </div>
                </div>
              );
            }
          })}
        </div>
      );
    }
    else {
      return (
        <div className="section-content">
          There aren’t any files to see here right now. But there could be — upload
          any file by clicking the upload button on the chat form.
        </div>
      )
    }
  }
  
  channelTabContent() {
    let { channel, channel_users, current_user_id } = this.props;
    let { search } = this.state;

    switch(this.state.tab) {
      case "About": // all of the channel's information
        return (
          <div className="tab-content">
            <div className="block">
              <div className="section" onClick={toggleFocusElements("edit-channel-name-modal", "channel-name-input")}>
                <div className="section-header">
                  <div className="section-name">Channel name</div>
                  <div className="section-edit" onClick={toggleFocusElements("edit-channel-name-modal", "channel-name-input")}>Edit</div>
                </div>
                <div className="section-content">
                  #&nbsp;{ channel.name }
                </div>
              </div>
            </div>
            <div className="block">
              <div className="section" onClick={toggleFocusElements("edit-channel-topic-modal", "channel-topic-input")}>
                <div className="section-header">
                  <div className="section-name">Topic</div>
                  <div className="section-edit" onClick={toggleFocusElements("edit-channel-topic-modal", "channel-topic-input")}>Edit</div>
                </div>
                <div className={channel.topic ? "section-content" : "section-content gray"}>
                  { channel.topic ? channel.topic : "Add a topic" }
                </div>
              </div>
              <div className="horizontal-divider"></div>
              <div className="section" onClick={toggleFocusElements("edit-channel-description-modal", "channel-description-input")}>
                <div className="section-header">
                  <div className="section-name">Description</div>
                  <div className="section-edit" onClick={toggleFocusElements("edit-channel-description-modal", "channel-description-input")}>Edit</div>
                </div>
                <div className={channel.description ? "section-content" : "section-content gray"}>
                  { channel.description ? channel.description : "Add a description" }
                </div>
              </div>              
              <div className="horizontal-divider"></div>
              <div className="section">
                <div className="section-header">
                  <div className="section-name">Created on</div>
                </div>
                <div className="section-content">
                  { new Date(channel.created_at).toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"}) }
                </div>
              </div>
              { this.leaveSection() }
            </div>
            <div className="block">
              <div className="section files">
                <div className="section-header">Files</div>
                { this.channelFiles() }
              </div>
            </div>
          </div>
        )
      case "Members": // search bar with members list
        return (
          <div className="tab-content members">
            <div className="search-bar">
              <i className='fas fa-search search-icon gray'></i> 
              <input type="text"
                onChange={e => this.setState({search: e.currentTarget.value})}
                value={this.state.search}
                placeholder="Find members"
                autoFocus/>
            </div>
            <div className="members-list">
              { channel_users.map((channel_user, idx) => {
                if (!userInSearch(channel_user, search)) return;
                return (
                  <div className="member" key={idx} onClick={this.userClick(channel_user.id)}>
                    <div className="member-icon">
                      <img src={channel_user.photo_url ? channel_user.photo_url : DEFAULT_PHOTO_URL}/>
                    </div>
                    <div className="member-name">
                      {getUserName(channel_user)} {channel_user.id == current_user_id ? "(you)" : ""}
                    </div>
                    <div className="member-status">
                      <i className={getUserActivity(channel_user)}></i>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      default: 
        return (
          <div className="tab-content"></div>
        )
    }
  }

  dmTabContent() {
    let { channel, users, current_user_id } = this.props;
    let otherUser = users[dmChannelUserId(channel, current_user_id)];

    switch(this.state.tab) {
      case "About":
        return (
          <div className="tab-content">
            <div className="block">
              <div className="section">
                <div className="section-content dm">
                  <i className="far fa-clock"></i>
                  <div>{getLocalTime(otherUser)} local time</div>
                </div>
                <div className="section-content dm">
                  <i className="far fa-envelope"></i>
                  <div>{otherUser.email}</div>
                </div>
                <div className="section-link dm" onClick={(e)=> { this.props.showUser(otherUser.id); this.toggleHide(e); }}>View full profile</div>
              </div>
            </div>
            <div className="block">
              <div className="section files">
                <div className="section-header">Files</div>
                { this.channelFiles() }
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="tab-content"></div>
        )
    }
  }

  render() {
    let { channel, users, current_user_id, workspace_address, startVideoCall } = this.props;

    if (!channel)
      return (
        <div className="channel-details-modal hidden"></div>
      )
    else if (channel.dm_channel) {
      let otherUser = users[dmChannelUserId(channel, current_user_id)];
      return (
        <div className="channel-details-modal hidden">
          <div className="part-modal-background" onClick={this.toggleHide}></div>
          <div className="channel-details">
            <div className="modal-header">
              <div className="title">
                <div className="title-image">
                  <img src={otherUser.photo_url}/>
                </div>
                <div>{getUserName(otherUser)}</div>
              </div>
              <div className="modal-close-button" onClick={this.toggleHide}>&#10005;</div>
            </div>
            <div className="buttons">
              {this.star()}
              <div className='channel-details-button' onClick={() => startVideoCall(workspace_address, channel.id)}>
                <i className="fas fa-video"></i>
                <div>Start a Call</div>
              </div >
            </div>
            <div className="tab-buttons">
              <div className={this.state.tab == "About" ? "selected" : ""} onClick={e => this.setState({tab: "About"})}>About</div>
            </div>
            { this.dmTabContent() }
          </div>
        </div>
      )
    }
    else
      return (
        <div className="channel-details-modal hidden">
          <div className="part-modal-background" onClick={this.toggleHide}></div>
          <div className="channel-details">
            <div className="modal-header">
              <div className="title">#&nbsp;{channel.name}</div>
              <div className="modal-close-button" onClick={this.toggleHide}>&#10005;</div>
            </div>
            <div className="buttons">
              {this.star()}
            </div>
            <div className="tab-buttons">
              <div className={this.state.tab == "About" ? "selected" : ""} onClick={e => this.setState({tab: "About", search: ""})}>About</div>
              <div className={this.state.tab == "Members" ? "selected" : ""} onClick={e => this.setState({tab: "Members"})}>Members</div>
            </div>
            { this.channelTabContent() }
          </div>
          {this.renderUserPopup()}
        </div>
      )
  }
}

export default withRouter(ChannelDetailsModal);