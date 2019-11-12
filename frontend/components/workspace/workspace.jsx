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
    this.props.getWorkspace(this.props.workspace_address)
      .then(
        ({workspace}) => this.props.getChannels(workspace.id)
          .then(
            ({channels}) => {
              if (getState().entities.channels[this.props.channel_id] === undefined)
                this.props.history.replace(`/workspace/${this.props.workspace_address}/${channels[0].id}`)
            }
          ),
        () => this.props.history.push('signin')
      )
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