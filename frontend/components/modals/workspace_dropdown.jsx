import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import { objectToArray, workspaceTitle } from '../../selectors/selectors';
import { logout } from '../../actions/session_actions';
import { hideElements } from '../../util/modal_api_util';

class WorkspaceDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.workspaceList = this.workspaceList.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
  }

  // NOTE: this.props.history IS SHARED...IF YOU WANT TO REDIRECT DON'T PASS AROUND THE REDIRECT JUST DO IT DIRECTLY HERE
  workspaceList() {
    let workspaces = objectToArray(getState().entities.workspaces);
    if (workspaces.length > 0)
      return (
        <div className="dropdown-workspaces">
          {workspaces.map((workspace, idx) => {
            return (
              <div key={idx} className="dropdown-item" onClick={() => this.props.history.push(`/workspace/${workspace.address}/0`)}>
                &#9824; {workspaceTitle(workspace.address)}
              </div>
            )
          })}
        </div>
      )
  }

  logoutUser(e) {
    e.stopPropagation();
    hideElements("dropdown");
    dispatch(logout())
    .then(
      () => {
        this.props.history.push('/');
      }
    )
  }

  render() {
    return (
      <div className="dropdown hidden">
        {this.workspaceList()}
        <div className="dropdown-auth-links">
          <Link className="dropdown-link" to="/create">Create a new workspace</Link>
          <Link className="dropdown-link" to="/signin">Sign into another workspace</Link>
          <div className="dropdown-link" onClick={this.logoutUser}>Sign Out</div>
        </div>
      </div>
    )
  }
}

export default withRouter(WorkspaceDropdown);