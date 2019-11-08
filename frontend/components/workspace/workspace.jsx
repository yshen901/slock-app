import React from 'react';
import WorkspaceSidebarContainer from "./workspace_sidebar_container"
import ChannelModalContainer from './workspace_modals/channel_modal_container';

class Workspace extends React.Component {
  constructor() {
    super();

    this.state = {
      channel: "hidden"
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
        <div id="channel-chat">
          <div id="channel-nav-bar"></div>
          <div id="channel-chat"></div>
        </div>

        <ChannelModalContainer
          hidden={this.state["channel"]}
          close={() => this.toggle("channel")} />
      </div>
    )
  }
}

export default Workspace;