import React from 'react';

import ChannelNavContainer from './channel_nav_container';
import ChannelChatContainer from './channel_chat_container';

import { withRouter } from '../../withRouter';

class Channel extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      canJoin: this.canJoin(),
      canLeave: this.canLeave(),
    }

    this.leaveChannel = this.leaveChannel.bind(this);
    this.joinChannel = this.joinChannel.bind(this);
  }

  // Ignore transition channel
  componentDidUpdate(oldProps) {
    if (this.props.channel_id == "0") return
      
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

  // Leaves channel - different logic for dm channel and general channel
  leaveChannel(e) {
    e.stopPropagation();

    let { channel, channel_id, user_id } = this.props;
    let { workspace_address } = this.props.params;

    if (!channel.dm_channel) {
      if (channel.name !== "general") //PREVENTS ACTION (DOUBLE PRECAUTION)
        this.props.leaveChannel(parseInt(channel_id))
          .then(
            () => {
              this.props.loginACChannel.speak(
                {
                  channel_data: {
                    login: false,
                    user_id,
                    channel_id
                  }
                }
              );

              this.props.navigate(`/workspace/${workspace_address}/${this.props.generalChannelId}`);
              this.setState({ canJoin: true, canLeave: false });
            },
            null
          )
    }
    else {
      let channelInfo = { // sends current user's info
        channel_id, 
        user_id: user_id,
        active: false
      }
      this.props.endDmChannel(channelInfo)
        .then(
          () => {
            () => {
              this.props.navigate(`/workspace/${workspace_address}/${this.props.generalChannelId}`);
              this.setState({ canJoin: true, canLeave: false });
            },
            null
          }
        )
    }
  }

  // Joins channel - different logic for dm channel and general channel
  joinChannel(e) {
    e.stopPropagation();
    let { channel } = this.props;
    let { workspace_id } = this.props.channel;
    let user_id = this.props.user_id;

    if (channel.dm_channel) {
      this.props.restartDmChannel({
        user_id,
        channel_id: channel.id,
        active: true
      }).then(
        () => {
          this.setState({ canJoin: false, canLeave: true })
        }
      );
    }
    else {
      this.props.joinChannel({channel_id: channel.id, workspace_id})
        .then(
          () => {
            this.props.loginACChannel.speak(
              {
                channel_data: {
                  login: true,
                  user_id,
                  channel_id: channel.id
                }
              }
            );
            this.setState({ canJoin: false, canLeave: true });
          }
        )
    }
  }

  // Determines whether a user can join/leave a certain channel
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
      <div id="channel-main">
        <ChannelNavContainer 
          status={this.state}
          startVideoCall={this.props.startVideoCall}
          inVideoCall={this.props.inVideoCall}/>
          
        <ChannelChatContainer 
          joinChannel={this.joinChannel}
          leaveChannel={this.leaveChannel}
          status={this.state}
          showUser={this.props.showUser}
          startVideoCall={this.props.startVideoCall}/>
      </div>
    )
  }
}

export default withRouter(Channel);