import React from 'react';
import { withRouter } from 'react-router-dom';
import ChannelNavContainer from './channel_nav_container';
import ChannelChatContainer from './channel_chat_container';
import ChannelActionsDropdown from '../modals/channel_dropdown';

import { hideElements } from '../../util/modal_api_util';
import { joinChannel, leaveChannel } from '../../actions/channel_actions';

class Channel extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      canJoin: this.canJoin(),
      canLeave: this.canLeave()
    }

    this.leaveChannel = this.leaveChannel.bind(this);
    this.joinChannel = this.joinChannel.bind(this);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.channel_id !== this.props.channel_id)
      this.setState({
        canJoin: this.canJoin(),
        canLeave: this.canLeave()
      })
    if (this.canJoin() !== this.state.canJoin)
      this.setState({
        canJoin: this.canJoin(),
        canLeave: this.canLeave()
      })
  }

  leaveChannel(e) {
    e.stopPropagation();
    hideElements("dropdown");

    let { channel, channel_id, workspace_address } = this.props;
    if (channel.name !== "general") //PREVENTS ACTION (DOUBLE PRECAUTION)
      dispatch(leaveChannel(parseInt(channel_id)))
        .then(
          () => {
            this.props.history.push(`/workspace/${workspace_address}/0`);
            this.setState({ joined: false });
          },
          null
        )    
  }

  joinChannel(e) {
    e.stopPropagation();
    hideElements("dropdown");
    let { channel_id } = this.props;
    dispatch(joinChannel(parseInt(channel_id)))
      .then(
        () => this.setState({ joined: true })
      )
  }

  canLeave() {
    let { user_channels } = getState().session;
    let { channel, channel_id } = this.props;
    return user_channels[channel_id] !== undefined && channel.name != "general";
  }

  canJoin() {
    let { user_channels } = getState().session;
    let { channel_id } = this.props;
    return user_channels[channel_id] === undefined
  }

  render() {
    return (
      <div id="channel">
        <ChannelNavContainer 
          leaveChannel={this.leaveChannel}
          status={this.state}/>
        <ChannelChatContainer 
            joinChannel={this.joinChannel}
            status={this.state}/>
        {/* <ChannelActionsDropdown 
            leaveChannel={this.leaveChannel}
            joinChannel={this.joinChannel}
            status={this.state}/> */}
      </div>
    )
  }
}

export default withRouter(Channel);