import React from 'react';
import WorkspaceSidebarContainer from "./workspace_sidebar_container"
import ChannelModalContainer from '../modals/channel_modal_container';
import NewChannelModalContainer from '../modals/new_channel_modal_container';

class Workspace extends React.Component {
  constructor() {
    super();

    this.state = {
      channelBrowse: "hidden",
      channelNew: "hidden"
    }

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.props.getWorkspace(this.props.workspace_address)
      .then(
        null,
        () => this.props.history.push('/')
      )
  }

  toggle(modal) {
    if (this.state[modal] === "hidden")
      this.setState({ [modal]: "" });
    else
      this.setState({ [modal]: "hidden" });
  }

  render() {
    return (
      <div id="workspace">
        <WorkspaceSidebarContainer toggle={this.toggle}/>

        <ChannelModalContainer
          hidden={this.state["channelBrowse"]}
          close={() => this.toggle("channelBrowse")} />

        <NewChannelModalContainer
          hidden={this.state["channelNew"]}
          close={() => this.toggle("channelNew")} />
      </div>
    )
  }
}

export default Workspace;