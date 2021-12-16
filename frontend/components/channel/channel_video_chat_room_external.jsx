import React from 'react';
import { withRouter } from 'react-router-dom';
import { getWorkspace } from '../../actions/workspace_actions';

// import Webcam from 'react-webcam';
import { broadcastChannel, JOIN_CALL, LEAVE_CALL, EXCHANGE, REJECT_CALL, ice, PICKUP_CALL } from '../../util/call_api_util';
import { hideElements, revealElements } from '../../util/modal_api_util';

class ChannelVideoChatRoomExternal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      audio: true,
      video: true,
      localJoined: false,
      remoteJoined: false,
      callRejected: false,
      callEnded: false,
      loaded: false
    }

    this.pcPeers = {};

    this.toggleAudio = this.toggleAudio.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
    this.joinCall = this.joinCall.bind(this);
    this.leaveCall = this.leaveCall.bind(this);
    this.cancelCall = this.cancelCall.bind(this);
  }

  // Called when the component is rendered
  // Instead of webcam, this directly uses navigator to place media into container
  componentDidMount() {
    // establish cleanup behavior if the window is closed 
    window.addEventListener("beforeunload", this.leaveCall);

    // load workspace
    dispatch(getWorkspace(this.props.match.params.workspace_address))
      .then(
        ({channels}) => {
          // Prevents illegal access to video call rooms
          let user_channels = Object.keys(getState().session.user_channels);
          let {channel_id, workspace_address} = this.props.match.params;
          if (!user_channels.includes(channel_id) || !channels[channel_id].dm_channel)
            this.props.history.push(`/workspace/${workspace_address}/0`)

          // Set loaded to true once workspace loaded
          this.setState({ loaded: true });

          // Get user media and setup action cable
          this.remoteVideoContainer = document.getElementById("remote-video-container");
          navigator.mediaDevices.getUserMedia({audio: this.state.audio, video: this.state.video, echoCancellation: true})
          .then(stream => {
              this.localStream = stream;
              this.audioStream = stream.getAudioTracks()[0];
              this.videoStream = stream.getVideoTracks()[0];
              document.getElementById("local-video-container").srcObject = stream;
    
              this.callACChannel = App.cable.subscriptions.create(
                { channel: "CallChannel" },
                { 
                  // called after create finishes to ensure synchronity
                  // either joins or picks up call depending on query string
                  connected: () => { 
                    if (this.props.location.search == "?pickup")
                      this.pickupCall();
                    else
                      this.joinCall()
                  },   
                  speak: function(data) {
                    return this.perform('speak', data);
                  },
                  received: data => {
                    let { user_id } = getState().session;
                    let { channel_id } = this.props.match.params;

                    if (data.from == user_id) return;
                    console.log("RECEIVED: ", data.type);
                    console.log(data);
                    switch(data.type){
                      case PICKUP_CALL:
                      case JOIN_CALL:
                        return this.join(data);
                      case EXCHANGE:
                        if (data.to != `${user_id}`) return;
                        return this.exchange(data);
                      case LEAVE_CALL:
                        return this.endCall();
                        // return this.removeUser(data); // no need to remove user if we only have one
                      case REJECT_CALL:
                        debugger;
                        if (data.target_user_id == user_id && data.channel_id == channel_id)
                          this.cancelCall();
                        return;
                      default:
                        return;
                    }
                  }
                });
          }).catch(error => { console.log(error)});
        }
      );
  }

  // Only needs to be unmounted if loading has finished
  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.leaveCall);
    if (this.state.loaded) {
      this.leaveCall();
      window.close();
    }
  }

  // Triggered when another user joins
  join(data) {
    this.createPC(data.from, true)
  }

  // Triggered to join call on local side (start broadcasting)
  // Also includes channel_id and target_user_id to arrange ping
  joinCall(e) {
    let { user_id } = getState().session;
    let { channel_id } = this.props.match.params;
    let { channels } = getState().entities;
    let channel_users = Object.keys(channels[channel_id].users);
    
    let target_user_id = channel_users[0];
    if (channel_users[0] == user_id)
      target_user_id = channel_users[1];

    let joinCallData = {
      type: JOIN_CALL,
      from: getState().session.user_id,
      channel_id,
      target_user_id
    };

    this.callACChannel.speak(joinCallData);

    // let i = 0;
    // let times = 60;
    // let callLoop = () => {
    //   setTimeout(() => {
    //     if (i < times && !this.state.remoteJoined && !this.state.callRejected) {
    //       this.callACChannel.speak(joinCallData);
    //       i++;
    //       callLoop();
    //     }
    //     else if (i == times) {   // When the callee times out
    //       this.cancelCall();
    //     }
    //   }, 500)
    // }
    // callLoop();
  }

  // No need to constantly fire when picking up
  pickupCall(e) {
    let pickupCallData = {
      type: PICKUP_CALL,
      from: getState().session.user_id,
    }
    this.callACChannel.speak(pickupCallData);
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
            this.callACChannel.speak({ type: LEAVE_CALL, from: userId, channel_id: this.props.match.params.channel_id });
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
    this.callACChannel.speak({ type: LEAVE_CALL, from: getState().session.user_id, channel_id: this.props.match.params.channel_id });    

    this.appended = false;
  }

  // When other user ends call
  endCall() {
    this.leaveCall();
    this.setState({ callEnded: true });
  }

  // When other user doesn't pick up
  cancelCall() {
    this.leaveCall();
    this.setState({ callRejected: true});
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
    this.audioStream.enabled = !this.audioStream.enabled;
    this.setState({audio: this.audioStream.enabled});
  }

  audioButton() {
    let action = <i className="fas fa-microphone-slash"></i>;
    if (this.state.audio)
      action = <i className="fas fa-microphone"></i>;
    
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
    let action = <i className="fas fa-video-slash"></i>;
    if (this.state.video)
      action = <i className="fas fa-video"></i>;
    
    return (
      <div className="video-chatroom-setting" onClick={this.toggleVideo}>{action}</div>
    )
  }
  
  // Adds a leave/join call button to the video chat interface
  // Right now only leave call makes sense...join is tied to other buttons
  callButton() {
    let action = () => {
      this.leaveCall();
      window.close();
    };
    return (
      <div className="video-chatroom-setting" onClick={action}><i className="fas fa-phone-slash"></i></div>
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

  // Must always render otherwise there will be nowhere to mount the remote video to
  // Name is blank until remoteJoined
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
    // Empty scaffold before workspace loads
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

    let {user_id} = getState().session;
    let {channel_id} = this.props.match.params;
    let {users, channels} = getState().entities;
    let channelUserIds = Object.keys(channels[channel_id].users);

    let localUser = users[user_id];
    let remoteUser = users[channelUserIds[0]];
    if (user_id == channelUserIds[0])
      remoteUser = users[channelUserIds[1]];


    if (this.state.callRejected || this.state.callEnded) {
      let message = "Call Ended";
      if (this.state.callRejected) 
        message = `${this.getUserName(remoteUser)} did not pick up`;
      return (
        <div className="video-chatroom-container">
          <div id="call-cancelled-notice-container">
            <div id="call-cancelled-notice">
              {message}
            </div>
          </div>
        </div>
      )
    }
    else if (!this.state.remoteJoined) {
      return (
        <div className="video-chatroom-container"
          onMouseOver={() => revealElements("video-chatroom-settings")}
          onMouseLeave={() => hideElements("video-chatroom-settings")}>
          <div className="video-chatroom-videos">
            { this.remoteVideo() }
            <div id="local-video">
              <video id="local-video-container" autoPlay></video>
            </div>
          </div>
          <div className="video-chatroom-settings">
            {this.videoButton()}
            {this.audioButton()}
            {this.callButton()}
          </div>
          <audio autoPlay>
            <source src="/soundtracks/phone-calling.mp3" type="audio/mp3"/>
          </audio>
        </div>
      )
    }
    else {
      return (
        <div className="video-chatroom-container"
          onMouseOver={() => revealElements("video-chatroom-settings")}
          onMouseLeave={() => hideElements("video-chatroom-settings")}>
          <div className="video-chatroom-videos">
            {this.remoteVideo(remoteUser)}
            <div id="local-video-minimized">
              <video id="local-video-container" autoPlay></video>
            </div>
          </div>
          <div className="video-chatroom-settings hidden">
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