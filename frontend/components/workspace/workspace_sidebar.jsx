import React from 'react';
import { Link } from 'react-router-dom';
import { toggleElement } from '../../util/modal_api_util';

class WorkspaceSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.channelLink = this.channelLink.bind(this);
    this.toggleElement = this.toggleElement.bind(this);
  }

  logout() {
    this.props.logout()
      .then(
        () => this.props.history.push('/')
      )
  }

  channelLink(channelId) {
    return `/workspace/${this.props.workspace_address}/${channelId}`;
  }

  toggleElement(className) {
    return (e) => {
      e.stopPropagation();
      toggleElement(className);
    }
  }

  render() {
    return (
      <div id="workspace-sidebar">

        <div id="workspace-sidebar-nav" onClick={ this.toggleElement("dropdown sidebar") }>
          <h2>{this.props.workspace_address}</h2>
          <h6>&#9673; {this.props.user.email}</h6>
        </div>

        <div id="channels">
          <div className='sidebar-header'>
            <div className='sidebar-header-link' onClick={ this.toggleElement("full-modal channel-modal") }>Channels</div>
            <div className='sidebar-header-button' onClick={ this.toggleElement("new-channel-modal") }>+</div>
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