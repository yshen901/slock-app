import React from 'react';
import { Link } from 'react-router-dom';
import { toggleElements, focus, hideElements } from '../../util/modal_api_util';
import { workspaceTitle } from '../../selectors/selectors'

class WorkspaceSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.channelLink = this.channelLink.bind(this);
    this.toggleElements = this.toggleElements.bind(this);

    this.starred = this.starred.bind(this);
    this.getChannels = this.getChannels.bind(this);
  }

  channelLink(channelId) {
    return `/workspace/${this.props.workspace_address}/${channelId}`;
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

  getDmChannelName(channel) {
    let { user, users } = this.props;
    let ids = Object.keys(channel.users);

    let userId = ids[0]
    if (ids[0] == user.id) 
      userId = ids[1]

    let icon = <i className="fas fa-circle inactive-circle"></i>
    if (users[userId].logged_in)
      icon = <i className="fas fa-circle active-circle-light"></i>

    return (
      <div className="channel-name">
        {icon} 
        <div>
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
            if (channel.id === channel_id)
              // TODO: SEPARATE THE 
              return (<Link key={idx} className="sidebar-item selected" to={this.channelLink(channel.id)}># &nbsp;{channel.name}</Link>);
            else
              return (<Link key={idx} className="sidebar-item" to={this.channelLink(channel.id)}># &nbsp;{channel.name}</Link>);
          })}
        </div>
      )
  }

  render() {
    let { channel_id } = this.props.match.params;

    if (this.props.user) 
      return (
        <div id="workspace-sidebar">
          <div id="workspace-sidebar-nav" onClick={ this.toggleElements("dropdown sidebar") }>
            <h2>{workspaceTitle(this.props.workspace_address)} <i className="fa fa-chevron-down"> </i></h2>
            <h6>{this.props.user.email}</h6>
          </div>

          { this.starred() }

          <div id="channels">
            <div className='sidebar-header'>
              <div className='sidebar-header-link hoverable' onClick={ this.toggleElements("full-modal channel-modal", "channel-search-bar") }>Channels</div>
              <div className='sidebar-header-button' onClick={ this.toggleElements("new-channel-modal", "new-channel-input") }>
                <i className="fas fa-plus-circle"></i>
              </div>
            </div>
            <div className="sidebar-list">
              {this.getChannels(false).map((channel, idx) => {
                if (channel.id === channel_id)
                  return (<Link key={idx} className="sidebar-item selected" to={this.channelLink(channel.id)}># &nbsp;{channel.name}</Link>);
                else
                  return (<Link key={idx} className="sidebar-item" to={this.channelLink(channel.id)}># &nbsp;{channel.name}</Link>);               
              })}
            </div>
          </div>

          <div id="channels">
            <div className='sidebar-header'>
              <div className='sidebar-header-link hoverable' onClick={ this.toggleElements("full-modal dm-channel-modal", 'dm-channel-search-bar') }>Direct Messages</div>
              <div className='sidebar-header-button' onClick={ this.toggleElements("full-modal dm-channel-modal") }>
                <i className="fas fa-plus-circle"></i>
              </div>
            </div>
            <div className="sidebar-list">
              {this.getChannels(false, true).map((channel, idx) => {
                if (channel.id === channel_id)
                  return (<Link key={idx} className="sidebar-item selected" to={this.channelLink(channel.id)}>{this.getDmChannelName(channel)}</Link>);
                else
                  return (<Link key={idx} className="sidebar-item" to={this.channelLink(channel.id)}>{this.getDmChannelName(channel)}</Link>);               
              })}
            </div>
          </div>

          <div className='sidebar-button'>
            <div className='sidebar-symbol'>&#x2b;</div>
            <div className='sidebar-action' onClick={this.toggleElements("invite-user-modal", "invite-user-input")}>Add People</div>
          </div>
        </div>
      )
      else 
        return <div id="workspace-sidebar"></div>
  }
}

export default WorkspaceSidebar;