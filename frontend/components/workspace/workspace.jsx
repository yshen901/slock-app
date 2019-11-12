import React from 'react';
import WorkspaceSidebarContainer from "./workspace_sidebar_container"
import ChannelContainer from '../channel/channel_container';
import ChannelModalContainer from '../modals/channel_modal_container';
import NewChannelModalContainer from '../modals/new_channel_modal_container';
import SidebarDropdown from '../modals/sidebar_dropdown';

import { hideElement } from '../../util/modal_api_util';


class Workspace extends React.Component {
  constructor() {
    super();
  }

  // TODO2: This is an N+1 query, figure out a way to not run this if channels are already loaded
  componentDidMount() {
    let { workspaces, workspace_address, channel_id, getChannels } = this.props;
    let valid = false;

    for (let i = 0; i < workspaces.length; i++) {
      if (workspaces[i].address === workspace_address) {
        valid = true;
        getChannels(workspaces[i].id)
          .then(
            ({ channels }) => {
              if (getState().entities.channels[channel_id] === undefined)
                this.props.history.replace(`/workspace/${workspace_address}/${channels[0].id}`)
            }
          )
      }
    }
    if (!valid) this.props.history.replace('/signin');
  }

  // Makes sure you don't go to an invalid channel
  componentDidUpdate(oldProps) {
    if (oldProps.match.params.channel_id !== this.props.match.params.channel_id)
      if (getState().entities.channels[this.props.match.params.channel_id] === undefined)
        this.props.history.goBack(); //NOTE: BASICALLY GOES BACK TO BEFORE
  }

  render() {
    return (
      <div id="workspace" onClick={() => hideElement("dropdown sidebar")}>
        <WorkspaceSidebarContainer />
        <ChannelContainer />

        <SidebarDropdown />
        <ChannelModalContainer />
        <NewChannelModalContainer />
      </div>
    )
  }
}

export default Workspace;