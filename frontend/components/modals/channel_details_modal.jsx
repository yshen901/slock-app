import React from 'react';
import { withRouter } from 'react-router';
import { hideElements, toggleElements } from '../../util/modal_api_util';

class ChannelDetailsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: "About"
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
  
  tabContent() {
    let { channel } = this.props;
    switch(this.state.tab) {
      case "About":
        return (
          <div className="tab-content">
            <div className="block">
            <div className="section">
                <div className="section-header">
                  <div className="section-name">Topic</div>
                  <div className="section-edit" onClick={this.toggleElements("edit-channel-topic-modal", "channel-topic-input")}>Edit</div>
                </div>
                <div className={channel.topic ? "section-content" : "section-content gray"}>
                  { channel.topic }
                </div>
              </div>
              <div className="section">
                <div className="section-header">
                  <div className="section-name">Description</div>
                  <div className="section-edit">Edit</div>
                </div>
                <div className={channel.description ? "section-content" : "section-content gray"}>
                  { channel.description }
                </div>
              </div>
            </div>
          </div>
        )
      case "Members":
        return (
          <div className="tab-content">

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
      <div className="channel-details-modal hidden">
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