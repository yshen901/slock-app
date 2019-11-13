import React from 'react';
import { withRouter } from 'react-router-dom';
import { joinChannel, leaveChannel } from '../../actions/channel_actions';

class ChannelActionsDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.channel_id = this.props.match.params.channel_id;
    this.workspace_address = this.props.match.params.workspace_address;

    this.joinButton = this.joinButton.bind(this);
    this.leaveChannel = this.leaveChannel.bind(this);
    this.joinChannel = this.joinChannel.bind(this);
  }

  joinChannel(e) {
    e.stopPropagation();
    dispatch(joinChannel(parseInt(this.channel_id)))
  }

  leaveChannel(e) {
    e.stopPropagation();
    dispatch(leaveChannel(parseInt(this.channel_id)))
      .then(
        () => this.props.history.push(`/workspace/${this.workspace_address}`),
        null
      )
  }

  joinButton() {
    let current_channel = parseInt(this.props.match.params.channel_id);
    let user_channels = getState().session.user_channels;
    
    if (!user_channels.includes(current_channel))
      return (
        <div className="dropdown-item" onClick={this.joinChannel}>
          Join Channel
        </div>
      )
  }

  render() {
    return (
      <div className="dropdown channel-settings hidden">
        {this.joinButton()}
        <div className="dropdown-item" onClick={this.leaveChannel}>
          Leave Channel
        </div>
      </div>
    )
  }
}

export default withRouter(ChannelActionsDropdown);