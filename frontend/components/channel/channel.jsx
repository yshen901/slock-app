import React from 'react';
import { withRouter } from 'react-router-dom';

import ChannelNavContainer from './channel_nav_container';
import ChannelChatContainer from './channel_chat_container';

import { hideElements } from '../../util/modal_api_util';
import { joinChannel, leaveChannel } from '../../actions/channel_actions';
import { restartDmChannel, endDmChannel } from "../../actions/dm_channel_actions";

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
    hideElements("dropdown");

    let { channel, channel_id, user } = this.props;
    let user_id = user.id;

    if (!channel.dm_channel) {
      if (channel.name !== "general") //PREVENTS ACTION (DOUBLE PRECAUTION)
        dispatch(leaveChannel(parseInt(channel_id)))
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
              // this.props.history.push(`/workspace/${workspace_address}/${this.props.generalChannelId}`);
              this.setState({ canJoin: true, canLeave: false });
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
              // this.props.history.push(`/workspace/${workspace_address}/${this.props.generalChannelId}`);
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
    hideElements("dropdown");
    let { channel } = this.props;
    let { workspace_id } = this.props.channel;
    let user_id = this.props.user.id;

    if (channel.dm_channel) {
      dispatch(restartDmChannel({
        user_id,
        channel_id: channel.id,
        active: true
      })).then(
        () => {
          this.setState({ canJoin: false, canLeave: true })
        }
      );
    }
    else {
      dispatch(joinChannel({channel_id: channel.id, workspace_id}))
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
          leaveChannel={this.leaveChannel}
          status={this.state}
          startVideoCall={this.props.startVideoCall}
          inVideoCall={this.props.inVideoCall}/>
        <ChannelChatContainer 
          joinChannel={this.joinChannel}
          status={this.state}
          showUser={this.props.showUser}/>
      </div>
    )
  }
}

export default withRouter(Channel);