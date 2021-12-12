import React from 'react';
import { withRouter } from 'react-router-dom';
import Webcam from 'react-webcam';

class ChannelVideoChatRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      audio: true
    }

    this.toggleAudio = this.toggleAudio.bind(this);
  }

  // Called when the component is rendered (video call starts)
  componentDidMount() {
    debugger;
  }

  // Called when the component is unrendered (video call ends)
  componentWillUnmount() {
    debugger;
  }

  toggleAudio() {
    this.setState({audio: !this.state.audio})
  }
  
  audioButton() {
    let action = "Unmute";
    if (this.state.audio)
      action = "Mute";
    
    return (
      <div className="video-chatroom-setting" onClick={this.toggleAudio}>{action}</div>
    )
  }

  render() {
    return (
      <div className="video-chatroom-container">
        <Webcam
          videoConstraints={{width: 1280, height: 720}}
          audio={this.state.audio}
        />
        <div className="video-chatroom-settings">
          {this.audioButton()}
        </div>
      </div>
    )
  }
}

export default withRouter(ChannelVideoChatRoom);