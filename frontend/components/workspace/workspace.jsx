import React from 'react';

import WorkspaceSidebarContainer from "./workspace_sidebar_container"
import ChannelContainer from '../channel/channel_container';
import BrowseChannelModal from '../modals/browse_channel_modal';
import BrowseDmChannelModal from "../modals/browse_dm_channel_modal";
import NewChannelModalContainer from '../modals/new_channel_modal_container';
import InviteUserModal from '../modals/invite_user_modal';
import EditChannelTopicModal from '../modals/edit_channel_topic_modal';
import EditProfileModalContainer from "../modals/edit_profile_modal_container";

import SidebarDropdown from '../modals/sidebar_dropdown';
import ProfileDropdown from "../modals/profile-dropdown";

import { hideElements, focus } from '../../util/modal_api_util';
import WorkspaceTopbar from './workspace_topbar';

class Workspace extends React.Component {
  constructor() {
    super();

    this.state = {
      loaded: false,
      channelFlag: 0,
      workspaceFlag: 0,
    }
    this.receiveACData = this.receiveACData.bind(this);
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
        received: this.receiveACData,
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

  // Receives data sent from other users' workspace and channel join/leave actions
  // Ignores your own data
  receiveACData({ workspace_data, channel_data }) {
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
          <ChannelContainer 
            loginACChannel={this.loginACChannel}
            channelFlag={this.state.channelFlag}
          />

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