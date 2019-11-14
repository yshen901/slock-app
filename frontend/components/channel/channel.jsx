import React from 'react';
import ChannelNavContainer from './channel_nav_container';
import ChannelChatContainer from './channel_chat_container';
import ChannelActionsDropdown from '../modals/channel_dropdown';

class Channel extends React.Component {
  render() {
    return (
      <div id="channel">
        <ChannelNavContainer />
        <ChannelChatContainer />
        <ChannelActionsDropdown />
      </div>
    )
  }
}

export default Channel;