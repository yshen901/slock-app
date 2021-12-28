import React from "react";
import { withRouter } from "react-router";
import { toggleElements } from "../../../util/modal_api_util";

class ChannelBrowser extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      search: ""
    }

    this.goToChannel = this.goToChannel.bind(this);
    this.update = this.update.bind(this);

    this.myChannels = this.myChannels.bind(this);
    this.otherChannels = this.otherChannels.bind(this);
    this.allChannels = this.allChannels.bind(this);
  }

  allChannels(searchString) {
    let channelsDisplay = [];
    let myChannels = this.myChannels(searchString);
    let otherChannels = this.otherChannels(searchString);

    if (otherChannels.length > 0)
      channelsDisplay.push(
        <div key={0}>
          <h1 className="full-modal-section-header">Channels you can join</h1>
          {otherChannels}
        </div>
      )

    if (myChannels.length > 0)
      channelsDisplay.push(
        <div key={1}>
          <h1 className="full-modal-section-header">Channels you belong to</h1>
          {myChannels}
        </div>
      )
    
    return [channelsDisplay, myChannels.length + otherChannels.length];
  }

  update(e) {
    this.setState({search: e.currentTarget.value});
  }

  goToChannel(channel_id) {
    let workspace_address = this.props.match.params.workspace_address;
    this.props.history.push(`/workspace/${workspace_address}/${channel_id}`);
  }

  myChannels(searchString) {
    let { channels } = getState().entities;
    let { user_channels } = getState().session;
    let my_channels = Object.keys(user_channels).filter((id) => !channels[id].dm_channel);

    let channel_name;
    let displayed_channels = [];
      for (let i = 0; i < my_channels.length; i++) {
        channel_name = channels[my_channels[i]].name;
        if (searchString.length === 0 || channel_name.startsWith(searchString))
          displayed_channels.push(<div className="full-modal-item" key={i} onClick={() => this.goToChannel(my_channels[i])}># {channel_name}</div>)
      }

    return displayed_channels;
  }

  otherChannels(searchString) {
    let { channels } = getState().entities;
    let { user_channels } = getState().session;
    let other_channels = Object.keys(channels).filter((id) => !user_channels[id] && !channels[id].dm_channel )
    
    let channel_name;
    let displayed_channels = [];
    if (other_channels.length > 0)
      for (let i = 0; i < other_channels.length; i++) {
        channel_name = channels[other_channels[i]].name;
        if (searchString.length === 0 || channel_name.startsWith(searchString))
          displayed_channels.push(<div className="full-modal-item" key={i+2000} onClick={() => this.goToChannel(other_channels[i])}># {channel_name}</div>)
      }
    
    return displayed_channels;
  }

  render() {
    let [allChannels, numChannels] = this.allChannels(this.state.search);
    return (
      <div className="browser-channel">
        <div className="browser-channel-top">
          <div className="browser-channel-nav">
            <h1 className="browser-channel-title">Channel browser</h1>
            <div className="browser-channel-action" onClick={() => toggleElements("new-channel-modal")}>Create Channel</div>
          </div>
          <div className="browser-channel-search">
            <i className='fas fa-search search-icon'></i> 
            <input type="text" id="search-bar"
              onChange={this.update}
              value={this.state.search}
              placeholder="Search by name"
              autoFocus/>
          </div>
          <h1 className="browser-channel-header">{numChannels} {this.state.search ? (numChannels == 1 ? "result" : "results") : "recommended results"}</h1>
        </div>
        <div className="browser-channel-content">
          <div className="browser-channel-list">
            { allChannels }
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(ChannelBrowser);