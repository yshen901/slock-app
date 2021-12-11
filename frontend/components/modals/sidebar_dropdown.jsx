import React from 'react';
import { withRouter } from 'react-router-dom';

import { logout } from '../../actions/session_actions';
import { logoutWorkspace } from '../../actions/workspace_actions';
import { toggleElements } from '../../util/modal_api_util';

class SidebarDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.logoutUser = this.logoutUser.bind(this);
    this.logoutWorkspace = this.logoutWorkspace.bind(this);
    this.toggleElement = this.toggleElement.bind(this);
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
        this.props.loginACChannel.speak(
          {
            workspace_data: {
              user_id: getState().session.user_id,
              logged_in: false
            }
          }
        )
        this.props.history.push('/');
        }
      )
  }

  toggleElement(className) {
    return (e) => {
      e.stopPropagation();
      toggleElements(className);
      toggleElements("dropdown sidebar")
    };
  }

  render() {
    return (
      <div className="dropdown sidebar hidden">
        <div className="dropdown-item" onClick={this.toggleElement("edit-profile-modal")}>
          Edit Profile
        </div>
        <div className="dropdown-item" onClick={() => this.props.history.push("/create")}>
          Create a new workspace
        </div>
        <div className="dropdown-item" onClick={() => this.props.history.push("/signin")}>
          Sign into another workspace
        </div>
        <div className="dropdown-item" onClick={this.logoutWorkspace}>
          Sign out of <em>{this.props.match.params.workspace_address}</em>
        </div>
        <div className="dropdown-item" onClick={this.logoutUser}>
          Sign out of account
        </div>
        <div className="horizontal-divider"></div>
        <div className="dropdown-item" onClick={() => this.props.history.push("/")}>
          Back to Home
        </div>
      </div>
    )
  }
}

export default withRouter(SidebarDropdown);