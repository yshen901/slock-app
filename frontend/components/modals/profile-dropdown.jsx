import React from 'react';
import { withRouter } from 'react-router-dom';

import { logout } from '../../actions/session_actions';
import { logoutWorkspace } from '../../actions/workspace_actions';
import { workspaceTitle } from '../../selectors/selectors';
import { toggleElements } from '../../util/modal_api_util';

class ProfileDropdown extends React.Component {
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
    let { workspace_id, user_id } = getState().session;
    dispatch(logoutWorkspace(workspace_id))
    .then(
      () => {
        this.props.loginACChannel.speak(
          {
            workspace_data: {
              user_id,
              logged_in: false,
              workspace_id
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
      toggleElements("dropdown profile")
    };
  }

  render() {
    return (
      <div className="dropdown profile hidden">
        <div className="dropdown-item" onClick={this.toggleElement("edit-profile-modal")}>
          Edit Profile
        </div>
        <div className="horizontal-divider"></div>
        <div className="dropdown-item" onClick={this.logoutWorkspace}>
          Sign out of <em>{workspaceTitle(this.props.match.params.workspace_address)}</em>
        </div>
      </div>
    )
  }
}

export default withRouter(ProfileDropdown);