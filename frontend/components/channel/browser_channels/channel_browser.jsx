import React from "react";
import { withRouter } from "react-router";
import { joinChannel, leaveChannel } from "../../../actions/channel_actions";
import { toggleFocusElements } from "../../../util/modal_api_util";

class ChannelBrowser extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      search: ""
    }

    this.joinChannel = this.joinChannel.bind(this);
    this.leaveChannel = this.leaveChannel.bind(this);

    this.goToChannel = this.goToChannel.bind(this);
    this.update = this.update.bind(this);
  }

  leaveChannel(channel) {
    return (e) => {
      e.stopPropagation();

      if (channel.name !== "general") //PREVENTS ACTION (DOUBLE PRECAUTION)
        dispatch(leaveChannel(channel.id))
          .then(
            () => {
              this.props.loginACChannel.speak(
                {
                  channel_data: {
                    login: false,
                    user_id: getState().session.user_id,
                    channel_id: channel.id
                  }
                }
              );
            },
            null
          )
    }
  }

  joinChannel(channel) {
    return (e) => {
      e.stopPropagation();

      let { workspace_id } = getState().session;
      dispatch(joinChannel({channel_id: channel.id, workspace_id}))
        .then(
          () => {
            this.props.loginACChannel.speak(
              {
                channel_data: {
                  login: true,
                  user_id: getState().session.user_id,
                  channel_id: channel.id
                }
              }
            );
            this.props.history.push(`/workspace/${this.props.match.params.workspace_address}/${channel.id}`);
          }
        )
    }
  }

  channelsList(searchString) {
    let { user_id } = getState().session;
    let channels = Object.values(getState().entities.channels).filter((channel) => !channel.dm_channel);
    if (searchString)
      channels.sort((a, b) => a.name > b.name ? 1 : -1);

    let joined, numMembers, channelMembers, channelTopic, buttons;
    let divider = <i className="divider fas fa-circle"></i>;
    let channelStatus = (
      <div className="channel-status">
        <i className="fas fa-check"></i>
        <div>Joined</div>
      </div>
    );

    let displayed_channels = [];
    for (let i = 0; i < channels.length && i < 50; i++) {
      if (searchString.length === 0 || channels[i].name.includes(searchString)) {   
        numMembers = Object.keys(channels[i].users).length;
        joined = channels[i].users[user_id];

        channelMembers = <div className="channel-users">{numMembers} {numMembers == 1 ? "member" : "members"}</div>;
        channelTopic = channels[i].topic ? <div className="channel-topic">{channels[i].topic}</div> : "";
        buttons = (
          <div className="buttons" onClick={() => this.goToChannel(channels[i].id)}>
            <div className={ joined ? "hidden" : "button"}
              onClick={ this.joinChannel(channels[i]) }>
                View
            </div>
            <div 
              className={ joined ? "button" : "button green"}
              onClick={ joined ? this.leaveChannel(channels[i]) : this.joinChannel(channels[i]) }>
              { joined ? "Leave" : "Join"}
            </div>
          </div>
        );

        displayed_channels.push(
          <div className="browser-list-item" key={i} onClick={() => this.goToChannel(channels[i].id)}>
            <div className="channel-name"># {channels[i].name}</div>
            <div className="channel-details">
              { joined ? channelStatus : ""}
              { joined ? divider : ""}
              { channelMembers }
              { channelTopic ? divider : ""}
              { channelTopic }
            </div>
            { channels[i].name == "general" ? "" : buttons }
          </div>
        );
      }
    }
    
    return [displayed_channels, displayed_channels.length];
  }

  update(e) {
    this.setState({search: e.currentTarget.value});
  }

  goToChannel(channel_id) {
    let workspace_address = this.props.match.params.workspace_address;
    this.props.history.push(`/workspace/${workspace_address}/${channel_id}`);
  }

  render() {
    let [channelsList, numChannels] = this.channelsList(this.state.search);
    return (
      <div className="browser-channel">
        <div className="browser-channel-top">
          <div className="browser-channel-nav">
            <h1 className="browser-channel-title">Channel browser</h1>
            <div className="browser-channel-action no-highlight" onClick={toggleFocusElements("new-channel-modal", "new-channel-input")}>Create Channel</div>
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
            { channelsList }
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(ChannelBrowser);