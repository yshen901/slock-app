import React from 'react';
import { photoUrl } from '../../selectors/selectors';
import { toggleElements, hideElements, focus } from '../../util/modal_api_util';

class ChannelNav extends React.Component {
  constructor(props) {
    super(props);

    this.star = this.star.bind(this);
    this.starClick = this.starClick.bind(this);
    this.toggleElements = this.toggleElements.bind(this);
  }

  starClick(e) {
    let { channel } = this.props;
    this.props.updateChannelUser({ starred: !channel.starred, channel_id: channel.id })
      .then(
        () => this.setState(this.state)
      )
  }

  star() {
    let {channel} = this.props
    if (channel.name === "general" || channel.dm_channel)
      return null
    else if (this.props.channel.starred)
      return (
        <div id="star filled hidden" onClick={this.starClick}>
          <i className='fas fa-star'></i>
        </div>
      )
    else
      return(
        <div id = "star empty" onClick={this.starClick}>
          <i className='far fa-star' ></i>
        </div >
      )
  }

  toggleElements(className, inputId) {
    return (e) => {
      e.stopPropagation();
      toggleElements(className);
      focus(inputId)
    }
  }

  getChannelName() {
    let { user, users, channel } = this.props;

    if (channel.dm_channel) {
      let ids = Object.keys(channel.users);

      let userId = ids[0]
      if (ids[0] == user.id) 
        userId = ids[1]

      let icon = <i className="fas fa-circle inactive-circle"></i>
      if (users[userId].logged_in)
        icon = <i className="fas fa-circle active-circle-dark"></i>

      let profileImage = <div className="channel-nav-user-image">
        <img src={photoUrl(users[userId])}/>
      </div>

      return (
        <div className="channel-info">
          <div className="channel-nav-user-icon">
            {profileImage}
            {icon}
          </div>
          <div className="channel-name">
            {users[userId].email}
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="channel-info">
          <div className="channel-name">
            #&nbsp;{channel.name}
          </div>
        </div>
      )
    }
  }

  left() {
    let { channel } = this.props;
    let { name, description, users, dm_channel } = channel;

    if (!dm_channel) 
      return (
        <div id="left">
          <div id="left-top">{this.getChannelName()}</div>
          <div id="left-bottom">
            {this.star()} 
            <div id="members">
              <i className="material-icons">person_outline</i>
              <div>
                { Object.keys(users).length }
              </div>
            </div>
            <div className="channel-nav-divider">|</div> 
            <div id="topic" onClick={this.toggleElements("edit-channel-topic-modal", "channel-topic-input")}>
              <i className='fas fas fa-pen'></i>
              <div> { description ? description : "Add a topic" } </div>
            </div>
          </div>
        </div>
      )
    else
      return (
        <div id="left">
          <div id="left-top"> {this.getChannelName()} </div>
          {/* <div id="left-bottom">
            <div id="topic" onClick={this.toggleElements("edit-channel-topic-modal", "channel-topic-input")}>
              <i className='fas fas fa-pen'></i>
              <div> { description ? description : "Add a note" } </div>
            </div>
          </div> */}
        </div>
      )
  }

  right() {
    let leaveButton, videoCallButton;
    let {workspace_address, channel_id, startVideoCall} = this.props;

    if (this.props.status.canLeave) {
      if (!this.props.channel.dm_channel) {
        leaveButton = (
          <div className="channel-nav-button" onClick={this.props.leaveChannel}>Leave Channel</div>
        );
        videoCallButton = "";
      }
      else {
        leaveButton = (
          <div className="channel-nav-button" onClick={this.props.leaveChannel}>Leave Chat</div>
        );

        if (this.props.inVideoCall)
          videoCallButton = (
            <div className="channel-nav-button"> In Video Call </div>
          );       
        else
          videoCallButton = (
            <div className="channel-nav-button" 
              onClick={() => startVideoCall(workspace_address, channel_id)}>Start Video Call</div>
          );
      }
    }

    return (
      <div className="right">
        {videoCallButton}
        {leaveButton}
      </div>
    )
  }

  render() {
    if (this.props.channel) {
      return (
        <div id="channel-nav">
          { this.left() }
          { this.right() }
        </div>
      )
    } else {
      return (<div id="channel-nav"></div>)
    }
  }
}

export default ChannelNav;