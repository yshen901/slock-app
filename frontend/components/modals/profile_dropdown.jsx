import React from 'react';

import { logout } from '../../actions/session_actions';
import { updateWorkspaceUser } from '../../actions/user_actions';
import { logoutWorkspace } from '../../actions/workspace_actions';
import { getUserActivity, getUserName, workspaceTitle } from '../../selectors/selectors';
import { hideElements, toggleFocusElements } from '../../util/modal_api_util';

import { withRouter } from '../../withRouter';

class ProfileDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.logoutUser = this.logoutUser.bind(this);
    this.logoutWorkspace = this.logoutWorkspace.bind(this);
    this.toggleButton = this.toggleButton.bind(this);
    this.updateWorkspaceUser = this.updateWorkspaceUser.bind(this);
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
    let { workspace_id } = getState().session;
    let { user } = this.props;  
    dispatch(logoutWorkspace(workspace_id))
    .then(
      () => {
        this.props.loginACChannel.speak(
          {
            workspace_data: {
              user,
              logged_in: false,
              workspace_id
            }
          }
        )
        this.props.navigate('/');
        }
      )
  }

  // stops propagation and executes a function
  toggleButton(cb) {
    return (e) => {
      e.stopPropagation();
      hideElements("dropdown-modal");
      cb();
    }
  }

  updateWorkspaceUser(workspace_user) {
    let { users } = getState().entities;
    let { workspace_id, user_id, user_channel_ids } = getState().session;
    dispatch(updateWorkspaceUser(workspace_id, workspace_user))
      .then(() => {
        this.props.loginACChannel.speak({
          workspace_data: {
            user: users[user_id],
            logged_in: true,
            user_channel_ids: user_channel_ids,
            workspace_id
          }
        });
      })
  }

  render() {
    let { user, showUser } = this.props;
    let userStatus = user.status ? user.status.slice(0, 22) + (user.status.length > 23 ? "..." : user.status.slice(22, 23)) : "Set your status";

    return (
      <div className="dropdown-modal profile hidden" onClick={() => hideElements("dropdown-modal")}>
        <div className="dropdown profile" onClick={e => e.stopPropagation()}>
          <div className="dropdown-header">
            <div className="dropdown-image-container">
              <img src={user.photo_url}/>
            </div>
            <div className="dropdown-content">
              <div className="dropdown-content-top">{getUserName(user)}</div>
              <div className="dropdown-content-bottom">
                <i className={getUserActivity(user)}></i>
                <div>{ user.active ? "Active" : "Away" }</div>
              </div>
            </div>
          </div>
          <div className="dropdown-input" onClick={this.toggleButton(toggleFocusElements("edit-profile-status-modal", "edit-profile-status-input"))}>
            <i className="far fa-smile"></i>
            <div className="input-message">{userStatus}</div>
          </div>
          <div className="dropdown-item" onClick={this.toggleButton(() => this.updateWorkspaceUser({active: !user.active}))}>
            Set yourself as <strong>{ user.active ? "away" : "active"}</strong>
          </div>
          <div className="dropdown-item" onClick={this.toggleButton(() => this.updateWorkspaceUser({paused: !user.paused}))}>
            { user.paused ? "Unpause" : "Pause"} notifications
          </div>
          <div className="horizontal-divider"></div>
          <div className="dropdown-item" onClick={this.toggleButton(showUser)}>
            Profile
          </div>
          <div className="horizontal-divider"></div>
          <div className="dropdown-item" onClick={this.logoutWorkspace}>
            Sign out of <em>{workspaceTitle(this.props.params.workspace_address)}</em>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(ProfileDropdown);