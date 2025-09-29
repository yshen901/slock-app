import React from 'react';
import { withRouter } from '../../withRouter';

// TODO2: CHANGE THIS FROM A COMPONENT TO A CUSTOM ROUTE
// NOTE : ESSENTIALLY PROVIDES A REDIRECT
class WorkspaceTransition extends React.Component {

  loadWorkspace(address) {
    this.props.navigate(`/workspace/${address}/0`, { replace: true });
  }

  componentDidMount() {
    this.loadWorkspace(this.props.params.workspace_address);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.params.workspace_address !== this.props.params.workspace_address)
      this.loadWorkspace(this.props.params.workspace_address);
  }

  render() {
    return <div>Loading</div>
  }
}

export default withRouter(WorkspaceTransition);