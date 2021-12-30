import React from 'react';
import { withRouter } from 'react-router';
import { DEFAULT_PHOTO_URL } from '../../selectors/selectors';
import { hideElements, toggleElements } from '../../util/modal_api_util';

class ChannelDetailsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: "About",
      search: ""
    }

    this.starClick = this.starClick.bind(this);
    this.toggleElements = this.toggleElements.bind(this);
  }

  toggleElements(className, inputId) {
    return (e) => {
      e.stopPropagation();
      toggleElements(className);
      focus(inputId)
    }
  }

  starClick(e) {
    let { channel } = this.props;
    this.props.updateChannelUser({ starred: !channel.starred, channel_id: channel.id })
      .then(
        () => this.setState(this.state)
      )
  }

  star() {
    let {channel} = this.props
    if (channel.dm_channel)
      return null
    else if (this.props.channel.starred)
      return (
        <div className='channel-details-button' id="star filled hidden" onClick={this.starClick}>
          <i className='fas fa-star'></i>
        </div>
      )
    else
      return(
        <div className='channel-details-button' id = "star empty" onClick={this.starClick}>
          <i className='far fa-star' ></i>
        </div >
      )
  }

  leaveSection() {
    if (this.props.canLeave)
     return (
       <div>
        <div className="horizontal-divider"></div>
        <div className="section">
          <div className="section-header">
            <div className="section-name magenta bold-700" onClick={this.props.leaveChannel}>Leave Channel</div>
          </div>
        </div>
       </div>
     )
  }
  
  tabContent() {
    let { channel, users, current_user_id } = this.props;
    let { search } = this.state;

    switch(this.state.tab) {
      case "About": // all of the channel's information
        return (
          <div className="tab-content">
            <div className="block">
              <div className="section">
                <div className="section-header">
                  <div className="section-name">Channel name</div>
                </div>
                <div className="section-content">
                  #&nbsp;{ channel.name }
                </div>
              </div>
            </div>
            <div className="block">
              <div className="section">
                <div className="section-header">
                  <div className="section-name">Topic</div>
                  <div className="section-edit" onClick={this.toggleElements("edit-channel-topic-modal", "channel-topic-input")}>Edit</div>
                </div>
                <div className={channel.topic ? "section-content" : "section-content gray"}>
                  { channel.topic ? channel.topic : "Add a topic" }
                </div>
              </div>
              <div className="horizontal-divider"></div>
              <div className="section">
                <div className="section-header">
                  <div className="section-name">Description</div>
                  <div className="section-edit">Edit</div>
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
          <div className="tab-content">
            <input className="search-bar" value={this.state.search} onChange={e => this.setState({search: e.currentTarget.value})}></input>
            <div className="members-list">
              { Object.keys(channel.users).map((userId, idx) => {
                if (!users[userId].email.startsWith(search)) return;
                return (
                  <div className="member">
                    <div className="member-icon">
                      <img src={users[userId].photo_url ? users[userId].photo_url : DEFAULT_PHOTO_URL}/>
                    </div>
                    <div className="member-name">
                      {users[userId].email} {userId == current_user_id ? "(you)" : ""}
                    </div>
                    <div className="member-status">
                      <i className={users[userId].logged_in ? "fas fa-circle active-circle-dark" : "fas fa-circle inactive-circle"}></i>
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

  render() {
    let { channel } = this.props;
    if (!channel || channel.dm_channel)
      return (
        <div className="channel-details-modal"></div>
      )

    return (
      <div className="channel-details-modal">
        <div className="part-modal-background" onClick={() => hideElements("channel-details-modal")}></div>
        <div className="channel-details">
          <div className="title">#&nbsp;{channel.name}</div>
          <div className="buttons">
            {this.star()}
          </div>
          <div className="tab-buttons">
            <div className={this.state.tab == "About" ? "selected" : ""} onClick={e => this.setState({tab: "About"})}>About</div>
            <div className={this.state.tab == "Members" ? "selected" : ""} onClick={e => this.setState({tab: "Members"})}>Members</div>
          </div>
          { this.tabContent() }
        </div>
      </div>
    )
  }
}

export default withRouter(ChannelDetailsModal);