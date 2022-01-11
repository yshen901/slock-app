import React from 'react';

// Subcomponents
import WorkspaceTopbar from './workspace_topbar';
import WorkspaceSidebarContainer from "./workspace_sidebar_container"
import ChannelContainer from '../channel/channel_container';
import ChannelProfileSidebar from "../channel/channel_profile_sidebar";
import ChannelBrowser from "../channel/browser_channels/channel_browser";
import PeopleBrowser from "../channel/browser_channels/people_browser";
import SavedBrowser from "../channel/browser_channels/saved_browser";

// Modals
import NewChannelModalContainer from '../modals/new_channel_modal_container';
import InviteUserModal from '../modals/invite_user_modal';
import EditProfileModalContainer from "../modals/edit_profile_modal_container";
import EditProfileStatusModal from "../modals/edit_profile_status_modal";

// Dropdowns
import SidebarDropdown from '../modals/sidebar_dropdown';
import ProfileDropdown from "../modals/profile_dropdown";

// Utilities and constants
import { JOIN_CALL, LEAVE_CALL, RECEIVED_CALL, REJECT_CALL } from '../../util/call_api_util';
import { joinChannel } from '../../actions/channel_actions';

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

    this.showUser = this.showUser.bind(this);
    this.hideUser = this.hideUser.bind(this);

    this.startVideoCall = this.startVideoCall.bind(this);
    this.pickupCall = this.pickupCall.bind(this);
    this.rejectCall = this.rejectCall.bind(this);
    this.receiveCall = this.receiveCall.bind(this);
  }

  componentDidMount() {
    let { workspaces, workspace_address, channel_id } = this.props;
    let valid = false

    this.setupLoginACChannel();

    for (let i = 0; i < workspaces.length; i++) {
      if (workspaces[i].address === workspace_address) {
        valid = true;
        
        // DESIGN: SETS SESSION.WORKSPACE_ID, SESSION.USER_CHANNELS, AND ENTITIES.USERS/CHANNELS
        this.props.getWorkspace(workspace_address) 
          .then(
            ({channels, workspace}) => {
              this.first_channel = Object.keys(channels)[0];  // goes to first channel if url is invalid
              if (channel_id != "saved-browser" && channel_id != "channel-browser" && channel_id != "people-browser" && channels[channel_id] === undefined)
                this.props.history.replace(`/workspace/${workspace_address}/${this.first_channel}`)

              this.loginACChannel.speak({ // announces login through ActionCable
                workspace_data: {
                  user: this.props.user,
                  logged_in: true,
                  user_channel_ids: this.props.user_channel_ids,
                  workspace_id: workspace.id,
                }
              })

              // For new users that aren't logged into the general channel, log them in 
              if (!this.props.user_channel_ids.includes(this.first_channel)) {
                dispatch(joinChannel({channel_id: this.first_channel, workspace_id: workspace.id}))
                .then(
                  () => {
                    this.loginACChannel.speak(
                      {
                        channel_data: {
                          login: true,
                          user_id: this.props.user.id,
                          channel_id: channel_id
                        }
                      }
                    );
                  }
                )
              }

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
              this.receiveCall(data);
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

  // Listens for login for workspace and channel
  // workspace_data : { user_id, logged_in }
  // channel_data   : { user_id, channel_id, action }
  setupLoginACChannel() {
    this.loginACChannel = App.cable.subscriptions.create(
      { channel: "LoginChannel" },
      {
        received: ({ workspace_data, channel_data }) => {
          if (workspace_data) {
              if (workspace_data.user.id != this.props.user_id) {
                this.props.updateOtherUserWorkspaceStatus(workspace_data);
              }
          }
          else if (channel_data) {
            if (channel_data.user_id != this.props.user_id) {
              this.props.updateOtherUserChannelStatus(channel_data);
            }
          }
        },
        speak: function(data) {
          return this.perform("speak", data)
        }
      }
    )
  }

  // Creates a popup of a video call
  startVideoCall(workspace_address, channel_id, query="") {
    let windowLink = `${window.location.origin}/#/workspace/${workspace_address}/${channel_id}/video_call${query}`;

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

    let {users} = this.props;
    let remoteUser = users[incomingCall.from];

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
  
      this.startVideoCall(workspace_address, channel_id, "?pickup");
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

  receiveCall(callData) {
    this.setState({ incomingCall: callData });
    
    let { from, target_user_id, channel_id } = callData;
    this.callACChannel.speak({
      type: RECEIVED_CALL,
      from: target_user_id,
      target_user_id: from,
      channel_id
    });
  }

  // Makes sure you don't go to an invalid channel
  componentDidUpdate(oldProps) {
    let { channel_id } = this.props.match.params;
    if (oldProps.match.params.channel_id !== channel_id) {
      if (channel_id == "channel-browser" || channel_id == 'people-browser' || channel_id == 'saved-browser')
        this.props.loadChannel(parseInt(channel_id));
      else if (getState().entities.channels[channel_id] === undefined)
        this.props.history.goBack(); //NOTE: BASICALLY GOES BACK TO BEFORE
      else
        this.props.loadChannel(parseInt(channel_id));
    }
  }

  componentWillUnmount() {
    if (this.loginACChannel) this.loginACChannel.unsubscribe();
    if (this.callACChannel) this.callACChannel.unsubscribe();
  }

  // handles profile sidebar of channel
  renderProfile() {
    if (this.state.shownUserId != 0)
      return (
        <ChannelProfileSidebar
          userId={this.state.shownUserId}
          hideUser={this.hideUser}
          startVideoCall={this.startVideoCall}/>
      )
  }

  renderChannel() {
    let {channel_id} = this.props;
    if (channel_id == "channel-browser")
      return (
        <ChannelBrowser
          loginACChannel={this.loginACChannel}/>
      )
    else if (channel_id == "people-browser")
      return (
        <PeopleBrowser
          showUser={this.showUser}/>
      )
    else if (channel_id == "saved-browser")
      return (
        <SavedBrowser
          showUser={this.showUser}
          startVideoCall={this.startVideoCall}/>
      )
    else
      return (
        <ChannelContainer 
                loginACChannel={this.loginACChannel}
                channelFlag={this.state.channelFlag}
                showUser={this.showUser}
                startVideoCall={this.startVideoCall}
                generalChannelId={this.first_channel}/>
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
      <div id="workspace-container">
        <WorkspaceTopbar user={users[user_id]}/>
        <div id="workspace">
          <WorkspaceSidebarContainer workspaceFlag={this.state.workspaceFlag}/>
          <div id="channel">
            { this.renderChannel() }
            { this.renderProfile() }
            { this.renderVideoCallPing() }
          </div>

          <SidebarDropdown loginACChannel={this.loginACChannel}/>
          <ProfileDropdown 
            loginACChannel={this.loginACChannel} 
            showUser={() => this.showUser(user_id)}
            user={users[user_id]}/>

          <InviteUserModal />
          <NewChannelModalContainer />
          <EditProfileModalContainer />
          <EditProfileStatusModal />
        </div>
      </div>
    )
  }
}

export default Workspace;