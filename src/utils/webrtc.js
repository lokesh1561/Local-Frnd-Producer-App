import {
  RTCPeerConnection,
  MediaStream,
} from "react-native-webrtc";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
  iceCandidatePoolSize: 10,
};

export const createPC = ({ onIceCandidate, onTrack, onIceState }) => {
  try {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event?.candidate) {
        onIceCandidate?.(event.candidate);
      }
    };

    pc.ontrack = (event) => {
      if (event.streams?.[0]) {
        onTrack?.(event.streams[0]);
      } else if (event.track) {
        const stream = new MediaStream();
        stream.addTrack(event.track);
        onTrack?.(stream);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("🌐 ICE State:", pc.iceConnectionState);
      onIceState?.(pc.iceConnectionState);
    };

    pc.onsignalingstatechange = () => {
      console.log("📡 Signaling State:", pc.signalingState);
    };

    return pc;
  } catch (e) {
    console.error("❌ RTCPeerConnection failed:", e);
    return null;
  }
};
