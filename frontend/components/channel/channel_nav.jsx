import React from 'react';

class ChannelNav extends React.Component {
  render() {
    if (this.props.channel)
      return (
        <div id="channel-nav">
          <h1>#{this.props.channel.name}</h1>
        </div>
      )
    else
      return (<div id="channel-nav"></div>)
  }
}

export default ChannelNav;