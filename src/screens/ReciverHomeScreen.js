import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

import { audioCallRequest } from "../features/calls/callAction";
import { SocketContext } from "../socket/SocketProvider";

const WAIT_TIMEOUT = 60000;

const ReciverHomeScreen = ({ navigation }) => {
  /* ================= HOOKS (ALWAYS FIRST) ================= */
  const dispatch = useDispatch();
  const { socketRef, connected } = useContext(SocketContext);

  const timeoutRef = useRef(null);
  const navigatingRef = useRef(false);

  const [waiting, setWaiting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  /* ================= CALL MATCHED ================= */
  useEffect(() => {
    if (!connected) return;
    if (!socketRef.current) return;

    const socket = socketRef.current;

    const onMatched = (data) => {
      if (navigatingRef.current) return;

      navigatingRef.current = true;
      clearTimeout(timeoutRef.current);
      setWaiting(false);

      console.log("📥 Call matched (FEMALE):", data);

      navigation.replace("AudiocallScreen", {
        session_id: data.session_id,
        role: data.role,
        peer_id: data.peer_id,
      });
    };

    socket.on("call_matched", onMatched);

    return () => {
      socket.off("call_matched", onMatched);
      clearTimeout(timeoutRef.current);
    };
  }, [connected, navigation]);

  /* ================= GO ONLINE ================= */
  const handleGoOnline = () => {
    if (!connected) return;
    if (!socketRef.current) return;
    if (waiting) return;

    navigatingRef.current = false;
    setWaiting(true);
    setShowModal(false);

    dispatch(
      audioCallRequest({
        call_type: "AUDIO",
        gender: "Female",
      })
    );

    timeoutRef.current = setTimeout(() => {
      console.log("⏳ Wait timeout");
      setWaiting(false);
    }, WAIT_TIMEOUT);
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      clearTimeout(timeoutRef.current);


      await AsyncStorage.clear();

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    } catch (err) {
      console.error("❌ Logout error:", err);
    }
  };

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#6a007a", "#3b003f"]} style={styles.header}>
        <Text style={styles.appName}>Local Friend</Text>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setShowLogoutModal(true)}
        >
          <Icon name="log-out-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.middle}>
        {!waiting ? (
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <LinearGradient
              colors={["#ff2fd2", "#b000ff"]}
              style={styles.onlineBtn}
            >
              <Icon name="radio" size={34} color="#fff" />
              <Text style={styles.onlineText}>GO ONLINE</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <Text style={styles.waitingText}>Waiting for call… 📞</Text>
        )}
      </View>

      {/* CALL MODAL */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Go Online?</Text>

            <TouchableOpacity style={styles.callBtn} onPress={handleGoOnline}>
              <Icon name="call-outline" size={26} color="#fff" />
              <Text style={styles.callText}>Audio Call</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* LOGOUT MODAL */}
      <Modal transparent visible={showLogoutModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Logout?</Text>

            <TouchableOpacity
              style={styles.logoutConfirm}
              onPress={handleLogout}
            >
              <Icon name="log-out-outline" size={22} color="#fff" />
              <Text style={styles.callText}>Yes, Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowLogoutModal(false)}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ReciverHomeScreen;



/* ================= STYLES ================= */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0A001A" },
  header: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: { color: "#fff", fontSize: 22, fontWeight: "800" },
  logoutBtn: { position: "absolute", right: 20, top: 20 },
  middle: { flex: 1, justifyContent: "center", alignItems: "center" },
  onlineBtn: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 40,
    alignItems: "center",
  },
  onlineText: { color: "#fff", fontSize: 18, fontWeight: "700", marginTop: 10 },
  waitingText: { color: "#fff", fontSize: 18 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#1a0033",
    padding: 25,
    borderRadius: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 20 },
  callBtn: {
    flexDirection: "row",
    backgroundColor: "#ff00ff",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
  },
  logoutConfirm: {
    flexDirection: "row",
    backgroundColor: "#ff0044",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
  },
  callText: { color: "#fff", fontSize: 16, marginLeft: 10 },
  closeText: { color: "#aaa", marginTop: 10 },
});