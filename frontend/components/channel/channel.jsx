import React from 'react';
import { withRouter } from 'react-router-dom';

import ChannelNavContainer from './channel_nav_container';
import ChannelChatContainer from './channel_chat_container';
import ChannelProfileSidebar from "./channel_profile_sidebar";

import { hideElements } from '../../util/modal_api_util';
import { joinChannel, leaveChannel } from '../../actions/channel_actions';
import { restartDmChannel, endDmChannel } from "../../actions/dm_channel_actions";
import { JOIN_CALL, LEAVE_CALL } from '../../util/call_api_util';

class Channel extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      canJoin: this.canJoin(),
      canLeave: this.canLeave(),
      inVideoCall: false,
      shownUserId: 0,
      incomingCall: null // contains incoming call information
    }

    this.leaveChannel = this.leaveChannel.bind(this);
    this.joinChannel = this.joinChannel.bind(this);

    this.startVideoCall = this.startVideoCall.bind(this);
    this.pickupCall = this.pickupCall.bind(this);
    this.rejectCall = this.rejectCall.bind(this);

    this.showUser = this.showUser.bind(this);
    this.hideUser = this.hideUser.bind(this);
  }

  // Begins listening for videocall pings
  componentDidMount() {
    let {user, user_channel_ids} = this.props;

    this.callACChannel = App.cable.subscriptions.create(
      { channel: "CallChannel" },
      {
        received: (data) => {
          let { from, channel_id, type, target_user_id } = data;

          // JOIN_CALL  : if the ping is for current user and user isn't busy -> activate modal and channel
          // LEAVE_CALL : if ping is from current user                        -> set inVideoCall to false
          if (type == JOIN_CALL && target_user_id == user.id && !this.state.inVideoCall) {
            if (user_channel_ids.includes(channel_id)) {
              this.setState({ incomingCall: data })
            }
            else {
              this.props.restartDmChannel({
                channel_id,
                user_id: user.id,
                active: true
              }).then(
                () => this.setState({ incomingCall: data })
              )
            }
          }
          else if (type == LEAVE_CALL && from == user.id) {
            this.setState({ inVideoCall: false });
          }
        },
        speak: function(data) {
          return this.perform("speak", data);
        }
      }
    )
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

  // Creates a popup of a video call
  startVideoCall(link) {
    let windowLink = link;
    if (!windowLink) {
      windowLink = window.location.href;
      if (windowLink[windowLink.length - 1] == "/") // two possibilities
        windowLink += "video_call";
      else
        windowLink += "/video_call";
    }

    let windowName = "Slock call";
    let windowFeatures = "popup, width=640, height=480";
    window.open(windowLink, windowName, windowFeatures)
    this.setState({ inVideoCall: true });
  }

  renderRoom() {
      return (
        <ChannelChatContainer 
            joinChannel={this.joinChannel}
            status={this.state}
            showUser={this.showUser}/>
      )
  }


  // handles profile sidebar of channel
  renderProfile() {
    if (this.state.shownUserId != 0)
      return (
        <ChannelProfileSidebar
          userId={this.state.shownUserId}
          hideUser={this.hideUser}/>
      )
  }

  showUser(userId) {
    this.setState({shownUserId: userId});
  }

  hideUser() {
    this.setState({shownUserId: 0});
  }

  // handles incoming video call pings (pings have type, user_id, and channel_id)
  renderVideoCallPing() {
    let {incomingCall} = this.state;
    if (incomingCall)
      return (
        <div id="video-ping-modal" onClick={() => this.rejectCall(incomingCall)}>
          <div id="video-ping-modal-background"></div>
          <div id="video-ping-content">
            <div id="video-ping-header">INSERT wants to video chat</div>
            <div id="video-ping-buttons">
              <div id="video-ping-button-accept" onClick={() => this.pickupCall(incomingCall)}>Pick Up</div>
              <div id="video-ping-button-decline" onClick={() => this.rejectCall(incomingCall)}>Decline</div>
            </div>
          </div>
        </div>
      )
  }

  // Builds the link using callData, then starts video call
  pickupCall(callData) {
    let { workspace_address } = this.props.match.params;
    let { channel_id } = callData;

    let windowLink = window.location.origin + `/#/workspace/${workspace_address}/${channel_id}/video_call`;
    this.startVideoCall(windowLink);
    this.setState({incomingCall: null});
  }

  rejectCall(callData) {
    debugger;
  }

  render() {
    return (
      <div id="channel">
        <div id="channel-main">
          <ChannelNavContainer 
            leaveChannel={this.leaveChannel}
            status={this.state}
            startVideoCall={this.startVideoCall}
            inVideoCall={this.state.inVideoCall}/>
          {this.renderRoom()}
        </div>
        { this.renderProfile() }
        { this.renderVideoCallPing() }
      </div>
    )
  }
}

export default withRouter(Channel);