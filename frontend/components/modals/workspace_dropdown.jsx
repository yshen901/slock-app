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
    dispatch(logout())
    .then(
      () => {
        this.props.history.push('/');
      }
    )
  }

  render() {
    return (
      <div className="dropdown-modal workspaces hidden" onClick={(e) => { e.stopPropagation(); hideElements("dropdown-modal") }}>
        <div className="dropdown workspaces" onClick={e => e.stopPropagation()}>
          {this.workspaceList()}
          <div className="horizontal-divider"></div>
          <Link className="dropdown-item" to="/create">Create a new workspace</Link>
          <Link className="dropdown-item" to="/signin">Sign into another workspace</Link>
          <div className="dropdown-item" onClick={this.logoutUser}>Sign Out</div>
        </div>
      </div>
    )
  }
}

export default withRouter(WorkspaceDropdown);