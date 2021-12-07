import React from 'react';
import { withRouter } from 'react-router-dom';
import { hideElements, revealElements } from '../../util/modal_api_util';

class BrowseDmChannelModal extends React.Component {
  constructor() {
    super();

    this.state = {
      search: ""
    }

    this.switchForm = this.switchForm.bind(this);
    this.goToChannel = this.goToChannel.bind(this);
    this.update = this.update.bind(this);

    this.allUsers = this.allUsers.bind(this);
  }

  update(e) {
    this.setState({search: e.currentTarget.value});
  }

  switchForm() {
    hideElements("full-modal channel-modal");
    revealElements("new-channel-modal");
  }

  goToChannel(channel_id) {
    hideElements("full-modal channel-modal")
    let workspace_address = this.props.match.params.workspace_address;
    this.props.history.push(`/workspace/${workspace_address}/${channel_id}`);
  }

  allUsers() {
    let channelsDisplay = [];
    let users = getState().entities.users;
    let usersArray = Object.values(users);

    // Only display users once someone has started to search
    if (this.state.search.length > 0) {
      let user;
      for (let i = 0; i < usersArray.length; i++) {
        user = usersArray[i];
        if (user.email.startsWith(this.state.search))
          channelsDisplay.push(
            <div className="full-modal-item" key={i} onClick={() => this.goToChannel(user_channels[i])}>
              # {user.email}
            </div>
          )
      }
    }

    return (
      <div key={0}>
        <h1 className="full-modal-section-header">Search Results</h1>
        {channelsDisplay}
      </div>
    )
  }
  
  render() {
    return (
      <div className="full-modal dm-channel-modal hidden" onClick={e => e.stopPropagation()}>
        <div className="full-modal-button" onClick={ () => { hideElements("full-modal dm-channel-modal"); this.setState({ search: "" }); } }>&#10005;</div>
        <div className="full-modal-content">
          <div className="full-modal-header">
            <h1 className="full-modal-header-text">Search Users</h1>
            <div className="full-modal-header-button" onClick={this.switchForm}>Start Direct Message</div>
          </div>
          <div className="full-modal-search-bar">
            <i className='fas fa-search search-icon'></i> 
            <input type="text" className="channel-search-bar"
              onChange={this.update}
              value={this.state.search}
              placeholder="Search channels"/>
          </div>
          <div className="full-modal-list">
            { this.allUsers(this.state.search) }
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(BrowseDmChannelModal);