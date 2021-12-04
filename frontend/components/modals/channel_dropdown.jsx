import React from 'react';
import { withRouter } from 'react-router-dom';

class ChannelActionsDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.button = this.button.bind(this);
  }

  button() {
    let { status } = this.props;
    if (status.canJoin) //REMOVES BUTTON
      return (
        <div className="dropdown-item" onClick={this.props.joinChannel}>
          Join Channel
        </div>
      )
    else if (status.canLeave)
      return (
        <div className="dropdown-item" onClick={this.props.leaveChannel}>
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