import { times } from 'lodash';
import React from 'react';
import { withRouter } from 'react-router-dom';

// import Webcam from 'react-webcam';
import { broadcastChannel, JOIN_CALL, LEAVE_CALL, EXCHANGE, ice } from '../../util/call_api_util';

class ChannelVideoChatRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      audio: false,
      video: true,
      joined: false
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
    this.remoteVideoContainer = 
    document.getElementById("remote-video-container")
    navigator.mediaDevices.getUserMedia({audio: true, video: true})
    .then(stream => {
        this.localStream = stream;
        document.getElementById("local-video-container").srcObject = stream;

        this.callACChannel = App.cable.subscriptions.create( // subscribe to call actioncable channel
          { channel: "CallChannel" },
          { 
            speak: function(data) {
              return this.perform('speak', data);
            },
            received: data => {
              console.log("RECEIVED: ", data);
              if (data.from === getState().session.user_id) return;
              switch(data.type){
                case JOIN_CALL:
                  return this.join(data);
                case EXCHANGE:
                  if (data.to !== getState().session.user_id) return;
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

  join(data) {
    this.createPC(data.from, true)
  }

  joinCall(e) {
    this.callACChannel.speak({
      type: JOIN_CALL,
      from: getState().session.user_id
    });
    this.setState({joined: true});
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
        const remoteVid = document.createElement("video");
        remoteVid.id = `remoteVideoContainer+${userId}`;
        remoteVid.autoplay = "autoplay";
        remoteVid.srcObject = e.streams[0];
        this.remoteVideoContainer.appendChild(remoteVid);
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
  }

  removeUser(data){
      let video = document.getElementById(`remoteVideoContainer+${data.from}`);
      video && video.remove();
      let peers = this.pcPeers
      delete peers[data.from]    
  }

  // Changes the stream's audio
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

  toggleVideo() {
    this.setState({video: !this.state.video})
  }

  videoButton() {
    let action = "Unblock Camera";
    if (this.state.video)
      action = "Block Camera";
    
    return (
      <div className="video-chatroom-setting" onClick={this.toggleVideo}>{action}</div>
    )
  }
  
  callButton() {
    let actionName = "Join Call";
    let action = this.joinCall;
    if (this.state.joined) {
      actionName = "Leave Call";
      action = this.leaveCall;
    }
    return (
      <div className="video-chatroom-setting" onClick={action}>{actionName}</div>
    )
  }

  render() {
    return (
      <div className="video-chatroom-container">
        <div className="video-chatroom-videos">
          <div id="remote-video-container"></div> 
          <video id="local-video-container" autoPlay></video>
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

export default withRouter(ChannelVideoChatRoom);