import React from 'react';
import WorkspaceSidebarContainer from "./workspace_sidebar_container"
import ChannelContainer from '../channel/channel_container';
import ChannelModalContainer from '../modals/channel_modal_container';
import NewChannelModalContainer from '../modals/new_channel_modal_container';
import SidebarDropdown from '../modals/sidebar_dropdown';


class Workspace extends React.Component {
  constructor() {
    super();

    this.state = {
      channelBrowse: "hidden",
      channelNew: "hidden",
      sidebarDropdown: "hidden"
    }

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
    this.closeAll = this.closeAll.bind(this);
  }

  componentDidMount() {
    this.props.getWorkspace(this.props.workspace_address)
      .then(
        null,
        () => this.props.history.push('/')
      )
  }

  open(modal) {
    this.setState({ [modal]: "" });
  }

  close(modal) {
    this.setState({ [modal]: "hidden"})
  }

  toggle(modal) {
    if (this.state[modal] === "hidden")
      this.setState({ [modal]: "" });
    else
      this.setState({ [modal]: "hidden" });
  }

  closeAll() {
    this.setState({
      channelBrowse: "hidden",
      channelNew: "hidden",
      sidebarDropdown: "hidden"
    })
  }

  render() {
    return (
      <div id="workspace" onClick={this.closeAll}>
        <WorkspaceSidebarContainer open={this.open} toggle={this.toggle}/>
        <ChannelContainer />

        <SidebarDropdown 
          hidden={this.state["sidebarDropdown"]}
          workspace_address={this.props.workspace_address}/>

        <ChannelModalContainer
          hidden={this.state["channelBrowse"]}
          close={() => this.close("channelBrowse")} />

        <NewChannelModalContainer
          hidden={this.state["channelNew"]}
          close={() => this.close("channelNew")} />
      </div>
    )
  }
}

export default Workspace;