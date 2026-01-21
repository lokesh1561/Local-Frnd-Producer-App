import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from "react-native";
import WelcomeScreenbackgroungpage from"../components/BackgroundPages/WelcomeScreenbackgroungpage"
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { userDatarequest } from "../features/user/userAction";
import { SocketContext } from "../socket/SocketProvider";

const { width, height } = Dimensions.get("window");

/* ================= RESPONSIVE HELPERS ================= */
const wp = (v) => (width * v) / 100;
const hp = (v) => (height * v) / 100;
const iconSize = (v) => wp(v);

/* ================= STORIES + ACTIVE USERS ================= */
const activePals = [
  { id: 1, name: "Aadhya", img: require("../assets/girl1.jpg") },
  { id: 2, name: "Yuvaan", img: require("../assets/boy1.jpg") },
  { id: 3, name: "Luna", img: require("../assets/girl2.jpg") },
  { id: 4, name: "Hannah", img: require("../assets/girl3.jpg") },
  { id: 5, name: "Aarav", img: require("../assets/boy2.jpg") },
];

/* ================= OFFERS ================= */
const offers = [
  { id: 1, text: "Buy 100 Coins, Get 20 Free!" },
  { id: 2, text: "Buy 200 Coins, Get 50 Free!" },
  { id: 3, text: "Buy 500 Coins, Get 150 Free!" },
];

/* =======================================================
   HOMESCREEN COMPONENT (LOGIC NOT MODIFIED)
======================================================= */
const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const socketRef = useContext(SocketContext);
  const socket = socketRef?.current;

  const { userdata } = useSelector((state) => state.user);
  const profilePhotoURL = userdata?.primary_image?.photo_url;
  const imageUrl = profilePhotoURL
    ? { uri: profilePhotoURL }
    : require("../assets/boy2.jpg");

  /* ================= LOAD USER ================= */
  useEffect(() => {
    dispatch(userDatarequest());
  }, []);

  /* ================= SOCKET LISTENERS ================= */
  useEffect(() => {
    if (!socket) return;
    const onPresence = (data) => {
      console.log("👤 Presence:", data.user_id, data.status);
    };
    socket.on("presence_update", onPresence);
    return () => {
      socket.off("presence_update", onPresence);
    };
  }, [socket]);

  /* ================= UI RENDER ================= */
  return (
    <WelcomeScreenbackgroungpage>

    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        >
        {/* ================= HEADER ================= */}
        <View style={styles.headerRow}>
          {/* LEFT */}
          <View style={styles.headerLeft}>
            <View style={styles.coinTray}>
              <Icon name="currency-eth" size={iconSize(5)} color="#8B5CF6" />
              <Text style={styles.coinTrayText}>
                {userdata?.user?.coin_balance ?? 0}
              </Text>
            </View>
          </View>

          {/* RIGHT */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconBtn}>
              <Icon name="bell-outline" size={iconSize(6)} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("UplodePhotoScreen")}
            >
              <Image source={imageUrl} style={styles.profilePic} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= SEARCH BAR (SB2) ================= */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={iconSize(6)} color="#999" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#8E8E93"
            style={styles.searchInput}
          />
        </View>

        {/* ================= STORIES SECTION ================= */}
        <Text style={styles.sectionLabel}>Stories</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: wp(2) }}
        >
          {/* YOUR STORY */}
          <TouchableOpacity style={styles.storyContainer}>
            <View style={styles.yourStoryCircle}>
              <Icon name="plus" size={iconSize(6)} color="#8B5CF6" />
            </View>
            <Text style={styles.storyName}>Your Story</Text>
          </TouchableOpacity>

          {/* ACTIVE PALS AS STORIES */}
          {activePals.map((p) => (
            <TouchableOpacity key={p.id} style={styles.storyContainer}>
              <Image source={p.img} style={styles.storyAvatar} />
              <Text style={styles.storyName}>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ================= OFFERS CAROUSEL ================= */}
        <Text style={styles.sectionLabel}>Offers</Text>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: hp(1) }}
        >
          {offers.map((o) => (
            <View key={o.id} style={styles.offerCard}>
              <Text style={styles.offerText}>{o.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* DOTS */}
        <View style={styles.dotsRow}>
          {offers.map((o, idx) => (
            <View key={o.id} style={[styles.dot, idx === 0 && styles.dotActive]} />
          ))}
        </View>

        {/* ================= LIKE-MINDED SECTION ================= */}
        <Text style={styles.sectionLabel}>Like Minded People</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: wp(2) }}
        >
          {activePals.map((p) => (
            <View key={p.id} style={styles.likeCard}>
              <Image source={p.img} style={styles.likeAvatar} />
              <Text style={styles.likeName}>{p.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ================= ACTIVE DOST SECTION ================= */}
        <Text style={styles.sectionLabel}>Active Dost</Text>
        <Text style={styles.placeholderText}>No active dost right now...</Text>

        {/* ================= BOTTOM ACTION BUTTONS ================= */}
        <View style={styles.bottomActionRow}>
          <TouchableOpacity
            style={styles.actionBox}
            onPress={() => navigation.navigate("TrainersCallpage")}
          >
            <Icon name="phone" size={iconSize(6)} color="#fff" />
            <Text style={styles.actionText}>Random Audio Calls</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBox}
            onPress={() => navigation.navigate("TrainersCallpage")}
          >
            <Icon name="video" size={iconSize(6)} color="#fff" />
            <Text style={styles.actionText}>Random Video Calls</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBox}
            onPress={() => navigation.navigate("TrainersCallpage")}
          >
            <Icon name="account-group" size={iconSize(6)} color="#fff" />
            <Text style={styles.actionText}>Random Feed Calls</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: hp(12) }} />
      </ScrollView>

      {/* ================= BOTTOM NAVIGATION ================= */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home-outline" size={iconSize(7)} color="#8B5CF6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon name="magnify" size={iconSize(7)} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon name="bell-outline" size={iconSize(7)} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("ProfileScreen")}
          >
          <Icon name="account-circle-outline" size={iconSize(8)} color="#8E8E93" />
        </TouchableOpacity>
      </View>
    </View>
          </WelcomeScreenbackgroungpage>
  );
};

export default HomeScreen;

/* =======================================================
  ======================= STYLES =========================
======================================================= */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    // backgroundColor: "#FFFFFF",
  },
  container: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
  },

  /* ================= HEADER ================= */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    justifyContent: "center",
    alignItems: "center",
  },
  coinTray: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fb780cec",
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: wp(8),
    borderWidth: 1,
    borderColor: "#E0D6FF",
  },
  coinTrayText: {
    marginLeft: wp(1),
    color: "#6D28D9",
    fontWeight: "700",
    fontSize: wp(4),
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconBtn: {
    marginRight: wp(3),
    
  },
  profilePic: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    borderWidth: 2,
    borderColor: "#8B5CF6",
  },

  /* ================= SEARCH ================= */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#b678f5ff",
    borderWidth: 1,
    borderRadius: wp(4),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    marginTop: hp(2),
    backgroundColor:"#faf8fbff"
  },
  searchInput: {
    flex: 1,
    fontSize: wp(4),
    marginLeft: wp(2),
    color: "#f8efefff",
  },

  /* ================= STORIES ================= */
  sectionLabel: {
    fontSize: wp(5),
    fontWeight: "700",
    color: "#111",
    marginTop: hp(3),
    marginBottom: hp(1),
  },
  storyContainer: {
    alignItems: "center",
    marginRight: wp(4),
  },
  yourStoryCircle: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    backgroundColor: "#EFE7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  storyAvatar: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
  },
  storyName: {
    marginTop: hp(0.5),
    fontSize: wp(3),
    color: "#333",
    fontWeight: "500",
  },

  /* ================= OFFERS ================= */
  offerCard: {
    width: width - wp(10),
    height: hp(15),
    backgroundColor: "#F0EAFF",
    borderRadius: wp(5),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(4),
    borderWidth: 1,
    borderColor: "#E0D6FF",
  },
  offerText: {
    color: "#4C1D95",
    fontSize: wp(4.2),
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: wp(5),
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: hp(1),
  },
  dot: {
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(1.25),
    backgroundColor: "#D4D4D4",
    marginHorizontal: wp(1),
  },
  dotActive: {
    backgroundColor: "#8B5CF6",
  },

  /* ================= LIKE MINDED ================= */
  likeCard: {
    alignItems: "center",
    marginRight: wp(4),
  },
  likeAvatar: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    borderWidth: 2,
    borderColor: "#C4B5FD",
  },
  likeName: {
    fontSize: wp(3.2),
    color: "#222",
    marginTop: hp(0.5),
    fontWeight: "600",
  },

  /* ================= ACTIVE DOST ================= */
  placeholderText: {
    fontSize: wp(3.5),
    color: "#777",
    paddingLeft: wp(2),
    marginTop: hp(1),
  },

  /* ================= BOTTOM ACTION BUTTONS ================= */
  bottomActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(4),
  },
  actionBox: {
    width: "30%",
    backgroundColor: "#8B5CF6",
    borderRadius: wp(4),
    alignItems: "center",
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: wp(3),
    marginTop: hp(0.7),
    textAlign: "center",
  },

  /* ================= BOTTOM NAV ================= */
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    height: hp(9),
    backgroundColor: "#FFFFFF",
  },
  navItem: {
    padding: wp(2),
    alignItems: "center",
  },
});
