import React from 'react';
import { toggleElements } from '../../util/modal_api_util';

class ChannelNav extends React.Component {
  constructor(props) {
    super(props);

    this.leaveButton = this.leaveButton.bind(this);
  }

  leaveButton() {
    if (this.props.status.canLeave)
      return (
        <div className="channel-nav-button" onClick={this.props.leaveChannel}>Leave Channel</div>
      )
  }

  render() {
    if (this.props.channel)
      return (
        <div id="channel-nav">
          <div id="left">
            <h1>#{this.props.channel.name}</h1>
          </div>
          <div id="right">
            {/* <div className="settings-button" onClick={(e) => {e.stopPropagation(); toggleElements("dropdown channel-settings")}}>&#9881;</div> */}
            {this.leaveButton()}
          </div>
        </div>
      )
    else
      return (<div id="channel-nav"></div>)
  }
}

export default ChannelNav;