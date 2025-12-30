import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import InCallManager from "react-native-incall-manager";
import { mediaDevices } from "react-native-webrtc";
import { SocketContext } from "../socket/SocketProvider";
import { createPC } from "../utils/webrtc";
import { CommonActions } from "@react-navigation/native";

const AudiocallScreen = ({ route, navigation }) => {
  const { session_id, role } = route.params;

  const socketRef = useContext(SocketContext);
  const socket = socketRef?.current;

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const joinedRef = useRef(false);
  const cleanedRef = useRef(false);
  const timerRef = useRef(null);
  const pingRef = useRef(null);
  const iceConnectedRef = useRef(false);

  const [connected, setConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);

  /* ================= PERMISSION ================= */
  const requestAudioPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log("❌ Mic permission denied");
        return false;
      }
    }
    return true;
  };

  /* ================= ICE GRACE ================= */
  useEffect(() => {
    const t = setTimeout(() => {
      if (!iceConnectedRef.current) {
        console.log("⚠️ ICE slow (emulator), keeping call alive");
      }
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  /* ================= INIT ================= */
  useEffect(() => {
    if (!socket) return;

    const init = async () => {
      const ok = await requestAudioPermission();
      if (!ok) return;

      if (!joinedRef.current) {
        socket.emit("audio_join", { session_id });
        joinedRef.current = true;
      }

      InCallManager.start({ media: "audio" });
      InCallManager.setSpeakerphoneOn(true);
      InCallManager.setForceSpeakerphoneOn(true);

      socket.on("audio_connected", onConnected);
      socket.on("audio_offer", onOffer);
      socket.on("audio_answer", onAnswer);
      socket.on("audio_ice_candidate", onIceCandidate);
      socket.on("audio_call_ended", onRemoteEnd);
    };

    init();

    return () => {
      socket.off("audio_connected", onConnected);
      socket.off("audio_offer", onOffer);
      socket.off("audio_answer", onAnswer);
      socket.off("audio_ice_candidate", onIceCandidate);
      socket.off("audio_call_ended", onRemoteEnd);
    };
  }, [socket]);

  /* ================= PEER ================= */
  const attachPcListeners = (pc) => {
    pc.ontrack = () => InCallManager.setForceSpeakerphoneOn(true);

    pc.onicecandidate = (e) => {
      e.candidate &&
        socket.emit("audio_ice_candidate", {
          session_id,
          candidate: e.candidate,
        });
    };

    pc.oniceconnectionstatechange = () => {
      console.log("🧊 ICE =", pc.iceConnectionState);
      if (
        pc.iceConnectionState === "connected" ||
        pc.iceConnectionState === "completed"
      ) {
        iceConnectedRef.current = true;
      }
    };
  };

  /* ================= CONNECT ================= */
  const onConnected = async () => {
    if (pcRef.current) return;

    setConnected(true);
    startTimer();

    // 💓 heartbeat
    pingRef.current = setInterval(() => {
      socket.emit("audio_ping", { session_id });
    }, 3000);

    const pc = createPC();
    pcRef.current = pc;
    attachPcListeners(pc);

    localStreamRef.current = await mediaDevices.getUserMedia({ audio: true });
    const track = localStreamRef.current.getAudioTracks()[0];
    if (!track) return;

    pc.addTrack(track, localStreamRef.current);

    if (role === "caller") {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("audio_offer", { session_id, offer });
    }
  };

  /* ================= SIGNAL ================= */
  const onOffer = async ({ offer }) => {
    if (!pcRef.current) {
      const pc = createPC();
      pcRef.current = pc;
      attachPcListeners(pc);

      localStreamRef.current = await mediaDevices.getUserMedia({ audio: true });
      const track = localStreamRef.current.getAudioTracks()[0];
      if (!track) return;

      pc.addTrack(track, localStreamRef.current);
    }

    await pcRef.current.setRemoteDescription(offer);
    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);
    socket.emit("audio_answer", { session_id, answer });
  };

  const onAnswer = async ({ answer }) => {
    pcRef.current && (await pcRef.current.setRemoteDescription(answer));
  };

  const onIceCandidate = async ({ candidate }) => {
    candidate && pcRef.current?.addIceCandidate(candidate);
  };

  /* ================= TIMER ================= */
  const startTimer = () => {
    timerRef.current = setInterval(
      () => setSeconds((s) => s + 1),
      1000
    );
  };

  /* ================= END ================= */
  const onRemoteEnd = () => {
    if (!iceConnectedRef.current) {
      console.log("⚠️ Ignoring early backend end");
      return;
    }
    cleanup();
  };

  const endCall = () => {
    socket.emit("audio_call_hangup", { session_id });
    cleanup();
  };

  /* ================= CLEANUP ================= */
  const cleanup = () => {
    if (cleanedRef.current) return;
    cleanedRef.current = true;

    pingRef.current && clearInterval(pingRef.current);
    timerRef.current && clearInterval(timerRef.current);

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current?.close();

    InCallManager.stop();

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name:
              role === "caller"
                ? "TrainersCallPage"
                : "ReciverHomeScreen",
          },
        ],
      })
    );
  };

  /* ================= UI ================= */
  return (
    <LinearGradient colors={["#1b0030", "#0d0017"]} style={styles.container}>
      <Text style={styles.timer}>
        {connected
          ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
          : "Connecting…"}
      </Text>

      <View style={styles.controls}>
        <TouchableOpacity onPress={endCall}>
          <Ionicons name="call" size={36} color="red" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default AudiocallScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  timer: { color: "#00ffcc", fontSize: 22, marginBottom: 40 },
  controls: { flexDirection: "row", gap: 40 },
});
