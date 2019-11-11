import React from 'react';
import { Link } from 'react-router-dom';
import { objectToArray } from '../../selectors/selectors';
import { getWorkspaces } from '../../actions/workspace_actions';

class WorkspaceDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (getState().session.user_id)
      dispatch(getWorkspaces());
  }

  render() {
    let workspaces = objectToArray(getState().entities.workspaces);
    return (
      <div className={this.props.dropdownClass()}>
        <div className="dropdown-workspaces">
          {workspaces.map((workspace, idx) => {
            return (
              <div key={idx} className="dropdown-item" onClick={() => this.props.redirectTo(`/workspace/${workspace.address}/0`)}>
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