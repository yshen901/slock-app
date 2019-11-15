import React from 'react';
import { Link } from 'react-router-dom';
import { toggleElements, focus } from '../../util/modal_api_util';
import { workspaceTitle } from '../../selectors/selectors'

class WorkspaceSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.channelLink = this.channelLink.bind(this);
    this.toggleElements = this.toggleElements.bind(this);
    this.renderChannels = this.renderChannels.bind(this);
  }

  channelLink(channelId) {
    return `/workspace/${this.props.workspace_address}/${channelId}`;
  }

  toggleElements(className, inputId) {
    return (e) => {
      e.stopPropagation();
      toggleElements(className);
      focus(inputId)
    }
  }

  renderChannels() {
    let { channels, user_channels, channel_id } = this.props;

    if (Object.keys(channels).length === 0) {
      return <div className="sidebar-list"></div>
    } else {
      let channelList = user_channels.map((id) => channels[id])
      return (
        <div className="sidebar-list">
          {channelList.map(
            (channel, idx) => {
              if (channel.id === channel_id)
              // TODO: SEPARATE THE 
                return (<Link key={idx} className="sidebar-item selected" to={this.channelLink(channel.id)}># &nbsp;{channel.name}</Link>);
              else
                return (<Link key={idx} className="sidebar-item" to={this.channelLink(channel.id)}># &nbsp;{channel.name}</Link>);
            }
          )}
        </div>
      )
    }
  }

  render() {
    //TODO2: FIGURE OUT A MORE ELEGANT WAY...LIKE PREVENT A RE-RENDER BEFORE THE REDIRECT AFTER LOGGING OUT
    if (this.props.user) 
      return (
        <div id="workspace-sidebar">

          <div id="workspace-sidebar-nav" onClick={ this.toggleElements("dropdown sidebar") }>
            <h2>{workspaceTitle(this.props.workspace_address)}</h2>
            <h6>&#9673;	&nbsp;{this.props.user.email}</h6>
          </div>

          <div id="channels">
            <div className='sidebar-header'>
              <div className='sidebar-header-link' onClick={ this.toggleElements("full-modal channel-modal", "channel-search-bar") }>Channels</div>
              <div className='sidebar-header-button' onClick={ this.toggleElements("new-channel-modal", "new-channel-input") }>
                <div id="cross">+</div>
              </div>
            </div>
            {this.renderChannels()}
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