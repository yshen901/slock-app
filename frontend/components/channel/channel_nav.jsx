import React from 'react';
import { toggleElements } from '../../util/modal_api_util';

class ChannelNav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.channel)
      return (
        <div id="channel-nav">
          <div id="left">
            <h1>#{this.props.channel.name}</h1>
          </div>
          <div id="right">
            <div className="settings-button" onClick={(e) => {e.stopPropagation(); toggleElements("dropdown channel-settings")}}>&#9881;</div>
          </div>
        </div>
      )
    else
      return (<div id="channel-nav"></div>)
  }
}

export default ChannelNav;