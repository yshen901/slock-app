import React from 'react';

// Subcomponents
import WorkspaceTopbar from './workspace_topbar';
import WorkspaceSidebarContainer from "./workspace_sidebar_container"
import ChannelContainer from '../channel/channel_container';
import ChannelProfileSidebar from "../channel/channel_profile_sidebar";

// Modals
import BrowseChannelModal from '../modals/browse_channel_modal';
import BrowseDmChannelModal from "../modals/browse_dm_channel_modal";
import NewChannelModalContainer from '../modals/new_channel_modal_container';
import InviteUserModal from '../modals/invite_user_modal';
import EditChannelTopicModal from '../modals/edit_channel_topic_modal';
import EditProfileModalContainer from "../modals/edit_profile_modal_container";

// Dropdowns
import SidebarDropdown from '../modals/sidebar_dropdown';
import ProfileDropdown from "../modals/profile-dropdown";

// Utilities and constants
import { JOIN_CALL, LEAVE_CALL, REJECT_CALL } from '../../util/call_api_util';
import { hideElements, focus } from '../../util/modal_api_util';

class Workspace extends React.Component {
  constructor() {
    super();

    this.state = {
      loaded: false,
      channelFlag: 0,
      workspaceFlag: 0,
      shownUserId: 0,

      inVideoCall: false,
      incomingCall: null // contains incoming call information
    }

    this.receiveLoginACData = this.receiveLoginACData.bind(this);
    this.showUser = this.showUser.bind(this);
    this.hideUser = this.hideUser.bind(this);

    this.startVideoCall = this.startVideoCall.bind(this);
    this.pickupCall = this.pickupCall.bind(this);
    this.rejectCall = this.rejectCall.bind(this);
  }

  componentDidMount() {
    let { workspaces, workspace_address, channel_id } = this.props;
    let valid = false

    // Listens for login for workspace and channel
    // workspace_data : { user_id, logged_in }
    // channel_data   : { user_id, channel_id, action }
    this.loginACChannel = App.cable.subscriptions.create(
      { channel: "LoginChannel" },
      {
        received: this.receiveLoginACData,
        speak: function(data) {
          return this.perform("speak", data)
        }
      }
    )

    for (let i = 0; i < workspaces.length; i++) {
      if (workspaces[i].address === workspace_address) {
        valid = true;
        
        // DESIGN: SETS SESSION.WORKSPACE_ID, SESSION.USER_CHANNELS, AND ENTITIES.USERS/CHANNELS
        this.props.getWorkspace(workspace_address) 
          .then(
            ({channels, workspace}) => {
              let first_channel = Object.keys(channels)[0];  // goes to first channel if url is invalid
              if (channels[channel_id] === undefined)
                this.props.history.replace(`/workspace/${workspace_address}/${first_channel}`)

              this.loginACChannel.speak({ // announces login through ActionCable
                workspace_data: {
                  user_id: this.props.user_id,
                  workspace_id: workspace.id,
                  logged_in: true
                }
              })

              this.setupCallACChannel();

              this.setState({loaded: true})
            }
          )
      }
    }

    if (!valid) 
      this.props.history.replace('/signin');
    else if (channel_id != "0")
      this.props.loadChannel(channel_id)
  }

  // Begins listening for videocall pings
  setupCallACChannel() {
    let {user, user_channel_ids} = this.props;

    this.callACChannel = App.cable.subscriptions.create(
      { channel: "CallChannel" },
      {
        received: (data) => {
          let { from, channel_id, type, target_user_id } = data;

          // JOIN_CALL  : if the ping is for current user and user isn't busy   -> activate modal and channel
          // LEAVE_CALL : if ping is from current user                          -> set inVideoCall to false
          //              if ping is from the caller (same channel_id as ping)  -> remove the current incoming ping
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
          else if (type == LEAVE_CALL) { // detects if user or caller ends call
            debugger;
            if (from == user.id)
              this.setState({ inVideoCall: null });
            else if (this.state.incomingCall && this.state.incomingCall.channel_id == channel_id)
              this.setState({ incomingCall: null });
          }
        },
        speak: function(data) {
          return this.perform("speak", data);
        }
      }
    )
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

  getUserName(user) {
    if (user.display_name)
      return user.display_name;
    else if (user.full_name)
      return user.full_name;
    else
      return user.email;
  }

  // handles incoming video call pings (pings have type, user_id, and channel_id)
  renderVideoCallPing() {
    let {incomingCall} = this.state;
    if (!incomingCall) return;

    let {channel_id} = incomingCall;
    let {channels, users, user_id} = this.props;

    let channelUserIds = Object.keys(channels[channel_id].users);
    let remoteUser = users[channelUserIds[0]];
    if (user_id == channelUserIds[0])
      remoteUser = users[channelUserIds[1]];

    return (
      <div id="video-ping-modal" onClick={this.rejectCall(incomingCall)}>
        <div id="video-ping-modal-background"></div>
        <div id="video-ping-content" onClick={(e) => e.stopPropagation()}>
          <div id="video-ping-header">{this.getUserName(remoteUser)} wants to video chat</div>
          <div id="video-ping-buttons">
            <div id="video-ping-button-accept" onClick={this.pickupCall(incomingCall)}>Pick Up</div>
            <div id="video-ping-button-decline" onClick={this.rejectCall(incomingCall)}>Decline</div>
          </div>
        </div>
        <audio autoPlay>
          <source src="/soundtracks/phone-ringing.mp3" type="audio/mp3"/>
        </audio>
      </div>
    )
  }

  // Builds the link using callData, then starts video call
  pickupCall(callData) {
    return (e) => {
      e.stopPropagation();
  
      let { workspace_address } = this.props.match.params;
      let { channel_id } = callData;
  
      let windowLink = window.location.origin + `/#/workspace/${workspace_address}/${channel_id}/video_call?pickup`;
      this.startVideoCall(windowLink);
      this.setState({incomingCall: null});
    }
  }

  // Sends a reject call action to the caller, and removes the modal
  rejectCall(callData) {
    return (e) => {
      e.stopPropagation();
      
      let { from, target_user_id, channel_id } = callData;
      this.callACChannel.speak({
        type: REJECT_CALL,
        from: target_user_id,
        target_user_id: from,
        channel_id
      });
      this.setState({ incomingCall: null });
    }
  }

  // Receives data sent from other users' workspace and channel join/leave actions
  // Ignores your own data
  receiveLoginACData({ workspace_data, channel_data }) {
    if (workspace_data) {
        if (workspace_data.user_id != this.props.user_id) {
          this.props.updateOtherUserWorkspaceStatus(workspace_data);
        }
    }
    else if (channel_data) {
      if (channel_data.user_id != this.props.user_id) {
        this.props.updateOtherUserChannelStatus(channel_data);
      }
    }
  }

  // Makes sure you don't go to an invalid channel
  componentDidUpdate(oldProps) {
    if (oldProps.match.params.channel_id !== this.props.match.params.channel_id) {
      if (getState().entities.channels[this.props.match.params.channel_id] === undefined)
        this.props.history.goBack(); //NOTE: BASICALLY GOES BACK TO BEFORE
      else
        this.props.loadChannel(parseInt(this.props.match.params.channel_id))
    }
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

  render() {
    if (!this.state.loaded)
      return(
        <div className="loading-page">
          <img src="/images/orb.gif"/>
        </div>
      );

    let { user_id, users } = this.props;
    return (
      <div id="workspace-container" onClick={() => hideElements("dropdown")}>
        <WorkspaceTopbar photo_url={users[user_id].photo_url}/>
        <div id="workspace">
          <WorkspaceSidebarContainer workspaceFlag={this.state.workspaceFlag}/>
          <div id="channel">
            <ChannelContainer 
              loginACChannel={this.loginACChannel}
              channelFlag={this.state.channelFlag}
              showUser={this.showUser}
              startVideoCall={this.startVideoCall}
              inVideoCall={this.state.inVideoCall}
            />
            { this.renderProfile() }
            { this.renderVideoCallPing() }
          </div>

          <SidebarDropdown loginACChannel={this.loginACChannel}/>
          <ProfileDropdown loginACChannel={this.loginACChannel}/>

          <BrowseChannelModal />
          <BrowseDmChannelModal 
            workspaceFlag={this.state.workspaceFlag}
          />
          <InviteUserModal />
          <NewChannelModalContainer />
          <EditChannelTopicModal />
          <EditProfileModalContainer />
        </div>
      </div>
    )
  }
}

export default Workspace;