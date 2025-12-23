import React, { useEffect, useRef, useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { audioCallRequest } from "../features/calls/callAction";
import { useDispatch, useSelector } from "react-redux";

const ReciverHomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  /* AUTH */
  const { Otp } = useSelector((state) => state.auth);
  const gender = Otp?.user?.gender;

  /* CALL STATE */
  const call = useSelector((state) => state.calls?.call);

  /* UI STATE (UNCHANGED DESIGN) */
  const [showModal, setShowModal] = useState(false);

  /* 🔥 USER INTENT FLAG (LOGIC FIX) */
  const audioRequestedRef = useRef(false);

  console.log("CALL STATUS =>", call?.status);

  /* 🔥 NAVIGATION: ONLY AFTER CLICK + MATCH */
  useEffect(() => {
    if (
      audioRequestedRef.current &&
      call?.status === "MATCHED" &&
      call?.session_id
    ) {
      console.log("🚀 Navigating FEMALE");

      navigation.navigate("AudiocallScreen", {
        session_id: call.session_id,
        target_id: call.peer_id,
        role: "receiver",
      });

      // ✅ RESET FLAG (IMPORTANT)
      audioRequestedRef.current = false;
    }
  }, [call]);

  /* AUDIO CALL */
  const handleAudio = () => {
    audioRequestedRef.current = true; // ✅ mark user intent
    setShowModal(false);

    dispatch(
      audioCallRequest({
        call_type: "AUDIO",
        gender,
        user_id: Otp?.user?.user_id,
      })
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <LinearGradient colors={["#6a007a", "#3b003f"]} style={styles.header}>
        <Text style={styles.appName}>Local Friend</Text>
      </LinearGradient>

      {/* CENTER */}
      <View style={styles.middle}>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <LinearGradient
            colors={["#ff2fd2", "#b000ff"]}
            style={styles.onlineBtn}
          >
            <Icon name="radio" size={34} color="#fff" />
            <Text style={styles.onlineText}>GO ONLINE</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Choose Call Type</Text>

            <TouchableOpacity style={styles.callBtn} onPress={handleAudio}>
              <Icon name="call-outline" size={26} color="#fff" />
              <Text style={styles.callText}>Audio Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowModal(false)}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ReciverHomeScreen;

/* ================= STYLES (UNCHANGED) ================= */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#2a002d" },
  header: { padding: 24 },
  appName: { color: "#fff", fontSize: 22, fontWeight: "700" },
  middle: { flex: 1, justifyContent: "center", alignItems: "center" },
  onlineBtn: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  onlineText: { color: "#fff", fontSize: 18, marginTop: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#2a002d",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  modalTitle: { color: "#fff", fontSize: 18, marginBottom: 20 },
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4c0055",
    padding: 14,
    borderRadius: 14,
  },
  callText: { color: "#fff", marginLeft: 10 },
  closeBtn: { marginTop: 15 },
});
