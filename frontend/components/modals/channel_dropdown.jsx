import React from 'react';
import { withRouter } from 'react-router-dom';

class ChannelActionsDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  joinChannel() {
  }

  render() {
    return (
      <div className="dropdown channel-settings hidden">
        <div className="dropdown-item">
          Join Channel
        </div>
        <div className="dropdown-item">
          Leave Channel
        </div>
      </div>
    )
  }
}

export default withRouter(ChannelActionsDropdown);