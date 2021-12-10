import React from 'react';
import { withRouter } from 'react-router-dom';
import ChannelNavContainer from './channel_nav_container';
import ChannelChatContainer from './channel_chat_container';
import ChannelActionsDropdown from '../modals/channel_dropdown';

import { hideElements } from '../../util/modal_api_util';
import { joinChannel, leaveChannel } from '../../actions/channel_actions';
import { endDmChannel } from "../../actions/dm_channel_actions";

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

  // Ignore transition channel
  componentDidUpdate(oldProps) {
    if (this.props.channel_id != "0" && oldProps.channel_id !== this.props.channel_id)
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

  // Acts differently depending on channel type
  leaveChannel(e) {
    e.stopPropagation();
    hideElements("dropdown");

    let { channel, channel_id, workspace_address, user } = this.props;
    if (!channel.dm_channel) {
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
    else {
      let channelInfo = { // sends current user's info
        channel_id, 
        user_id: user.id,
        active: false
      }
      dispatch(endDmChannel(channelInfo))
        .then(
          () => {
            () => {
              this.props.history.push(`/workspace/${workspace_address}/0`);
              this.setState({ joined: false });
            },
            null
          }
        )
    }
  }

  joinChannel(e) {
    e.stopPropagation();
    hideElements("dropdown");
    let { channel_id } = this.props;
    let { workspace_id } = this.props.channel;
    dispatch(joinChannel({channel_id, workspace_id}))
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