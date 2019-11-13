import React from 'react';
import { withRouter } from 'react-router-dom';
import { joinChannel, leaveChannel } from '../../actions/channel_actions';

class ChannelActionsDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.button = this.button.bind(this);
    this.leaveChannel = this.leaveChannel.bind(this);
    this.joinChannel = this.joinChannel.bind(this);
  }

  joinChannel(e) {
    e.stopPropagation();
    let { channel_id } = this.props.match.params;
    dispatch(joinChannel(parseInt(channel_id)))
      .then(
        () => this.setState(this.state)
      )
  }

  leaveChannel(e) {
    e.stopPropagation();
    let { channel_id, workspace_address } = this.props.match.params;
    dispatch(leaveChannel(parseInt(channel_id)))
      .then(
        () => {
          this.props.history.push(`/workspace/${workspace_address}`);
        },
        null
        )
      }

  button() {
    let { channels } = getState().entities;
    let current_channel = this.props.match.params.channel_id;
    let user_channels = Object.keys(getState().session.user_channels);
    if (!user_channels.includes(current_channel))
      return (
        <div className="dropdown-item" onClick={this.joinChannel}>
          Join Channel
        </div>
      )
    else
     return (
       <div className="dropdown-item" onClick={this.leaveChannel}>
         Leave Channel
        </div>
     )
  }

  render() {
    return (
      <div className="dropdown channel-settings hidden">
        {this.button()}
      </div>
    )
  }
}

export default withRouter(ChannelActionsDropdown);