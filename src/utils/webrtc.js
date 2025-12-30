// import { RTCPeerConnection, mediaDevices } from "react-native-webrtc";

// /* ================= ICE CONFIG ================= */
// export const RTC_CONFIG = {
//   iceServers: [
//     { urls: "stun:stun.l.google.com:19302" },
//     { urls: "stun:stun1.l.google.com:19302" },
//   ],
//   bundlePolicy: "max-bundle",
//   rtcpMuxPolicy: "require",
// };

// /* ================= PEER CONNECTION ================= */
// export const createPC = () => {
//   return new RTCPeerConnection(RTC_CONFIG);
// };

// /* ================= AUDIO STREAM ================= */
// export const getAudioStream = async () => {
//   return await mediaDevices.getUserMedia({
//     audio: {
//       echoCancellation: true,
//       noiseSuppression: true,
//       autoGainControl: true,
//     },
//     video: false,
//   });
// };
 import { RTCPeerConnection } from "react-native-webrtc";

const ICE_SERVERS = {
  iceServers: [
    // ✅ STUN (basic)
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },

    // 🔥 TURN (REQUIRED for emulator & NAT)
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ],
};

export const createPC = () => {
  const pc = new RTCPeerConnection(ICE_SERVERS);

  /* ================= CONNECTION STATE ================= */

  pc.onconnectionstatechange = () => {
    console.log("📡 WebRTC connectionState:", pc.connectionState);
  };

  /* ================= ICE STATE (MOST IMPORTANT) ================= */

  pc.oniceconnectionstatechange = () => {
    console.log("🧊 ICE connectionState:", pc.iceConnectionState);

    switch (pc.iceConnectionState) {
      case "checking":
        console.log("🔍 ICE checking...");
        break;

      case "connected":
      case "completed":
        console.log("✅ ICE connected");
        break;

      case "disconnected":
        console.log("⚠️ ICE disconnected (temporary)");
        // ❌ do NOT close here
        break;

      case "failed":
        console.log("❌ ICE failed");
        // Cleanup handled in screen logic
        break;

      case "closed":
        console.log("🔒 ICE closed");
        break;
    }
  };

  /* ================= SIGNALING STATE ================= */

  pc.onsignalingstatechange = () => {
    console.log("📶 Signaling state:", pc.signalingState);
  };

  return pc;
};
