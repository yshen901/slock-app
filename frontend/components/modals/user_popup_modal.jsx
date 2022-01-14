import React from "react";
import { withRouter } from "react-router";
import { startDmChannel } from "../../actions/dm_channel_actions";
import { getLocalTime, getUserActivity, getUserName, getUserPaused } from "../../selectors/selectors";

class UserPopupModal extends React.Component {
  constructor(props) {
    super(props);

    this.openProfile = this.openProfile.bind(this);
    this.startChat = this.startChat.bind(this);
    this.startCall = this.startCall.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.props.hidePopup);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.props.hidePopup);
  }

  startChat(userId) {
    return e => {     
      e.stopPropagation();
      this.props.hidePopup();

      let { user_id, workspace_id } = getState().session;
      dispatch(startDmChannel({
        user_1_id: user_id,
        user_2_id: userId,
        workspace_id: workspace_id
      })).then(
        ({dmChannelUser}) => {
          let {channel_id} = dmChannelUser;
          let {workspace_address} = this.props.match.params;
          this.props.history.push(`/workspace/${workspace_address}/${channel_id}`);
        }
      )
    }
  }

  startCall(userId) {
    return e => {
      e.stopPropagation();
      this.props.hidePopup();
      let { user_id, workspace_id } = getState().session;
      dispatch(startDmChannel({
        user_1_id: user_id,
        user_2_id: userId,
        workspace_id: workspace_id
      })).then(
        ({dmChannelUser}) => {
          let {channel_id} = dmChannelUser;
          let {workspace_address} = this.props.match.params;
          this.props.startVideoCall(workspace_address, channel_id);
        }
      )
    }
  }

  openProfile(userId) {
    return e => {
      e.stopPropagation();
      this.props.showUser(userId);
      this.props.hidePopup();
    }
  }

  renderStatus() {
    let { user } = this.props;
    if (user.status)
      return (
        <div className="user-popup-section">
            <div className='section-title'>Status</div>
            <div className='section-content'>{'\u{1F4AC}'} {user.status}</div>
          </div>
      )
  }

  render() {
    let { hidePopup, user, calculatePos } = this.props;
    return (
      <div className="user-popup-modal">
        <div className="part-modal-background no-background" onClick={ () => { hidePopup(); } }></div>
        <div className="user-popup" style={calculatePos(!!user.status)}>
          <div className="user-popup-img">
            <img src={user.photo_url}/>
          </div>
          <div className="user-popup-header">
            <div className="user-popup-name">
              <div>{getUserName(user, true)}</div>
              <i className={getUserActivity(user)}>
                <div className={getUserPaused(user, true, true)}>z</div>
              </i>
            </div>
            <div className="user-popup-title">{user.what_i_do}</div>
          </div>
          <div className="user-popup-link" onClick={ this.openProfile(user.id) }>View full profile</div>
          <div className="user-popup-section">
            <div className='section-title'>Local time</div>
            <div className='section-content'>{getLocalTime(user)}</div>
          </div>
          { this.renderStatus() }
          <div className="user-popup-buttons">
            <div className="button" onClick={ this.startChat(user.id) }>Message</div>
            <div className="button" onClick={ this.startCall(user.id) }>Call</div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(UserPopupModal);