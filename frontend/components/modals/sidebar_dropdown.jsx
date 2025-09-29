import React from 'react';

import { logout } from '../../actions/session_actions';
import { logoutWorkspace } from '../../actions/workspace_actions';
import { workspaceTitle } from '../../selectors/selectors';
import { hideElements, toggleFocusElements } from '../../util/modal_api_util';

import { withRouter } from '../../withRouter';

class SidebarDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      workspaceTitle: workspaceTitle(this.props.params.workspace_address)
    };

    this.logoutUser = this.logoutUser.bind(this);
    this.logoutWorkspace = this.logoutWorkspace.bind(this);
  }

  logoutUser(e) {
    e.stopPropagation();
    dispatch(logout())
      .then(
        () => this.props.navigate('/')
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
              user: user_id,
              logged_in: false,
              workspace_id
            }
          }
        )
        this.props.navigate('/');
        }
      )
  }

  render() {
    return (
      <div className="dropdown-modal sidebar hidden" onClick={() => hideElements("dropdown-modal sidebar")}>
        <div className="dropdown sidebar" onClick={e => e.stopPropagation()}>
          <div className="dropdown-header">
            <div className="dropdown-image-container">
              {this.state.workspaceTitle[0]}
            </div>
            <div className="dropdown-content">
              <div className="dropdown-content-top">{this.state.workspaceTitle}</div>
              <div className="dropdown-content-bottom">{this.props.params.workspace_address}</div>
            </div>
          </div>
          <div className="horizontal-divider"></div>
          <div className="dropdown-item" onClick={toggleFocusElements("invite-user-modal")}>
            Invite people to {this.state.workspaceTitle}
          </div>
          <div className="dropdown-item" onClick={toggleFocusElements("new-channel-modal")}>
            Create a channel
          </div>
          <div className="horizontal-divider"></div>
          <div className="dropdown-item" onClick={() => this.props.navigate("/create")}>
            Create a new workspace
          </div>
          <div className="dropdown-item" onClick={() => this.props.navigate("/signin")}>
            Sign into another workspace
          </div>
          <div className="horizontal-divider"></div>
          <div className="dropdown-item" onClick={this.logoutWorkspace}>
            Sign out of {this.state.workspaceTitle}
          </div>
          <div className="dropdown-item" onClick={() => this.props.navigate("/")}>
            Back to homepage
          </div>
        </div>
      </div>
      )
    }
}

export default withRouter(SidebarDropdown);