import React from 'react';
import { withRouter } from 'react-router-dom';
import { hideElements, revealElements } from '../../util/modal_api_util';

class BrowseChannelModal extends React.Component {
  constructor() {
    super();

    this.switchForm = this.switchForm.bind(this);
    this.goToChannel = this.goToChannel.bind(this);

    this.myChannels = this.myChannels.bind(this);
    this.otherChannels = this.otherChannels.bind(this);
  }

  switchForm() {
    hideElements("full-modal channel-modal");
    revealElements("new-channel-modal");
  }

  goToChannel(channel_id) {
    hideElements("full-modal channel-modal")
    let workspace_address = this.props.match.params.workspace_address;
    this.props.history.push(`/workspace/${workspace_address}/${channel_id}`);
  }

  myChannels() {
    let { channels } = getState().entities;
    let user_channels = Object.keys(getState().session.user_channels);

    if (user_channels.length > 0)
    return (
      <div>
        <h1 className="full-modal-section-header">Channels you belong to</h1>
        {user_channels.map((id, idx) => {
          return <div className="full-modal-item" key={idx} 
                      onClick={() => this.goToChannel(id)}># {channels[id].name}</div>
        })}
      </div>
    )
  }

  otherChannels() {
    let { channels } = getState().entities;
    let { user_channels } = getState().session;
    let other_channels = Object.keys(channels).filter((id) => !user_channels[id] )

    if (other_channels.length > 0)
      return (
        <div>
          <h1 className="full-modal-section-header">Channels you can join</h1>
          {other_channels.map((id, idx) => {
            return <div className="full-modal-item" key={idx}
              onClick={() => this.goToChannel(id)}># {channels[id].name}</div>
          })}
        </div>
      )
  }
  
  render() {
    return (
      <div className="full-modal channel-modal hidden" onClick={e => e.stopPropagation()}>
        <div className="full-modal-button" onClick={ () => hideElements("full-modal channel-modal") }>&#10005;</div>
        <div className="full-modal-content">
          <div className="full-modal-header">
            <h1 className="full-modal-header-text">Browse Channels</h1>
            <div className="full-modal-header-button" onClick={this.switchForm}>Create Channel</div>
          </div>
          <div className="full-modal-list">
            { this.otherChannels() }
            { this.myChannels() }
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(BrowseChannelModal);