import React from "react";
import { withRouter } from "react-router";
import { startDmChannel } from "../../../actions/dm_channel_actions";
import { photoUrl } from "../../../selectors/selectors";
import { toggleElements } from "../../../util/modal_api_util";

class PeopleBrowser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: ""
    }

    this.createDmChannel = this.createDmChannel.bind(this);
    this.goToChannel = this.goToChannel.bind(this);
    this.update = this.update.bind(this);

    this.allUsers = this.allUsers.bind(this);
  }

  update(e) {
    this.setState({search: e.currentTarget.value});
  }

  createDmChannel(userIds, workspaceId) {
    dispatch(startDmChannel({
      user_1_id: userIds[0], 
      user_2_id: userIds[1],
      workspace_id: workspaceId
    })).then(({dmChannelUser}) => {  // REMEMBER THE THING PASSED BACK IS ACTION
      this.goToChannel(dmChannelUser.channel_id);
      this.setState({search: ""});
    });
  }

  goToChannel(channel_id) {
    let workspace_address = this.props.match.params.workspace_address;
    this.props.history.push(`/workspace/${workspace_address}/${channel_id}`);
  }

  getUserInfo(user) {
    let icon = <i className="fas fa-circle inactive-circle"></i>
    if (user.logged_in)
      icon = <i className="fas fa-circle active-circle-dark"></i>

    let profileImage = <div className="browse-modal-user-image">
      <img src={photoUrl(user)}/>
    </div>

    return (
      <div className="channel-name">
        <div className="browse-modal-user-icon">
          {profileImage}
          {icon} 
        </div>
        <div>
          {user.email}
        </div>
      </div>
    )
  }


  allUsers() {
    let channelsDisplay = [];
    let users = getState().entities.users;
    let currentUserId = getState().session.user_id;
    let workspaceId = getState().session.workspace_id;

    let usersArray = Object.values(users);

    
    // Only display users once someone has started to search
    // if (this.state.search.length > 0) {
      let user;
      for (let i = 0; i < usersArray.length; i++) {
        user = usersArray[i];
        if (user.id != currentUserId && user.email.startsWith(this.state.search)) {
          channelsDisplay.push(
            <div 
              className="full-modal-item" key={i} 
              onClick={() => this.createDmChannel([currentUserId, usersArray[i].id], workspaceId)}>
              {this.getUserInfo(user)}
            </div>
          )
        }
      }
    // }

    return (
      <div key={0}>
        <h1 className="full-modal-section-header">Search Results</h1>
        {channelsDisplay}
      </div>
    )
  }

  render() {
    return (
      <div className="browser-channel" onClick={e => e.stopPropagation()}>
        <div className="browser-channel-nav">
          <h1 className="browser-channel-title">People</h1>
          <div className="browser-channel-action" onClick={() => toggleElements("invite-user-modal")}>Invite People</div>
        </div>
        <div className="browser-channel-search">
          <i className='fas fa-search search-icon'></i> 
          <input type="text" id="search-bar"
            onChange={this.update}
            value={this.state.search}
            placeholder="i.e. shen.yuci1@gmail.com"
            autoFocus/>
        </div>
        <div className="browser-channel-list">
          { this.allUsers(this.state.search) }
        </div>
      </div>
    )
  }
}

export default withRouter(PeopleBrowser);