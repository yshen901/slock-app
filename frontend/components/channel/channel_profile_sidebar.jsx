import React from 'react';
import { withRouter } from 'react-router';
import { startDmChannel } from "../../actions/dm_channel_actions";
import { getLocalTime, getUserActivity, getUserName, getUserPaused } from '../../selectors/selectors';
import { toggleFocusElements } from '../../util/modal_api_util';

class ProfileSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.startChat = this.startChat.bind(this);
    this.startCall = this.startCall.bind(this);
  }

  // BUTTON ACTIONS
  startChat() {
    dispatch(startDmChannel({
      user_1_id: getState().session.user_id,
      user_2_id: this.props.userId,
      workspace_id: getState().session.workspace_id
    })).then(
      ({dmChannelUser}) => {
        let {channel_id} = dmChannelUser;
        let {workspace_address} = this.props.match.params;
        this.props.history.push(`/workspace/${workspace_address}/${channel_id}`);
      }
    )
  }

  startCall() {
    dispatch(startDmChannel({
      user_1_id: getState().session.user_id,
      user_2_id: this.props.userId,
      workspace_id: getState().session.workspace_id
    })).then(
      ({dmChannelUser}) => {
        let {channel_id} = dmChannelUser;
        let {workspace_address} = this.props.match.params;
        this.props.startVideoCall(workspace_address, channel_id);
      }
    )
  }

  // RENDER HELPER FUNCTIONS
  profileName(user) {
    let name;
    if (user.full_name != "")
      name = user.full_name;
    else if (user.display_name != "")
      name = user.display_name;
    else
      name = user.email;

    return (
      <div>{name}</div>
    )
  }

  phoneNumber(user) {
    if (user.phone_number) {
      let phoneNum = user.phone_number.slice(0, 3) + "-" + user.phone_number.slice(3, 6) + user.phone_number.slice(6, 10);
      return (
        <div className="profile-sidebar-section">
          <div className="profile-sidebar-section-name">Phone Number</div>
          <div className="profile-sidebar-section-content">{phoneNum}</div>
        </div>
      )
    }
  }

  displayName(user) {
    if (user.display_name) {
      return (
        <div className="profile-sidebar-section">
          <div className="profile-sidebar-section-name">Display Name</div>
          <div className="profile-sidebar-section-content">{user.display_name}</div>
        </div>
      )
    }
  }

  email(user) {
    return (
      <div className="profile-sidebar-section">
        <div className="profile-sidebar-section-name">Email</div>
        <div className="profile-sidebar-section-content">{user.email}</div>
      </div>
    )
  }

  localTime(user) {
    return (
      <div className="profile-sidebar-section">
        <div className="profile-sidebar-section-name">Local time</div>
        <div className="profile-sidebar-section-content">{getLocalTime(user)}</div>
      </div>
    )
  }

  sidebarButtons(user) {
    if (user.id != getState().session.user_id)
      return (
        <div id="profile-sidebar-buttons" className="no-highlight">
          <div className="profile-sidebar-button" onClick={this.startChat}>
            <div className="button-icon">
              <i className="fas fa-comment-dots"></i>
            </div>
            <div className="button-description">
              Message
            </div>
          </div>
          <div className="profile-sidebar-button" onClick={this.startCall}>
            <div className="button-icon">
              <i className="fas fa-phone-alt"></i>
            </div>
            <div className="button-description">
              Call
            </div>
          </div>
        </div>
      )
    else 
      return (
        <div id="profile-sidebar-buttons">
          <div className="profile-sidebar-button" onClick={toggleFocusElements("edit-profile-status-modal", "edit-profile-status-input")}>
            <div className="button-icon">
              <i className='far fa-smile'></i>
            </div>
            <div className="button-description">
              {user.status ? "Edit" : "Set"} status
            </div>
          </div>
          <div className="profile-sidebar-button" onClick={toggleFocusElements("edit-profile-modal")}>
            <div className="button-icon">
              <i className='fas fas fa-pen'></i>
            </div>
            <div className="button-description">
              Edit profile
            </div>
          </div>
        </div>
      )
  }

  render() {
    let { hideUser, userId } = this.props;
    let user = getState().entities.users[userId];

    return (
      <div className="channel-profile-sidebar"> 
        <div className="profile-sidebar-title">
          <h1>Profile</h1>
          <div onClick={hideUser}>&#10005;</div>
        </div>
        <div id="profile-sidebar-content">
          <div id="profile-sidebar-picture">
            <img src={user.photo_url}/>
          </div>
          <div id="profile-sidebar-overview">
            <div id="profile-sidebar-name">
              <div>{getUserName(user, true)}</div>
              <i className={getUserActivity(user, true, true)}>
                <div className={getUserPaused(user, true, true)}>z</div>
              </i>
            </div>
            <div id="profile-sidebar-occupation">{user.what_i_do}</div>
            <div id="profile-sidebar-status">{user.status}</div>
          </div>
          {this.sidebarButtons(user)}
          <div id="profile-sidebar-sections">
            {this.displayName(user)}
            {this.email(user)}
            {this.phoneNumber(user)}
            {this.localTime(user)}
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(ProfileSidebar);