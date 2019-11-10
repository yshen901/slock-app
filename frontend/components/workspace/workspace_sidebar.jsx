import React from 'react';
import { Link } from 'react-router-dom';

class WorkspaceSidebar extends React.Component {
  constructor() {
    super();

    this.logout = this.logout.bind(this);
    this.channelLink = this.channelLink.bind(this);
  }

  logout() {
    this.props.logout()
      .then(
        () => this.props.history.push('/')
      )
  }

  channelLink(channelId) {
    return `/workspace/${this.props.workspace_address}/${channelId}`
  }

  render() {
    return (
      <div id="workspace-sidebar">

        <div id="workspace-sidebar-nav">
          <h2>{this.props.workspace_address}</h2>
          <h6>&#9673; {this.props.user.email}</h6>
          <button onClick={this.logout}>Log Out</button>
        </div>

        <div id="channels">
          <div className='sidebar-header'>
            <div className='sidebar-header-link' onClick={() => this.props.toggle("channelBrowse")}>Channels</div>
            <div className='sidebar-header-button' onClick={() => this.props.toggle("channelNew")}>+</div>
          </div>
          <div className="sidebar-list">
            {this.props.channels.map((channel, idx) => (
              <Link key={idx} className="sidebar-item" to={this.channelLink(channel.id)}># {channel.name}</Link>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default WorkspaceSidebar;