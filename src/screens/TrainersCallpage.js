import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { useDispatch, useSelector } from "react-redux";
import { randomUserRequest } from "../features/RandomUsers/randomuserAction";
import { audioCallRequest } from "../features/calls/callAction";

const { width, height } = Dimensions.get("window");
const AVATAR_SIZE = 70;
const GAP = 15;

const TrainersCallPage = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  /* ================= USER DATA ================= */
  const { userdata } = useSelector((state) => state.user);
  const gender = userdata?.user?.gender;

  /* ================= RANDOM USERS ================= */
  const { data, loading } = useSelector((state) => state.randomusers);
  const users = data?.users || [];

  /* ================= CALL STATE ================= */
  const call = useSelector((state) => state.calls?.call);
  console.log("CALL STATE =>", call);

  /* ================= 🔥 USER INTENT FLAG (ADDED) ================= */
  const audioRequestedRef = useRef(false);

  /* ================= ANIMATION ================= */
  const animatedPositions = useRef([]);

  /* ================= API ================= */
  useEffect(() => {
    dispatch(randomUserRequest());
  }, []);

  /* ================= 🔥 NAVIGATION LOGIC (FIXED) ================= */
  useEffect(() => {
    if (
      audioRequestedRef.current &&        // ✅ user clicked audio
      call?.status === "MATCHED" &&
      call?.session_id
    ) {
      console.log("🚀 Navigating MALE to call screen");

      navigation.navigate("AudiocallScreen", {
        session_id: call.session_id,
        target_id: call.peer_id,
        role: "caller",
      });

      audioRequestedRef.current = false; // ✅ reset after navigation
    }
  }, [call]);

  /* ================= POSITIONS ================= */
  const generatePositions = () => {
    const positions = [];
    const maxCols = Math.floor(width / (AVATAR_SIZE + GAP));
    const maxRows = Math.floor((height * 0.5) / (AVATAR_SIZE + GAP));

    for (let i = 0; i < users.length; i++) {
      const col = i % maxCols;
      const row = Math.floor(i / maxCols) % maxRows;
      positions.push({
        x: col * (AVATAR_SIZE + GAP) + GAP / 2,
        y: row * (AVATAR_SIZE + GAP) + GAP / 2,
      });
    }
    return positions;
  };

  const initialPositions = generatePositions();

  /* ================= INIT ANIMATIONS ================= */
  useEffect(() => {
    animatedPositions.current = users.map((_, i) =>
      i < 5 ? new Animated.ValueXY(initialPositions[i] || { x: 0, y: 0 }) : null
    );
  }, [users.length]);

  /* ================= START ANIMATION ================= */
  useEffect(() => {
    animatedPositions.current.forEach((anim, index) => {
      if (!anim || !initialPositions[index]) return;

      const animate = () => {
        Animated.sequence([
          Animated.timing(anim, {
            toValue: {
              x: initialPositions[index].x + (Math.random() * 30 - 15),
              y: initialPositions[index].y + (Math.random() * 30 - 15),
            },
            duration: 2500,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: initialPositions[index],
            duration: 2500,
            useNativeDriver: false,
          }),
        ]).start(animate);
      };

      animate();
    });
  }, [users]);

  /* ================= AUDIO CALL ================= */
  const handleAudioCall = () => {
    audioRequestedRef.current = true; // ✅ mark user intent

    dispatch(
      audioCallRequest({
        call_type: "AUDIO",
        gender,
      })
    );
  };

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#4B0082", "#2E004D"]} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Personal Training</Text>

          <View style={styles.coinsBox}>
            <Icon name="wallet-outline" size={18} color="#FFC300" />
            <Text style={styles.coinText}>100</Text>
            <Image
              source={require("../assets/boy1.jpg")}
              style={styles.userIcon}
            />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.mapContainer}>
        <Image source={require("../assets/map.jpg")} style={styles.map} />

        {!loading &&
          users.map((item, index) => {
            const anim = animatedPositions.current[index];
            if (!anim) return null;

            return (
              <Animated.View
                key={item.user_id}
                style={[styles.avatarWrapper, anim.getLayout()]}
              >
                <View style={styles.avatarCircle}>
                  <Image
                    source={{ uri: item.primary_image }}
                    style={styles.avatarImg}
                  />
                </View>

                <View style={styles.nameTag}>
                  <Text style={styles.nameText}>ID: {item.user_id}</Text>
                  <Feather name="phone" size={12} color="#fff" />
                </View>
              </Animated.View>
            );
          })}
      </View>

      <View style={styles.callButtons}>
        <TouchableOpacity style={styles.callBox} onPress={handleAudioCall}>
          <Text style={styles.callTitle}>Random Audio Calls</Text>
          <Feather name="phone" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TrainersCallPage;

/* ================= STYLES (UNCHANGED) ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#130018" },
  header: { paddingTop: 50, paddingHorizontal: 15, paddingBottom: 15 },
  headerTop: { flexDirection: "row", justifyContent: "space-between" },
  title: { color: "#fff", fontSize: 20, fontWeight: "600" },
  coinsBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3A003F",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  coinText: { color: "#fff", marginHorizontal: 8 },
  userIcon: { width: 28, height: 28, borderRadius: 50 },
  mapContainer: { flex: 1 },
  map: { width: "100%", height: "100%", position: "absolute", opacity: 0.28 },
  avatarWrapper: { position: "absolute", alignItems: "center" },
  avatarCircle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: "#FF46D9",
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%" },
  nameTag: {
    backgroundColor: "#FF00E6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  nameText: { color: "#fff", fontSize: 12, marginRight: 4 },
  callButtons: {
    position: "absolute",
    bottom: 90,
    width: "100%",
    paddingHorizontal: 20,
  },
  callBox: {
    backgroundColor: "#A100D7",
    height: 90,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  callTitle: { color: "#fff", fontSize: 14, marginBottom: 5 },
});
