import React from 'react';

import WorkspaceSidebarContainer from "./workspace_sidebar_container"
import ChannelContainer from '../channel/channel_container';
import BrowseChannelModal from '../modals/browse_channel_modal';
import BrowseDmChannelModal from "../modals/browse_dm_channel_modal";
import NewChannelModalContainer from '../modals/new_channel_modal_container';
import InviteUserModal from '../modals/invite_user_modal';
import EditChannelTopicModal from '../modals/edit_channel_topic_modal';
import SidebarDropdown from '../modals/sidebar_dropdown';
import EditProfileModalContainer from "../modals/edit_profile_modal_container";

import { hideElements, focus } from '../../util/modal_api_util';

class Workspace extends React.Component {
  constructor() {
    super();

    this.state = {
      loaded: false
    }
  }

  componentDidMount() {
    let { workspaces, workspace_address, channel_id } = this.props;
    let valid = false

    for (let i = 0; i < workspaces.length; i++) {
      if (workspaces[i].address === workspace_address) {
        valid = true;
        
        // DESIGN: SETS SESSION.WORKSPACE_ID, SESSION.USER_CHANNELS, AND ENTITIES.USERS/CHANNELS
        this.props.getWorkspace(workspace_address) 
          .then(
            ({channels}) => {
              let first_channel = Object.keys(channels)[0];
              if (channels[channel_id] === undefined)
                this.props.history.replace(`/workspace/${workspace_address}/${first_channel}`)
              this.setState({loaded: true})
            }
          )
      }
    }

    if (!valid) 
      this.props.history.replace('/signin');
    else
      this.props.loadChannel(channel_id)
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
    if (this.state.loaded)
      return (
        <div id="workspace" onClick={() => hideElements("dropdown")}>
          <WorkspaceSidebarContainer />
          <ChannelContainer />

          <SidebarDropdown />
          <BrowseChannelModal />
          <BrowseDmChannelModal />
          <InviteUserModal />
          <NewChannelModalContainer />
          <EditChannelTopicModal />
          <EditProfileModalContainer />
        </div>
      )
    else
      return(
        <div className="loading-page">
          <img src="/images/orb.gif"/>
        </div>
      )
  }
}

export default Workspace;