import React from "react";
import { getUserActivity, getUserName, getUserPaused, sortedUsers, userInSearch } from "../../../selectors/selectors";
import { toggleFocusElements } from "../../../util/modal_api_util";

import { withNavigate, withParams } from "../../../withRouter";

class PeopleBrowser extends React.Component {
  constructor(props) {
    super(props);

    // capSearch is so we don't have to do uppercase on caps everytime
    this.state = {
      search: "",
      capSearch: ""
    }

    this.createDmChannel = this.createDmChannel.bind(this);
    this.goToChannel = this.goToChannel.bind(this);
    this.update = this.update.bind(this);

    this.allUsers = this.allUsers.bind(this);
  }

  update(e) {
    this.setState({
      search: e.currentTarget.value,
      capSearch: e.currentTarget.value.toUpperCase()
    });
  }

  createDmChannel(userIds, workspaceId) {
    this.props.startDmChannel({
      user_1_id: userIds[0], 
      user_2_id: userIds[1],
      workspace_id: workspaceId
    }).then(({dmChannelUser}) => {  // REMEMBER THE THING PASSED BACK IS ACTION
      this.goToChannel(dmChannelUser.channel_id);
      this.setState({
        search: "",
        capSearch: ""
      });
    });
  }

  goToChannel(channel_id) {
    let workspace_address = this.props.params.workspace_address;
    this.props.navigate(`/workspace/${workspace_address}/${channel_id}`);
  }

  getUserInfo(user) {
    let profileImage = <div className="browse-modal-user-image">
      <img src={user.photo_url}/>
    </div>

    return (
      <div className="browse-modal-user no-highlight">
        {profileImage}
        <div className="browse-modal-user-info">
          <div className="browse-modal-username">
            {getUserName(user)} {user.id == this.props.user_id ? "(you)" : ""}
            <div className="user-activity-icon">
              <i className={getUserActivity(user, true, true)}>
                <div className={getUserPaused(user, true, true)}>z</div>
              </i>
            </div>
          </div>
          <div className="browse-modal-occupation">
            {user.what_i_do}
          </div>
        </div>
      </div>
    )
  }

  allUsers() {
    let channelsDisplay = [];
    let { users } = this.props;

    let usersArray = this.state.capSearch ? sortedUsers(users) : Object.values(users);
    
    // if (this.state.search.length > 0) {
    for (let i = 0; i < usersArray.length && i < 50; i++) {
      if (userInSearch(usersArray[i], this.state.capSearch)) {
        channelsDisplay.push(
          <div 
            key={i} 
            onClick={() => this.props.showUser(usersArray[i].id)}>
            {this.getUserInfo(usersArray[i])}
          </div>
        )
      }
    }
    
    for (let i = 0; i < 10; i++) {
      channelsDisplay.push(
        <div key={i + usersArray.length}>
          <div className="browse-modal-user placeholder"></div>
        </div>
      );
    }

    return channelsDisplay;
  }

  render() {
    let channelsDisplay = this.allUsers(this.state.search);

    return (
      <div className="browser-channel" onClick={e => e.stopPropagation()}>
        <div className="browser-channel-top">
          <div className="browser-channel-nav">
            <h1 className="browser-channel-title">People</h1>
            <div className="browser-channel-action no-highlight people" onClick={toggleFocusElements("invite-user-modal", "invite-user-input")}>Invite People</div>
          </div>
          <div className="browser-channel-search">
            <i className='fas fa-search search-icon'></i> 
            <input type="text" id="search-bar"
              onChange={this.update}
              value={this.state.search}
              placeholder="Search by name or email"
              autoFocus/>
          </div>
          <h1 className="browser-channel-header">
            {channelsDisplay.length - 10} {this.state.search ? (channelsDisplay.length == 11 ? "result" : "results") : "recommended results"}
          </h1>
        </div>
        <div className="browser-channel-content">
          <div className="browser-channel-grid">
            {channelsDisplay}
          </div>
        </div>
      </div>
    )
  }
}

export default withNavigate(PeopleBrowser);