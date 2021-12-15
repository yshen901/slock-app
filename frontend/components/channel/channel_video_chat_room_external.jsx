import React from 'react';
import { withRouter } from 'react-router-dom';
import { getWorkspace } from '../../actions/workspace_actions';

// import Webcam from 'react-webcam';
import { broadcastChannel, JOIN_CALL, LEAVE_CALL, EXCHANGE, ice } from '../../util/call_api_util';

class ChannelVideoChatRoomExternal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      audio: true,
      video: true,
      localJoined: false,
      remoteJoined: false,
      loaded: false
    }

    this.pcPeers = {};

    this.toggleAudio = this.toggleAudio.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
    this.joinCall = this.joinCall.bind(this);
    this.leaveCall = this.leaveCall.bind(this);
  }

  // Called when the component is rendered
  // Instead of webcam, this directly uses navigator to place media into container
  componentDidMount() {
    dispatch(getWorkspace(this.props.match.params.workspace_address))
      .then(
        () => {
          this.remoteVideoContainer = document.getElementById("remote-video-container");
          navigator.mediaDevices.getUserMedia({audio: this.state.audio, video: this.state.video})
          .then(stream => {
              this.localStream = stream;
              this.audioStream = stream.getAudioTracks()[0];
              this.videoStream = stream.getVideoTracks()[0];
              document.getElementById("local-video-container").srcObject = stream;
    
              this.callACChannel = App.cable.subscriptions.create( // subscribe to call actioncable channel
                { channel: "CallChannel" },
                { 
                  connected: () => {this.joinCall()},
                  speak: function(data) {
                    return this.perform('speak', data);
                  },
                  received: data => {
                    if (data.from == getState().session.user_id) return;
                    console.log("RECEIVED: ", data);
                    switch(data.type){
                      case JOIN_CALL:
                        return this.join(data);
                      case EXCHANGE:
                        if (data.to != `${getState().session.user_id}`) return;
                        return this.exchange(data);
                      case LEAVE_CALL:
                        return this.removeUser(data);
                      default:
                        return;
                    }
                  }
                });
          }).catch(error => { console.log(error)});
        }
      );
  }

  componentWillUnmount() {
    this.leaveCall();
  }

  join(data) {
    this.createPC(data.from, true)
  }

  joinCall(e) {
    debugger;
    this.callACChannel.speak({
      type: JOIN_CALL,
      from: getState().session.user_id
    });
    this.setState({localJoined: true, loaded: true});
  }

  createPC(userId, offerBool){
    const pc = new RTCPeerConnection(ice);
    this.pcPeers[userId] = pc;
    this.localStream.getTracks()
        .forEach(track => pc.addTrack(track, this.localStream));
    if (offerBool) {
      pc.createOffer().then(offer => {
        pc.setLocalDescription(offer).then(() => {
         setTimeout( () => {
          this.callACChannel.speak({
            type: EXCHANGE,
            from: getState().session.user_id,
            to: userId,
            sdp: JSON.stringify(pc.localDescription),
          });
         }, 0);
        });
      });
     }
    pc.onicecandidate = (e) => {
        this.callACChannel.speak({
            type: EXCHANGE,
            from: getState().session.user_id,
            to: userId,
            sdp: JSON.stringify(e.candidate)
        })
    };
    pc.ontrack = (e) => {
        if (!this.appended) {
          const remoteVid = document.createElement("video");
          remoteVid.id = `remote-video-instance container-${userId}`;
          remoteVid.autoplay = "autoplay";
          remoteVid.srcObject = e.streams[0];
          this.remoteVideoContainer.appendChild(remoteVid);
          this.appended = true;
          this.setState({remoteJoined: true})
        }
    }; 
    pc.oniceconnectionstatechange = (e) => {
        if (pc.iceConnectionState === 'disconnected'){
            this.callACChannel.speak({ type: LEAVE_CALL, from: userId });
        }
    };
    return pc;   
  }

  exchange(data){
    let pc;
    if(this.pcPeers[data.from]){
      pc = this.pcPeers[data.from];
    } else{
      pc = this.createPC(data.from, false);
    }
    if (data.candidate){
      let candidate = JSON.parse(data.candidate)
      pc.addIceCandidate(new RTCIceCandidate(candidate))
    }
    if(data.sdp){
      const sdp = JSON.parse(data.sdp);
      if(sdp && !sdp.candidate){
         pc.setRemoteDescription(sdp).then( () =>{
         if (sdp.type === 'offer'){
            pc.createAnswer().then(answer => {
               pc.setLocalDescription(answer)
               .then( () => {
                  this.callACChannel.speak({
                     type: EXCHANGE,
                     from: getState().session.user_id,
                     to: data.from,
                     sdp: JSON.stringify(pc.localDescription)
                  });
               });
            });
         }
         });
      }
    } 
  }

  leaveCall(e){
    const pcKeys = Object.keys(this.pcPeers);
    for (let i = 0; i < pcKeys.length; i++) {
       this.pcPeers[pcKeys[i]].close();
    }
    this.pcPeers = {};   
    this.localStream.getTracks()
     .forEach(function (track) { track.stop(); })
    
    this.localStream.srcObject = null;
    App.cable.subscriptions.subscriptions = [];
    this.remoteVideoContainer.innerHTML = "";
    this.callACChannel.speak({ type: LEAVE_CALL, from: getState().session.user_id });    

    this.props.endVideoCall();
    this.appended = false;
  }

  removeUser(data){
      let video = document.getElementById(`remoteVideoContainer+${data.from}`);
      video && video.remove();
      let peers = this.pcPeers;
      delete peers[data.from];
      this.remoteVideoContainer.innerHTML="";
      this.setState({remoteJoined: false});
  }

  // Changes the audio stream by toggled enabled tag
  toggleAudio() {
    debugger;
    this.audioStream.enabled = !this.audioStream.enabled;
    this.setState({audio: this.audioStream.enabled});
  }

  audioButton() {
    let action = "Unmute";
    if (this.state.audio)
      action = "Mute";
    
    return (
      <div className="video-chatroom-setting" onClick={this.toggleAudio}>{action}</div>
    )
  }

  // Changes the video stream by toggled enabled tag
  toggleVideo() {
    this.videoStream.enabled = !this.videoStream.enabled;
    this.setState({video: this.videoStream.enabled});
  }

  videoButton() {
    let action = "Unblock Camera";
    if (this.state.video)
      action = "Block Camera";
    
    return (
      <div className="video-chatroom-setting" onClick={this.toggleVideo}>{action}</div>
    )
  }
  
  // Adds a leave/join call button to the video chat interface
  callButton() {
    let actionName = "Join Call";
    let action = this.joinCall;
    if (this.state.localJoined) {
      actionName = "Leave Call";
      action = this.leaveCall;
    }
    return (
      <div className="video-chatroom-setting" onClick={action}>{actionName}</div>
    )
  }

  // selects the correct username
  getUserName(user) {
    if (user.display_name)
      return user.display_name;
    else if (user.full_name)
      return user.full_name;
    else
      return user.email;
  }

  // only renders once remote is connected
  remoteVideo(remoteUser) {
    if (this.state.remoteJoined)
      return (
        <div id="remote-video">
          <div id="remote-video-container"></div> 
          <div className="video-tag">{this.getUserName(remoteUser)}</div>
        </div>
      )
    else 
      return (
        <div id="remote-video hidden">
          <div id="remote-video-container"></div> 
        </div>
      )
  }

  render() {    
    // After getUserMedia callback finishes, setState will toggle loaded and render the full videochat
    
    if (!this.state.loaded) {
      return (
        <div className="video-chatroom-container">
          <div className="video-chatroom-videos">
            { this.remoteVideo() }
            <div id="local-video">
              <video id="local-video-container" autoPlay></video>
            </div>
          </div>
        </div>
      )
    }
    else {
      let {user_id} = getState().session;
      let {channel_id} = this.props.match.params;
      let {users, channels} = getState().entities;
      let channelUserIds = Object.keys(channels[channel_id].users);
  
      let localUser = users[user_id];
      let remoteUser = users[channelUserIds[0]];
      if (user_id == channelUserIds[0])
        remoteUser = users[channelUserIds[1]];
  
      return (
        <div className="video-chatroom-container">
          <div className="video-chatroom-videos">
            {this.remoteVideo(remoteUser)}
            <div id="local-video">
              <video id="local-video-container" autoPlay></video>
              <div className="video-tag">{this.getUserName(localUser)}</div>
            </div>
          </div>
          <div className="video-chatroom-settings">
            {this.videoButton()}
            {this.audioButton()}
            {this.callButton()}
          </div>
        </div>
      )
    }
  }
}

export default withRouter(ChannelVideoChatRoomExternal);