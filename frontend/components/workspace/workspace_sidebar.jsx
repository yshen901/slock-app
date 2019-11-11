import React from 'react';
import { Link } from 'react-router-dom';

class WorkspaceSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.channelLink = this.channelLink.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  logout() {
    this.props.logout()
      .then(
        () => this.props.history.push('/')
      );
  }

  channelLink(channelId) {
    return `/workspace/${this.props.workspace_address}/${channelId}`;
  }

  handleClick(type) {
    return (e) => {
      e.stopPropagation();
      this.props.open(type);
    }
  }

  render() {
    return (
      <div id="workspace-sidebar">

        <div id="workspace-sidebar-nav" onClick={(e) => {e.stopPropagation(); this.props.toggle("sidebarDropdown");}}>
          <h2>{this.props.workspace_address}</h2>
          <h6>&#9673; {this.props.user.email}</h6>
        </div>

        <div id="channels">
          <div className='sidebar-header'>
            <div className='sidebar-header-link' onClick={this.handleClick("channelBrowse")}>Channels</div>
            <div className='sidebar-header-button' onClick={this.handleClick("channelNew")}>+</div>
          </div>
          <div className="sidebar-list">
            {this.props.channels.map(
              (channel, idx) => {
                if (channel.id === this.props.channel_id)
                  return (<Link key={idx} className="sidebar-item selected" to={this.channelLink(channel.id)}># {channel.name}</Link>);
                else
                  return (<Link key={idx} className="sidebar-item" to={this.channelLink(channel.id)}># {channel.name}</Link>);
              }
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default WorkspaceSidebar;