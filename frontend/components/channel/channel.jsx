import React from 'react';
import { withRouter } from 'react-router-dom';

import ChannelNavContainer from './channel_nav_container';
import ChannelChatContainer from './channel_chat_container';
import ChannelVideoChatRoom from './channel_video_chat_room';
import ChannelProfileSidebar from "./channel_profile_sidebar";

import { hideElements } from '../../util/modal_api_util';
import { joinChannel, leaveChannel } from '../../actions/channel_actions';
import { restartDmChannel, endDmChannel } from "../../actions/dm_channel_actions";

class Channel extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      canJoin: this.canJoin(),
      canLeave: this.canLeave(),
      inVideoCall: false,
      shownUserId: 0,
    }

    this.leaveChannel = this.leaveChannel.bind(this);
    this.joinChannel = this.joinChannel.bind(this);

    this.startVideoCall = this.startVideoCall.bind(this);
    this.endVideoCall = this.endVideoCall.bind(this);

    this.showUser = this.showUser.bind(this);
    this.hideUser = this.hideUser.bind(this);
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

  // Handles video call logic and video room
  startVideoCall() {
    this.setState({inVideoCall: true});
  }

  endVideoCall() {
    this.setState({inVideoCall: false});
  }

  renderRoom() {
    if (this.state.inVideoCall) 
      return (
        <ChannelVideoChatRoom
          endVideoCall={this.endVideoCall}/>
      )
    else
      return (
        <ChannelChatContainer 
            joinChannel={this.joinChannel}
            status={this.state}
            showUser={this.showUser}/>
      )
  }

  // handles profile sidebar of channel
  showUser(userId) {
    this.setState({shownUserId: userId});
  }

  hideUser() {
    this.setState({shownUserId: 0});
  }

  renderProfile() {
    if (this.state.shownUserId != 0)
      return (
        <ChannelProfileSidebar
          userId={this.state.shownUserId}
          hideUser={this.hideUser}/>
      )
  }

  render() {
    return (
      <div id="channel">
        <div id="channel-main">
          <ChannelNavContainer 
            leaveChannel={this.leaveChannel}
            status={this.state}
            startVideoCall={this.startVideoCall}
            endVideoCall={this.endVideoCall}
            inVideoCall={this.state.inVideoCall}/>
          {this.renderRoom()}
        </div>
        { this.renderProfile() }
      </div>
    )
  }
}

export default withRouter(Channel);