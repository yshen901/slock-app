import React from 'react';
import { dmChannelUserId, photoUrl } from '../../selectors/selectors';
import { toggleFocusElements } from '../../util/modal_api_util';

class ChannelNav extends React.Component {
  constructor(props) {
    super(props);

    this.starClick = this.starClick.bind(this);
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

  getChannelName() {
    let { user, users, channel } = this.props;

    if (channel.dm_channel) {
      let userId = dmChannelUserId(channel, user.id);

      let icon = <i className="fas fa-circle inactive-circle"></i>
      if (users[userId].logged_in)
        icon = <i className="fas fa-circle active-circle-dark"></i>

      let profileImage = <div className="channel-nav-user-image">
        <img src={photoUrl(users[userId])}/>
      </div>

      return (
        <div className="channel-info" onClick={toggleFocusElements("channel-details-modal")}>
          <div className="channel-nav-user-icon">
            {profileImage}
            {icon}
          </div>
          <div className="channel-name">
            {users[userId].email}
          </div>
          <i className="fa fa-chevron-down"></i>
        </div>
      )
    }
    else {
      return (
        <div className="channel-info" onClick={toggleFocusElements("channel-details-modal")}>
          <div className="channel-name">
            #&nbsp;{channel.name}
          </div>
          <i className="fa fa-chevron-down"></i>
        </div>
      )
    }
  }

  left() {
    let { channel } = this.props;
    let { name, description, topic, users, dm_channel } = channel;

    if (!dm_channel) 
      return (
        <div id="left">
          {this.getChannelName()}
          <div id="topic" onClick={toggleFocusElements("edit-channel-topic-modal", "channel-topic-input")}>
            <div> { topic ? topic : "Add a topic" } </div>
          </div>
        </div>
      )
    else
      return (
        <div id="left">
            {this.getChannelName()} 
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
        <div id="channel-nav" className="no-highlight">
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