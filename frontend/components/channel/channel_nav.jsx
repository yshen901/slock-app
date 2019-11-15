import React from 'react';
import { toggleElements } from '../../util/modal_api_util';
import { updateChannel } from '../../actions/channel_actions';

class ChannelNav extends React.Component {
  constructor(props) {
    super(props);

    this.leaveButton = this.leaveButton.bind(this);
    this.star = this.star.bind(this);
    this.starClick = this.starClick.bind(this);
  }

  starClick(e) {
    let { channel } = this.props;
    // debugger;
    dispatch(updateChannel({ starred: !channel.starred, id: channel.id }))
      .then(
        () => this.setState(this.state)
      )
  }

  star() {
    if (this.props.channel.name === "general")
      <div></div>
    else if (this.props.channel.starred)
      return (
        <div>
          <div id="star filled hidden" onClick={this.starClick}>
            <i className='fas fa-star'></i>
          </div>
          <div className="channel-nav-divider">|</div>
        </div>
      )
    else
      return(
        <div>
          <div id = "star empty" onClick={this.starClick}>
            <i className='far fa-star' ></i>
          </div >
          <div className="channel-nav-divider">|</div>
        </div>
      )
  }

  leaveButton() {
    if (this.props.status.canLeave)
      return (
        <div className="channel-nav-button" onClick={this.props.leaveChannel}>Leave Channel</div>
      )
  }

  render() {
    if (this.props.channel) {
      let { name, description, users } = this.props.channel;
      return (
        <div id="channel-nav">
          <div id="left">
            <div id="left-top"> # {name} </div>
            <div id="left-bottom">
              {this.star()} 
              <div id="members">
                <i className="material-icons">person_outline</i>{ Object.keys(users).length }
              </div>
              <div className="channel-nav-divider">|</div> 
              <div id="topic" onClick={e => {e.stopPropagation(); toggleElements("edit-channel-topic-modal", "channel-topic-input");}}>
                <i className='fas fas fa-pen'></i>&nbsp; { description ? description : "Add a topic" }
              </div>
            </div>
          </div>
          <div id="right">
            {/* <div className="settings-button" onClick={(e) => {e.stopPropagation(); toggleElements("dropdown channel-settings")}}>&#9881;</div> */}
            {this.leaveButton()}
          </div>
        </div>
      )
    } else {
      return (<div id="channel-nav"></div>)
    }
  }
}

export default ChannelNav;