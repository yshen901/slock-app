import React from 'react';
import { withRouter } from 'react-router-dom';

import { getWorkspace } from '../../actions/workspace_actions';
import { getChannels } from '../../actions/channel_actions';


// TODO2: CHANGE THIS FROM A COMPONENT TO A CUSTOM ROUTE
// NOTE : ESSENTIALLY PROVIDES A REDIRECT
class WorkspaceTransition extends React.Component {

  loadWorkspace(address) {
    this.props.history.replace(`/workspace/${address}/0`);
  }

  componentDidMount() {
    this.loadWorkspace(this.props.match.params.workspace_address);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.match.params.workspace_address !== this.props.match.params.workspace_address)
      this.loadWorkspace(this.props.match.params.workspace_address);
  }

  render() {
    return <div>Loading</div>
  }
}

export default withRouter(WorkspaceTransition);