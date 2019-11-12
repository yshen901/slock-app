import React from 'react';
import { withRouter } from 'react-router-dom';

import { logout } from '../../actions/session_actions';
import { logoutWorkspace } from '../../actions/workspace_actions';

class SidebarDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.logoutUser = this.logoutUser.bind(this);
    this.logoutWorkspace = this.logoutWorkspace.bind(this);
  }

  logoutUser(e) {
    e.stopPropagation();
    dispatch(logout())
      .then(
        () => this.props.history.push('/')
      )
  }

  logoutWorkspace(e) {
    e.stopPropagation();
    dispatch(logoutWorkspace(getState().session.workspace_id))
      .then(
        () => {
          this.props.history.push('/');
        }
      )
  }

  render() {
    return (
      <div className="dropdown sidebar hidden">
        <div className="dropdown-item" onClick={this.logoutWorkspace}>
          Sign out of workspace
        </div>
        <div className="dropdown-item" onClick={this.logoutUser}>
          Sign out of account
        </div>
      </div>
    )
  }
}

export default withRouter(SidebarDropdown);