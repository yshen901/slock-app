import React from 'react';
import { toggleElements, hideElements, focus } from '../../util/modal_api_util';

class ChannelNav extends React.Component {
  constructor(props) {
    super(props);

    this.leaveButton = this.leaveButton.bind(this);
    this.star = this.star.bind(this);
    this.starClick = this.starClick.bind(this);
    this.toggleElements = this.toggleElements.bind(this);
  }

  getDmChannelName() {
    let { user, users, channel } = this.props;
    let ids = Object.keys(channel.users);

    let userId = ids[0]
    if (ids[0] == user.id) 
      userId = ids[1]

    let icon = <i className="fas fa-circle inactive-circle"></i>
    if (users[userId].logged_in)
      icon = <i className="fas fa-circle active-circle-dark"></i>

    return (
      <div className="channel-name">
        {icon} 
        <div>
          {users[userId].email}
        </div>
      </div>
    )
  }

  getChannelName(name) {
    return (
      <div className="channel-name">
        <div>
          #&nbsp;{name}
        </div>
      </div>
    )
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
      <div></div>
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

      // Hides all dropdown elements once another modal is toggled
      if (!className.includes("dropdown")) {
        hideElements("dropdown");
      }
    }
  }

  left() {
    let {name, description, users, dm_channel} = this.props.channel

    if (!dm_channel) 
      return (
        <div id="left">
          <div id="left-top">{this.getChannelName(name)}</div>
          <div id="left-bottom">
            {this.star()} 
            <div className="channel-nav-divider">|</div>
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
          <div id="left-top"> {this.getDmChannelName()} </div>
          <div id="left-bottom">
            <div id="topic" onClick={this.toggleElements("edit-channel-topic-modal", "channel-topic-input")}>
              <i className='fas fas fa-pen'></i>
              <div> { description ? description : "Add a note" } </div>
            </div>
          </div>
        </div>
      )
  }

  leaveButton() {
    if (this.props.status.canLeave) {
      if (!this.props.channel.dm_channel)
        return (
          <div className="channel-nav-button" onClick={this.props.leaveChannel}>Leave Channel</div>
        )
      else
        return (
          <div className="channel-nav-button" onClick={this.props.leaveChannel}>Leave Chat</div>
        )
    }
  }

  render() {
    if (this.props.channel) {
      let { name, description } = this.props.channel;
      return (
        <div id="channel-nav">
          { this.left() }
          <div id="right">
            {/* <div className="settings-button" onClick={(e) => {e.stopPropagation(); toggleElements("dropdown channel-settings")}}>&#9881;</div> */}
            {this.leaveButton()}
          </div>
        </div>
      )
    } else {
      return (<div id="channel-nav"></div>)
    }
  }
}

export default ChannelNav;