import React from 'react';
import { withRouter } from 'react-router';
import { DEFAULT_PHOTO_URL, dmChannelUserId, getUserName, photoUrl, userInSearch } from '../../selectors/selectors';
import { hideElements, toggleFocusElements } from '../../util/modal_api_util';

class ChannelDetailsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: "About",
      search: ""
    }

    this.starClick = this.starClick.bind(this);
    this.userClick = this.userClick.bind(this);
    this.leaveChannel = this.leaveChannel.bind(this);
  }

  userClick(userId) {
    return (e) => {
      e.stopPropagation();
      hideElements("channel-details-modal");
      this.props.showUser(userId);
    }
  }

  starClick(e) {
    let { channel } = this.props;
    this.props.updateChannelUser({ starred: !channel.starred, channel_id: channel.id })
      .then(
        () => this.setState(this.state)
      );
  }

  star() {
    let {channel} = this.props;
    if (channel.dm_channel)
      return;
    else if (channel.starred)
      return (
        <div className='channel-details-button' id="star filled hidden" onClick={this.starClick}>
          <i className='fas fa-star'></i>
        </div>
      );
    else
      return(
        <div className='channel-details-button' id = "star empty" onClick={this.starClick}>
          <i className='far fa-star' ></i>
        </div >
      );
  }

  leaveChannel() {
    return e => {
      this.props.leaveChannel(e);
      hideElements("channel-details-modal");
    }
  }

  leaveSection() {
    if (this.props.canLeave)
     return (
       <div>
        <div className="horizontal-divider"></div>
        <div className="section" onClick={this.leaveChannel()}>
          <div className="section-header">
            <div className="section-name magenta bold-700">Leave Channel</div>
          </div>
        </div>
       </div>
     )
  }
  
  channelTabContent() {
    let { channel, channel_users, current_user_id } = this.props;
    let { search } = this.state;

    switch(this.state.tab) {
      case "About": // all of the channel's information
        return (
          <div className="tab-content">
            <div className="block">
            <div className="section" onClick={toggleFocusElements("edit-channel-name-modal", "channel-name-input")}>
                <div className="section-header">
                  <div className="section-name">Channel name</div>
                  <div className="section-edit" onClick={toggleFocusElements("edit-channel-name-modal", "channel-name-input")}>Edit</div>
                </div>
                <div className="section-content">
                  #&nbsp;{ channel.name }
                </div>
              </div>
            </div>
            <div className="block">
              <div className="section" onClick={toggleFocusElements("edit-channel-topic-modal", "channel-topic-input")}>
                <div className="section-header">
                  <div className="section-name">Topic</div>
                  <div className="section-edit" onClick={toggleFocusElements("edit-channel-topic-modal", "channel-topic-input")}>Edit</div>
                </div>
                <div className={channel.topic ? "section-content" : "section-content gray"}>
                  { channel.topic ? channel.topic : "Add a topic" }
                </div>
              </div>
              <div className="horizontal-divider"></div>
              <div className="section" onClick={toggleFocusElements("edit-channel-description-modal", "channel-description-input")}>
                <div className="section-header">
                  <div className="section-name">Description</div>
                  <div className="section-edit" onClick={toggleFocusElements("edit-channel-description-modal", "channel-description-input")}>Edit</div>
                </div>
                <div className={channel.description ? "section-content" : "section-content gray"}>
                  { channel.description ? channel.description : "Add a description" }
                </div>
              </div>              
              <div className="horizontal-divider"></div>
              <div className="section">
                <div className="section-header">
                  <div className="section-name">Created on</div>
                </div>
                <div className="section-content">
                  { new Date(channel.created_at).toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"}) }
                </div>
              </div>
              { this.leaveSection() }
            </div>
          </div>
        )
      case "Members": // search bar with members list
        return (
          <div className="tab-content members">
            <div className="search-bar">
              <i className='fas fa-search search-icon gray'></i> 
              <input type="text"
                onChange={e => this.setState({search: e.currentTarget.value})}
                value={this.state.search}
                placeholder="Find members"
                autoFocus/>
            </div>
            <div className="members-list">
              { channel_users.map((channel_user, idx) => {
                if (!userInSearch(channel_user, search)) return;
                return (
                  <div className="member" key={idx} onClick={this.userClick(channel_user.id)}>
                    <div className="member-icon">
                      <img src={channel_user.photo_url ? channel_user.photo_url : DEFAULT_PHOTO_URL}/>
                    </div>
                    <div className="member-name">
                      {getUserName(channel_user)} {channel_user.id == current_user_id ? "(you)" : ""}
                    </div>
                    <div className="member-status">
                      <i className={channel_user.logged_in ? "fas fa-circle active-circle-dark" : "fas fa-circle inactive-circle"}></i>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      default: 
        return (
          <div className="tab-content"></div>
        )
    }
  }

  dmTabContent() {
    let { channel, users, current_user_id } = this.props;
    let otherUser = users[dmChannelUserId(channel, current_user_id)];

    switch(this.state.tab) {
      case "About":
        return (
          <div className="tab-content">
            <div className="block">
              <div className="section">
                <div className="section-content">
                  <i class="far fa-envelope"></i>
                  <div>{otherUser.email}</div>
                </div>
                <div className="section-link" onClick={this.userClick(current_user_id)}>View full profile</div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="tab-content"></div>
        )
    }
  }

  render() {
    let { channel, users, current_user_id } = this.props;

    if (!channel)
      return (
        <div className="channel-details-modal hidden"></div>
      )
    else if (channel.dm_channel) {
      let otherUser = users[dmChannelUserId(channel, current_user_id)];
      return (
        <div className="channel-details-modal hidden">
          <div className="part-modal-background" onClick={() => hideElements("channel-details-modal")}></div>
          <div className="channel-details">
            <div className="title">
              <div className="title-image">
                <img src={photoUrl(otherUser)}/>
              </div>
              <div>{getUserName(otherUser)}</div>
            </div>
            <div className="buttons">
              {this.star()}
            </div>
            <div className="tab-buttons">
              <div className={this.state.tab == "About" ? "selected" : ""} onClick={e => this.setState({tab: "About"})}>About</div>
            </div>
            { this.dmTabContent() }
          </div>
        </div>
      )
    }
    else
      return (
        <div className="channel-details-modal hidden">
          <div className="part-modal-background" onClick={() => hideElements("channel-details-modal")}></div>
          <div className="channel-details">
            <div className="modal-header">
              <div className="title">#&nbsp;{channel.name}</div>
              <div className="modal-close-button" onClick={() => hideElements("channel-details-modal")}>&#10005;</div>
            </div>
            <div className="buttons">
              {this.star()}
            </div>
            <div className="tab-buttons">
              <div className={this.state.tab == "About" ? "selected" : ""} onClick={e => this.setState({tab: "About"})}>About</div>
              <div className={this.state.tab == "Members" ? "selected" : ""} onClick={e => this.setState({tab: "Members"})}>Members</div>
            </div>
            { this.channelTabContent() }
          </div>
        </div>
      )
  }
}

export default withRouter(ChannelDetailsModal);