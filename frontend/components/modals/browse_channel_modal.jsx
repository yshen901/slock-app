import React from 'react';
import { withRouter } from 'react-router-dom';
import { hideElements, revealElements } from '../../util/modal_api_util';

class BrowseChannelModal extends React.Component {
  constructor() {
    super();

    this.state = {
      search: ""
    }

    this.switchForm = this.switchForm.bind(this);
    this.goToChannel = this.goToChannel.bind(this);
    this.update = this.update.bind(this);

    this.myChannels = this.myChannels.bind(this);
    this.otherChannels = this.otherChannels.bind(this);
    this.allChannels = this.allChannels.bind(this);
  }

  update(e) {
    this.setState({search: e.currentTarget.value});
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

  allChannels(searchString) {
    let channelsDisplay = [];
    let myChannels = this.myChannels(searchString);
    let otherChannels = this.otherChannels(searchString);

    if (otherChannels.length > 0)
      channelsDisplay.push(
        <div>
          <h1 className="full-modal-section-header">Channels you can join</h1>
          {otherChannels}
        </div>
      )

    if (myChannels.length > 0)
      channelsDisplay.push(
        <div>
          <h1 className="full-modal-section-header">Channels you belong to</h1>
          {myChannels}
        </div>
      )
    
    return channelsDisplay;
  }

  myChannels(searchString) {
    let { channels } = getState().entities;
    let user_channels = Object.keys(getState().session.user_channels);
    let displayed_channels = [];
    
    let channel_name;
    for (let i = 0; i < user_channels.length; i++) {
      channel_name = channels[user_channels[i]].name;
      if (searchString.length === 0 || channel_name.startsWith(searchString))
        displayed_channels.push(<div className="full-modal-item" onClick={() => this.goToChannel(user_channels[i])}># {channel_name}</div>)
    }

    return displayed_channels;
  }

  otherChannels(searchString) {
    let { channels } = getState().entities;
    let { user_channels } = getState().session;
    let other_channels = Object.keys(channels).filter((id) => !user_channels[id] )
    let displayed_channels = [];

    let channel_name;
    if (other_channels.length > 0)
      for (let i = 0; i < other_channels.length; i++) {
        channel_name = channels[other_channels[i]].name;
        if (searchString.length === 0 || channel_name.startsWith(searchString))
          displayed_channels.push(<div className="full-modal-item" onClick={() => this.goToChannel(other_channels[i])}># {channel_name}</div>)
      }
    
    return displayed_channels;
  }
  
  render() {
    return (
      <div className="full-modal channel-modal hidden" onClick={e => e.stopPropagation()}>
        <div className="full-modal-button" onClick={ () => { hideElements("full-modal channel-modal"); this.setState({ search: "" }); } }>&#10005;</div>
        <div className="full-modal-content">
          <div className="full-modal-header">
            <h1 className="full-modal-header-text">Browse Channels</h1>
            <div className="full-modal-header-button" onClick={this.switchForm}>Create Channel</div>
          </div>
          <div className="full-modal-search-bar">
            <i className='fas fa-search search-icon'></i> 
            <input type="text" id="channel-search-bar"
              onChange={this.update}
              value={this.state.search}
              placeholder="Search channels"/>
          </div>
          <div className="full-modal-list">
            { this.allChannels(this.state.search) }
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(BrowseChannelModal);