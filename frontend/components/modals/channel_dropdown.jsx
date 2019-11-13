import React from 'react';
import { withRouter } from 'react-router-dom';

class ChannelActionsDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.joinButton = this.joinButton.bind(this);
  }

  joinButton() {
    let currentChannel = parseInt(this.props.match.params.channel_id);
    let user_channels = getState().session.user_channels;
    
    if (!user_channels.includes(currentChannel))
      return (
        <div className="dropdown-item">
          Join Channel
        </div>
      )
  }

  render() {
    return (
      <div className="dropdown channel-settings hidden">
        {this.joinButton()}
        <div className="dropdown-item">
          Leave Channel
        </div>
      </div>
    )
  }
}

export default withRouter(ChannelActionsDropdown);