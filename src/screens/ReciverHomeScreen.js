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
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import {
  femaleSearchRequest,
  femaleCancelRequest,
} from "../features/calls/callAction";

import { SocketContext } from "../socket/SocketProvider";
import { userDatarequest } from "../features/user/userAction";

const ReciverHomeScreen = ({ navigation }) => {
  /* ================= HOOK ORDER (DO NOT CHANGE) ================= */
  const dispatch = useDispatch();
  const { socketRef, connected } = useContext(SocketContext);

  const navigatingRef = useRef(false);

  
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { incoming } = useSelector((state) => state.friends);
const { userdata } = useSelector((state) => state.user);
console.log("userdata", userdata);

  useEffect(() => {
      dispatch(userDatarequest());
    }, []);
  /* ================= SOCKET: INCOMING CALL ================= */
 
  /* ================= START SEARCH ================= */
 const handleGoOnline = (type) => {

  if (!connected) return;

  setShowModal(false);

  dispatch(femaleSearchRequest({ call_type: type }));

  navigation.navigate("CallStatusScreen", {
    call_type: type,
    role: "female",
  });
};

  /* ================= CANCEL SEARCH ================= */
  const handleCancel = () => {
dispatch(femaleCancelRequest());
    navigatingRef.current = false;
    setWaiting(false);
    setCallType(null);
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    socketRef?.current?.disconnect();
    await AsyncStorage.clear();

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <LinearGradient colors={["#6a007a", "#3b003f"]} style={styles.header}>
        <View style={styles.headerRow}>
          <View style={{ width: 40 }} />
          <Text style={styles.appName}>Local Friend</Text>

          <View style={styles.headerIcons}>

  {/* MESSAGE ICON (same as male HomeScreen) */}
  <TouchableOpacity
    style={styles.iconBtn}
    onPress={() => navigation.navigate("MessagesScreen")}
  >
<Icon name="chatbubble-ellipses-outline" size={26} color="#fff" />
  </TouchableOpacity>

  {/* NOTIFICATION ICON */}
  <View>
    <TouchableOpacity
      style={styles.iconBtn}
      onPress={() => navigation.navigate("FriendRequestsScreen")}
    >
      <Icon name="notifications-outline" size={26} color="#fff" />
    </TouchableOpacity>

    {incoming.length > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{incoming.length}</Text>
      </View>
    )}
  </View>

  {/* LOGOUT ICON */}
  <TouchableOpacity
    style={styles.iconBtn}
    onPress={() => setShowLogoutModal(true)}
  >
    <Icon name="log-out-outline" size={26} color="#fff" />
  </TouchableOpacity>

</View>

        </View>
      </LinearGradient>

      {/* BODY */}
      <View style={styles.middle}>
  {/* <TouchableOpacity onPress={() => setShowModal(true)}>
    <LinearGradient
      colors={["#ff2fd2", "#b000ff"]}
      style={styles.onlineBtn}
    >
      <Icon name="radio" size={34} color="#fff" />
      <Text style={styles.onlineText}>GO ONLINE</Text>
    </LinearGradient>
  </TouchableOpacity> */}


<TouchableOpacity activeOpacity={0.9} onPress={() => setShowModal(true)}>
  <LinearGradient
    colors={["#b14cff", "#ff4fd8"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.outerPill}
  >
  {/* background hearts (5 total) */}
<Icon name="heart" size={50} color="rgba(255,255,255,0.35)" style={styles.heart1} />
<Icon name="heart" size={50} color="rgba(255,255,255,0.30)" style={styles.heart2} />
<Icon name="heart" size={50} color="rgba(255,255,255,0.28)" style={styles.heart3} />
<Icon name="heart" size={50} color="rgba(255,255,255,0.25)" style={styles.heart4} />
<Icon name="heart" size={50} color="rgba(255,255,255,0.22)" style={styles.heart5} />

    {/* INNER PILL */}
    <View style={styles.innerPill}>
      <View style={styles.innerPill}>
  <Icon name="wifi-outline" size={24} color="#fff" />
  <Text style={styles.innerText}>GO ONLINE</Text>
</View>

    </View>
  </LinearGradient>
</TouchableOpacity>



</View>


      {/* CALL TYPE MODAL */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Go Online</Text>

            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => handleGoOnline("AUDIO")}
            >
              <Icon name="call-outline" size={26} color="#fff" />
              <Text style={styles.callText}>Audio Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.callBtn, styles.videoBtn]}
              onPress={() => handleGoOnline("VIDEO")}
            >
              <Icon name="videocam-outline" size={26} color="#fff" />
              <Text style={styles.callText}>Video Call</Text>
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
              <Icon name="log-out-outline" size={24} color="#fff" />
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
  safe: { flex: 1, backgroundColor: '#e9e0f8' },

  header: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  appName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },

  headerIcons: {
    flexDirection: 'row',
    gap: 14,
  },

  iconBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
  },

badge: {
  position: "absolute",
  top: -6,
  right: -6,
  backgroundColor: "#ff0044",
  borderRadius: 10,
  minWidth: 20,
  height: 20,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 6,
},

badgeText: {
  color: "#fff",
  fontSize: 12,
  fontWeight: "bold",
},

  middle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  onlineBtn: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 40,
    alignItems: 'center',
  },

  onlineText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
  },

  waitingText: {
    color: '#fff',
    fontSize: 18,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    backgroundColor: '#1a0033',
    padding: 25,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },

  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },

  callBtn: {
    flexDirection: 'row',
    backgroundColor: '#ff00ff',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    justifyContent: 'center',
  },

  videoBtn: {
    backgroundColor: '#ff005c',
  },

  logoutConfirm: {
    flexDirection: 'row',
    backgroundColor: '#ff0044',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    justifyContent: 'center',
  },

  callText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  
outerPill: {
  width: 400,
  height: 120,
  borderRadius: 18,
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  elevation: 6,
},

innerPill: {
  alignItems: "center",     
  justifyContent: "center",
  paddingHorizontal: 26,
  paddingVertical: 8,
  borderRadius: 30,
  backgroundColor: "rgba(255,255,255,0.18)",
},
innerText: {
  marginLeft: 10,
  color: "#fff",
  fontSize: 15,
  fontWeight: "700",
  letterSpacing: 1,
},
heart1: {
  position: "absolute",
  left: 18,
  top: 10,
},

heart2: {
  position: "absolute",
  left: 150,
  top: 10,
},

heart3: {
  position: "absolute",
  right: 60,
  top: 10,
},

heart4: {
  position: "absolute",
  right: 30,
  bottom: 6,
},

heart5: {
  position: "absolute",
  left: 100,
  bottom: 6,
},


  closeText: {
    color: '#aaa',
    marginTop: 10,
  },
});
