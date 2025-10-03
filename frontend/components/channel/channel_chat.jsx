import React from 'react';
import { withRouter } from '../../withRouter.jsx';

import ChannelMessageForm from './channel_message_form';
import UserPopupModal from "../modals/user_popup_modal.jsx";
import ChannelMessageContainer from "./channel_message_container";

// Modals
import ChannelDetailsModalContainer from "../modals/channel_details_modal_container";
import EditChannelNameModal from '../modals/edit_channel_name_modal';
import EditChannelTopicModal from '../modals/edit_channel_topic_modal';
import EditChannelDescriptionModal from '../modals/edit_channel_description_modal';

import { RECEIVE_MESSAGE_REACT, RECEIVE_MESSAGE_SAVE, REMOVE_MESSAGE_REACT, REMOVE_MESSAGE_SAVE } from '../../actions/message_actions';

class ChannelChat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messagesList: [],
      currentDate: (new Date(Date())).toLocaleDateString(),
      popupUserId: 0,
      popupUserTarget: null,
      oldDistanceFromBottom: 0,
    };

    this.bottom = React.createRef();
    this.scrollBar = React.createRef();
    this.updateScroll = this.updateScroll.bind(this);

    this.loadMessages = this.loadMessages.bind(this);
    this.receiveACData = this.receiveACData.bind(this);
    this.toggleUserPopup = this.toggleUserPopup.bind(this);
    this.calculatePos = this.calculatePos.bind(this);
    this.hasNewMessages = this.hasNewMessages.bind(this);
    this.processLoadedMessages = this.processLoadedMessages.bind(this);
  }

  componentDidMount() {
    this.messageACChannel = App.cable.subscriptions.create(
      { channel: "ChatChannel" }, //AC: MUST MATCH THE NAME OF THE CLASS IN CHAT_CHANNEL.RB
      {
        received: this.receiveACData,
        speak: function(data) {
          return this.perform('speak', data);
        }
      }
    );
    this.loadMessages();
  }

  // NOTE: CURRENT REFERS TO THE LAST ELEMENT WITH PROPERTY ref={this.bottom}
  // Only trigger for non-transitional channels (channel_id != 0)
  componentDidUpdate(oldProps) {
    let {channel_id} = this.props.params;
    
    // Loads messages through the thunk once the channel_id changes
    // Then once the messages are actually loaded into the state, load the messages
    if (channel_id != "0") {
      if (channel_id !== oldProps.params.channel_id) {
        this.loadMessages();
      }
      else if (this.hasNewMessages(oldProps)) {
        this.processLoadedMessages();
      }
    }
  }

  // Checks to see if new messages have been loaded
  // TODO: See why this is necessary now, while before it was not. 
  //       Is it due to what qualifies as an update?
  hasNewMessages(oldProps) {
    // If the original messagesData is empty, update if the new messagesData is not empty
    if (oldProps.messagesData.length == 0) {
      return this.props.messagesData.length > 0
    }

    // If the original messagesData is not empty, then check new messagesData to see if the channel has changed
    if (this.props.messagesData.length != 0) {
      return this.props.messagesData[0].channel_id != oldProps.messagesData[0].channel_id
    }
    return false;
  }

  componentWillUnmount() {
    if (this.messageACChannel) this.messageACChannel.unsubscribe();
  }

  // Called when new messages are made, reacts and saves are handled in componentDidUpdate above
  // Also can be called using scrollThrehold, where it will scroll to bottom if moved by a certain amount
  updateScroll(scrollThreshold) {
    let { current_user_id, messagesData } = this.props;
    if (scrollThreshold && this.scrollBar.current) {
      let { offsetHeight, scrollTop, scrollHeight } = this.scrollBar.current; 
      let distanceFromBottom = scrollHeight - offsetHeight - scrollTop;
      if (distanceFromBottom == scrollThreshold)
        if (this.bottom.current) this.bottom.current.scrollIntoView();
    }
    else if (messagesData[messagesData.length - 1].user_id == current_user_id) { // user creates new message
      if (this.bottom.current) this.bottom.current.scrollIntoView();
    }
    else if (this.scrollBar.current && this.state.oldDistanceFromBottom == 0) {
      if (this.bottom.current) this.bottom.current.scrollIntoView();
    }
  }
  
  groupMessages(message, prevMessage) {
    if (message.created_date != prevMessage.created_date) return false;
    
    if (message.user_id == prevMessage.user_id)
      if (message.created_time.slice(0, 2) == prevMessage.created_time.slice(0, 2))
        return true;
    return false;
  }

  // Turns messagesData entries into messagesList display components
  processNewMessage(messagesList, i) {
    let { messagesData } = this.props;

    i = i != null ? i : messagesData.length - 1;
    let { created_date } = messagesData[i];
    let grouped = i != 0 && this.groupMessages(messagesData[i], messagesData[i-1]);

    if (i == 0 || created_date !== messagesData[i-1].created_date) {
      let date = created_date;
      if (date == this.state.currentDate)
        date = "Today";
      messagesList.push(
        <div className={`day-divider no-highlight ${messagesList.length == 0 ? "first" : ""}`} key={messagesList.length}>
          <div className="day-divider-line"></div>
          <div className="day-divider-date">{date}</div>
        </div>
      )        
    }

    messagesList.push(
      <ChannelMessageContainer
        status={this.props.status}  // decides whether you can interact with messages
        grouped={grouped}
        messageData={messagesData[i]}
        messageACChannel={this.messageACChannel}
        toggleUserPopup={this.toggleUserPopup}
        key={messagesList.length}/>
    )
  }

  // Loads raw message data, and preloads message information to speed up future calculations
  loadMessages() {
    let { getMessages, channel_id } = this.props;

    getMessages(channel_id);
    this.processLoadedMessages();
  }

  processLoadedMessages() {
    // popualate messagesList
    let { messagesData } = this.props;
    let messagesList = [];
    for (let i = 0; i < messagesData.length; i++)
      this.processNewMessage(messagesList, i);


    // Add callback that only runs after setState is called.
    this.setState({ messagesList }, () => {
      if (this.bottom.current) {
        this.bottom.current.scrollIntoView();
      }
    });
  }

  // Updates the relevant message and if necessary repopulates messagesList to redo time groupings
  updateMessage(messageData) {
    let { messagesData, current_user_id, user_saved_messages } = this.props;
    let { messagesList } = this.state;
    
    if (messageData.type == "DELETE") {
      if (messageData.user_id != current_user_id) // only need to do this for other users
        this.props.removeMessage(messageData)
      messagesList = [];
      for (let i = 0; i < messagesData.length; i++)
        this.processNewMessage(messagesList, i);
      this.setState({ messagesList });
    }                                                                    
    else // for updates, reacts, and saves
      for (let i = 0; i < messagesData.length; i++) {
        if (messagesData[i].id == messageData.id) {
          if (messageData.type == RECEIVE_MESSAGE_REACT && messageData.user_id != current_user_id) {
            let message_react = { message_id: messageData.id, user_id: messageData.user_id, react_code: messageData.react_code};
            let { offsetHeight, scrollTop, scrollHeight } = this.scrollBar.current; 
            let distanceFromBottom = scrollHeight - offsetHeight - scrollTop;
            this.props.receiveMessageReact(message_react);
            this.setState({messagesList, oldDistanceFromBottom: distanceFromBottom});
            this.updateScroll();
          }
          else if (messageData.type == REMOVE_MESSAGE_REACT && messageData.user_id != current_user_id) {
            let message_react = { message_id: messageData.id, user_id: messageData.user_id, react_code: messageData.react_code};
            this.props.removeMessageReact(message_react);
          }                                                                    // called when user saves in another window
          else if (messageData.type == RECEIVE_MESSAGE_SAVE && messageData.user_id == current_user_id && !user_saved_messages[messageData.id]) {
            let { offsetHeight, scrollTop, scrollHeight } = this.scrollBar.current; 
            let distanceFromBottom = scrollHeight - offsetHeight - scrollTop;
            this.props.receiveMessageSave({
              message_id: messageData.id,
            });
            this.setState({messagesList, oldDistanceFromBottom: distanceFromBottom});
            this.updateScroll();
          }
          else if (messageData.type == REMOVE_MESSAGE_SAVE && messageData.user_id == current_user_id && user_saved_messages[messageData.id]) {
            this.props.removeMessageSave({
              message_id: messageData.id
            });
          }
          break;
        }
      }
  }

  receiveACData(data) {
    let { message_data } = data;     //extract the data
    // For message updates and deletions
    if (message_data.type != "PUT") { 
      this.updateMessage(message_data);
    }
    else {
      let { message, dm_channel } = message_data;

      // loads the message if its to the current channel
      if (message.channel_id == this.props.channel_id) {
        this.props.receiveMessage(message)
        let { messagesData } = this.props;
        let messagesList = this.state.messagesList;

        let { offsetHeight, scrollTop, scrollHeight } = this.scrollBar.current; 
        let distanceFromBottom = scrollHeight - offsetHeight - scrollTop;
        this.processNewMessage(messagesList, messagesData.length - 1);
        this.setState({messagesList, oldDistanceFromBottom: distanceFromBottom}, () => {
          this.updateScroll();
        });
      }
      else if (dm_channel) {
        // joins the dm channel if not already in it
        if (!getState().entities.channels[message.channel_id]) {
          this.props.startDmChannel({
            user_1_id: this.props.current_user_id,
            user_2_id: message.user_id,
            workspace_id: this.props.workspace_id
          })
        }
      }
    }
  }

  toggleUserPopup(userId) {
    return (e) => {
      e.stopPropagation();
      this.setState({ popupUserId: userId, popupUserTarget: e.currentTarget });
    };
  }

  renderUserPopup() {
    let { users, showUser } = this.props;
    let { popupUserId } = this.state; 

    if (popupUserId)
      return (
        <UserPopupModal 
          user={users[popupUserId]} 
          hidePopup={() => this.setState({popupUserId: 0})}
          showUser={showUser}
          startVideoCall={this.props.startVideoCall}
          calculatePos={this.calculatePos}/>
      )
  }

  calculatePos(hasStatus) {
    let { popupUserTarget } = this.state;

    let minOffset = 524;
    if (hasStatus)
      minOffset = 580;
    
      let viewHeight = $(window).innerHeight();
      let top = popupUserTarget.offsetTop + popupUserTarget.offsetParent.offsetTop - this.scrollBar.current.scrollTop + 38;
      if (top > viewHeight - minOffset)
        top = viewHeight - minOffset;
      let left = popupUserTarget.offsetLeft + popupUserTarget.offsetWidth + popupUserTarget.offsetParent.offsetLeft + 10;

    return {
      top,
      left
    };
  }

  render() {
    return (
      <div className="chatroom-container">
        <div className="message-list" ref={this.scrollBar}>
          {this.state.messagesList.map((message) => message)}
          <div ref={this.bottom} />
        </div>
        <ChannelMessageForm 
          messageACChannel={this.messageACChannel} 
          joinChannel={this.props.joinChannel} 
          status={this.props.status}
          updateScroll={this.updateScroll}/>
        { this.renderUserPopup() }

        <ChannelDetailsModalContainer 
          status={this.props.status} 
          leaveChannel={this.props.leaveChannel}
          showUser={this.props.showUser}
          startVideoCall={this.props.startVideoCall}
          messageACChannel={this.messageACChannel}/>
        <EditChannelNameModal/>
        <EditChannelTopicModal/>
        <EditChannelDescriptionModal/>
      </div>
    );
  }
}

export default withRouter(ChannelChat);