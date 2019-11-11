import React from 'react';
import { Link } from 'react-router-dom';
import { objectToArray } from '../../selectors/selectors';
import { getWorkspaces } from '../../actions/workspace_actions';

class WorkspaceDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.workspaceList = this.workspaceList.bind(this);
  }

  componentDidMount() {
    if (getState().session.user_id)
      dispatch(getWorkspaces());
  }

  workspaceList() {
    let workspaces = objectToArray(getState().entities.workspaces);
    if (workspaces.length > 0)
      return (
        <div className="dropdown-workspaces">
          {workspaces.map((workspace, idx) => {
            return (
              <div key={idx} className="dropdown-item" onClick={() => this.props.redirectTo(`/workspace/${workspace.address}/0`)}>
                &#9824; {workspace.address}
              </div>
            )
          })}
        </div>
      )
  }

  render() {
    return (
      <div className={this.props.dropdownClass()}>
        {this.workspaceList()}
        <div className="dropdown-auth-links">
          <Link className="dropdown-link" to="/signin">Sign Into Another Workspace</Link>
          <Link className="dropdown-link" to="/create">Create Workspace</Link>
        </div>
      </div>
    )
  }
}

export default WorkspaceDropdown;