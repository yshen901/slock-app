import React from 'react';
import { Link } from 'react-router-dom';
import { objectToArray } from '../../selectors/selectors';

class WorkspaceDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let workspaces = objectToArray(getState().entities.workspaces);
    return (
      <div className={this.props.dropdownClass()}>
        <div className="dropdown-workspaces">
          {workspaces.map((workspace, idx) => {
            return (
              <div className="dropdown-item" onClick={() => this.props.redirectTo(`/workspace/${workspace.address}`)}>
                &#9824; {workspace.address}
              </div>
            )
          })}
        </div>
        <div className="dropdown-auth-links">
          <Link className="dropdown-link" to="/signin">Sign Into Another Workspace</Link>
          <Link className="dropdown-link" to="/create">Create Workspace</Link>
        </div>
      </div>
    )
  }
}

export default WorkspaceDropdown;