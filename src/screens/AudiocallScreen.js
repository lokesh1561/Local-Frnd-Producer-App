import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InCallManager from "react-native-incall-manager";

import { createPC, getAudioStream } from "../utils/webrtc";
import { MAIN_BASE_URL } from "../api/baseUrl1";

const AudiocallScreen = ({ route, navigation }) => {
  const { session_id, target_id, role } = route.params;

  const socket = useRef(null);
  const pc = useRef(null);
  const localStream = useRef(null);
  const initializedRef = useRef(false);

  const [connected, setConnected] = useState(false);
  const [token, setToken] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(false);

  /* LOAD TOKEN */
  useEffect(() => {
    AsyncStorage.getItem("twittoke").then(setToken);
  }, []);

  /* SOCKET */
  useEffect(() => {
    if (!token) return;

    socket.current = io(MAIN_BASE_URL, {
      transports: ["websocket"],
      auth: { token },
    });

    socket.current.on("connect", () => {
      console.log("🔌 Socket connected");
      socket.current.emit("audio_join", { session_id });
    });

    return () => socket.current?.disconnect();
  }, [token]);

  /* WEBRTC */
  useEffect(() => {
    if (!socket.current || initializedRef.current) return;
    initializedRef.current = true;

    initWebRTC();

    InCallManager.start({ media: "audio" });
    InCallManager.setForceSpeakerphoneOn(false);
    InCallManager.setKeepScreenOn(true);

    return () => endCall();
  }, [socket.current]);

  const initWebRTC = async () => {
    pc.current = createPC();

    pc.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.current.emit("audio_ice_candidate", {
          session_id,
          candidate: e.candidate,
        });
      }
    };

    pc.current.ontrack = () => setConnected(true);

    localStream.current = await getAudioStream();
    localStream.current.getTracks().forEach((t) =>
      pc.current.addTrack(t, localStream.current)
    );

    socket.current.on("audio_offer", async ({ offer }) => {
      await pc.current.setRemoteDescription(offer);
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      socket.current.emit("audio_answer", { session_id, answer });
    });

    socket.current.on("audio_answer", async ({ answer }) => {
      await pc.current.setRemoteDescription(answer);
    });

    socket.current.on("audio_ice_candidate", async ({ candidate }) => {
      await pc.current.addIceCandidate(candidate);
    });

    if (role === "caller") createOffer();
  };

  const createOffer = async () => {
    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);
    socket.current.emit("audio_offer", { session_id, offer });
  };

  const toggleMic = () => {
    localStream.current?.getAudioTracks().forEach(
      (t) => (t.enabled = !micOn)
    );
    setMicOn(!micOn);
  };

  const toggleSpeaker = () => {
    InCallManager.setForceSpeakerphoneOn(!speakerOn);
    setSpeakerOn(!speakerOn);
  };

  const endCall = () => {
    localStream.current?.getTracks().forEach((t) => t.stop());
    pc.current?.close();
    InCallManager.stop({ busytone: true });
    socket.current?.emit("audio_leave", { session_id });
    navigation.goBack();
  };

  return (
    <LinearGradient colors={["#5e007a", "#0d0017"]} style={styles.container}>
      <Text style={styles.title}>
        {connected ? "Connected" : "Connecting..."}
      </Text>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.ctrlBtn} onPress={toggleMic}>
          <Ionicons name={micOn ? "mic" : "mic-off"} size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.endBtn} onPress={endCall}>
          <Ionicons name="call" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.ctrlBtn} onPress={toggleSpeaker}>
          <Ionicons
            name={speakerOn ? "volume-high" : "volume-medium"}
            size={28}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default AudiocallScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: "#fff", fontSize: 22, marginBottom: 60 },
  controls: { flexDirection: "row", alignItems: "center", gap: 30 },
  ctrlBtn: {
    width: 65,
    height: 65,
    backgroundColor: "#444",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  endBtn: {
    width: 80,
    height: 80,
    backgroundColor: "red",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
