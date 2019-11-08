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
    return `/workspace/${this.props.match.params.workspace_id}/${channelId}`
  }

  render() {
    return (
      <div id="workspace-sidebar">

        <div id="workspace-sidebar-nav">
          <h2>{this.props.workspace.address}</h2>
          <h6>&#9673; {this.props.user.email}</h6>
          <button onClick={this.logout}>Log Out</button>
        </div>

        <div id="channels">
          <Link to="/tbd" className='sidebar-list-header'>Channels</Link>
          <div className="sidebar-list">
            {this.props.channels.map((channel, idx) => (
              <Link key={idx} className="sidebar-link" to={this.channelLink(channel.id)}># {channel.name}</Link>
            ))}
          </div>
        </div>
        <br/>
        <div className="sidebar-link" onClick={() => this.props.toggle("channel")}>+ Add a Channel</div>
      </div>
    )
  }
}

export default WorkspaceSidebar;