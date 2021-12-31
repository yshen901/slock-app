import React from 'react';
import { Link } from 'react-router-dom';
import { photoUrl, workspaceTitle } from '../../selectors/selectors'
import { toggleFocusElements } from '../../util/modal_api_util';

class WorkspaceSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      channel: "",
      DM: ""
    }

    this.channelLink = this.channelLink.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);

    this.starred = this.starred.bind(this);
    this.getChannels = this.getChannels.bind(this);
  }

  channelLink(channelId) {
    return `/workspace/${this.props.workspace_address}/${channelId}`;
  }

  toggleDropdown(category) {
    return (e) => {
      e.stopPropagation();
      this.setState({ [category]: this.state[category] == "" ? "hidden" : "" })
    }
  }

  getDmChannelName(channel) {
    let { user, users } = this.props;
    let ids = Object.keys(channel.users);

    let userId = ids[0]
    if (ids[0] == user.id) 
      userId = ids[1]

    let icon = <i className="fas fa-circle inactive-circle"></i>
    if (users[userId].logged_in)
      icon = <i className="fas fa-circle active-circle-light"></i>

    let profileImage = <div className="workspace-sidebar-user-image">
      <img src={photoUrl(users[userId])}/>
    </div>

    return (
      <div className="dm-channel-info">
        <div className="workspace-sidebar-user-icon">
          {profileImage}
          {icon}
        </div>
        <div className="channel-name">
          {users[userId].email}
        </div>
      </div>
    )
  }

  getChannels(starStatus, dmStatus=false) {
    let { channels, user_channels, channel_id } = this.props;

    if (Object.keys(channels).length === 0) return []
    
    let filteredChannels = [];
    let channelList = user_channels.map((id) => channels[id])
    for (let i = 0; i < channelList.length; i++) {
      if (channelList[i].starred === starStatus && channelList[i].dm_channel == dmStatus) 
        filteredChannels.push(channelList[i])
    }

    return filteredChannels.sort((a, b) => a > b ? 1 : -1);
  }

  starred() {
    let starred = this.getChannels(true);
    let { channel_id } = this.props.match.params;
    if (starred.length > 0) 
      return (
        <div id="channels">
          <div className='sidebar-header'>
            <div className='sidebar-header-link'>Starred</div>
          </div>
          { starred.map((channel, idx) => {
            let channelClassName = channel.id == channel_id ? `sidebar-item indented selected` : `sidebar-item indented`;  
            return (
              <Link key={idx} className={channelClassName} to={this.channelLink(channel.id)}>
                <div className="sidebar-item-symbol">#</div>
                <div className="channel-name">{channel.name}</div>
              </Link>
            );
          })}
        </div>
      )
  }

  render() {
    let { channel_id } = this.props.match.params;

    if (this.props.user) 
      return (
        <div id="workspace-sidebar">
          <div id="workspace-sidebar-nav" onClick={ toggleFocusElements("dropdown-modal sidebar") }>
            <h2>{workspaceTitle(this.props.workspace_address)} <i className="fa fa-chevron-down"> </i></h2>
            {/* <h6>{this.props.user.email}</h6> */}
          </div>

          <div id="channels">
            <div className="sidebar-list">
              <Link className={channel_id == "channel-browser" ? "sidebar-item selected" : "sidebar-item"} to={this.channelLink("channel-browser")}>
                <i className="fab fa-slack-hash"></i>
                <div className="channel-name">
                  Channel browser
                </div>
              </Link>
              <Link className={channel_id == "people-browser" ? "sidebar-item selected" : "sidebar-item"} to={this.channelLink("people-browser")}>
                <i className="far fa-address-book"></i>
                <div className="channel-name">
                  People
                </div>
              </Link>
            </div>
          </div>

          { this.starred() }

          <div id="channels">
            <div className='sidebar-header'>
              <div className='sidebar-header-chevron' onClick={this.toggleDropdown("channel")}>
                {this.state.channel ? <i className="fas fa-caret-right"></i> : <i className="fas fa-caret-down"></i>}
              </div>
              <div className='sidebar-header-link hoverable' onClick={this.toggleDropdown("channel")}>Channels</div>
              <Link className='sidebar-header-button' to={this.channelLink("channel-browser")}>
                +
              </Link>
            </div>
            <div className="sidebar-list">
              {this.getChannels(false).map((channel, idx) => {
                let channelClassName = channel.id == channel_id ? `sidebar-item indented selected` : `sidebar-item indented ${this.state.channel}`;
                return (
                  <Link key={idx} className={channelClassName} to={this.channelLink(channel.id)}>
                    <div className="sidebar-item-symbol">#</div>
                    <div className="channel-name">{channel.name}</div>
                  </Link>
                );
              })}
              <Link className={`sidebar-item indented ${this.state.channel}`} to={this.channelLink("channel-browser")}>
                <div className="sidebar-item-symbol-box">
                  +
                </div>
                <div className="channel-name">Add channels</div>
              </Link>
            </div>
          </div>

          <div id="channels">
            <div className='sidebar-header'>
              <div className='sidebar-header-chevron' onClick={this.toggleDropdown("DM")}>
                {this.state.DM ? <i className="fas fa-caret-right"></i> : <i className="fas fa-caret-down"></i>}
              </div>
              <div className='sidebar-header-link hoverable' onClick={this.toggleDropdown("DM")}>Direct Messages</div>
              <Link className='sidebar-header-button' to={this.channelLink("people-browser")}>
                +
              </Link>
            </div>
            <div className="sidebar-list">
              {this.getChannels(false, true).map((channel, idx) => {
                let channelClassName = channel.id == channel_id ? `sidebar-item indented selected` : `sidebar-item indented ${this.state.DM}`;
                return (
                  <Link key={idx} className={channelClassName} to={this.channelLink(channel.id)}>
                    {this.getDmChannelName(channel)}
                  </Link>
                );
              })}
              <div className={`sidebar-item indented ${this.state.DM}`} onClick={toggleFocusElements("invite-user-modal", "invite-user-input")}>
                <div className="sidebar-item-symbol-box">
                  +
                </div>
                <div className="channel-name">Add teammates</div>
              </div>
            </div>
          </div>
        </div>
      )
      else 
        return <div id="workspace-sidebar"></div>
  }
}

export default WorkspaceSidebar;