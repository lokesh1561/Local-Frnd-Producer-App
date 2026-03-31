import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  Dimensions,
  StyleSheet,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import WelcomeScreenbackgroungpage from "../components/BackgroundPages/WelcomeScreenbackgroungpage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { getCoinsRequest } from "../features/conis/coinActions";

const { width, height } = Dimensions.get("window");
const wp = (val) => (width * val) / 100;
const hp = (val) => (height * val) / 100;

export default function BuyCoinsScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { userdata } = useSelector((state) => state.user);
  const coins = useSelector((state) => state.coins.coins);

  const coinBalance = userdata?.user?.coin_balance ?? 0;
  const profilePhotoURL = userdata?.images?.profile_image;

  const imageUrl = profilePhotoURL
    ? { uri: profilePhotoURL }
    : require("../assets/boy2.jpg");

  useEffect(() => {
    dispatch(getCoinsRequest());
  }, []);

  /* 🔥 PERFECT CARD DESIGN */
  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.cardWrapper}>
      <LinearGradient
        colors={["#7C3AED","#D946EF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.newCard}
      >
        {/* TITLE */}
        <Text style={styles.newTitle}>
          Unlock {item?.discount_percent}% Savings
        </Text>

        {/* COIN IMAGE */}
        <Image
          source={require("../assets/multicoin.png")}
          style={styles.newCoin}
        />

        {/* PRICE */}
        <Text style={styles.newPrice}>
          Only {" "} 

  <Text style={styles.rupee}>₹</Text>
          {item?.price_after_discount}
        </Text>

        {/* BUTTON */}
        <TouchableOpacity style={styles.claimBtn}>
          <Text style={styles.claimText}>
            Claim {item?.coins}
          </Text>

          <Image
            source={require("../assets/normalmulticoin.png")}
            style={styles.btnCoin}
          />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <WelcomeScreenbackgroungpage>
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={coins || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: wp(2),
          paddingBottom: hp(6),
        }}
        ListHeaderComponent={
          <>
            <View style={styles.topRow}>
              <View style={styles.coinContainer}>
                <View style={styles.orangeBadge}>
                  <Text style={styles.badgeNumber}>
                    <Image
                      source={require("../assets/coin1.png")}
                      style={styles.headerCoin}
                    />
                    {coinBalance}
                  </Text>
                </View>
              </View>

              <View style={styles.rightSection}>
                <View style={styles.purpleCircle}>
                  <Icon name="camera-outline" size={wp(5)} color="#fff" />
                </View>

                <View style={styles.purpleCircle}>
                  <Icon name="history" size={wp(5)} color="#fff" />
                </View>

                <Image source={imageUrl} style={styles.profileImage} />
              </View>
            </View>

            <Text style={styles.lokalText}>Lokal frnd</Text>
            <Text style={styles.buyCoinsText}>Buy Coins</Text>

            <Text style={styles.offerText}>Offers</Text>

            <LinearGradient
              colors={["#D946EF", "#7E22CE"]}
              style={styles.sliderBox}
            />

            <View style={styles.dotContainer}>
              <View style={styles.activeDot} />
              <View style={styles.inactiveDot} />
              <View style={styles.inactiveDot} />
            </View>

            <Image
              source={require("../assets/blackfriday.png")}
              style={styles.blackBanner}
              resizeMode="cover"
            />
          </>
        }
      />

      <View style={styles.bottomWrapper}>
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <LinearGradient
              colors={["#C026D3", "#7E22CE"]}
              style={styles.activeIcon}
            >
              <Text style={{ color: "#fff", fontSize: wp(5) }}>🏠</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider} />
          <Text style={styles.inactiveIcon}>💜</Text>

          <View style={styles.divider} />
          <Text style={styles.inactiveIcon}>🔔</Text>

          <View style={styles.divider} />
          <Text style={styles.inactiveIcon}>💬</Text>
        </View>
      </View>
    </WelcomeScreenbackgroungpage>
  );
}

const styles = StyleSheet.create({
  newCard: {
    borderRadius: wp(6),
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    height: hp(26),
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#7C3AED",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },

  newTitle: {
    color: "#fff",
    fontSize: wp(3.8),
    fontWeight: "800",
    textAlign: "center",
  },

  newCoin: {
    width: wp(20),
    height: wp(20),
    resizeMode: "contain",
  },

  newPrice: {
    color: "#fff",
    fontSize: wp(3.5),
    fontWeight: "800",
    
  },

  claimBtn: {
    backgroundColor: "#481162",
    borderRadius: wp(10),
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    flexDirection: "row",
    alignItems: "center",
      gap: wp(1), // spacing between text & coin (🔥 best way)

  },
rupee: {
  color: "#FACC15", // gold/yellow color 🔥
  fontWeight: "900",
},
  claimText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: wp(2.5),
  },

  btnCoin: {
    width: wp(4),
    height: wp(4),
    marginLeft: wp(0.2),
  },

  cardWrapper: {
    width: wp(30),
    margin: wp(1.5),
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    marginTop: hp(3),
  },

  headerCoin: {
    width: wp(6),
    height: wp(6),
  },

  orangeBadge: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    borderRadius: wp(4),
  },

  badgeNumber: {
    color: "#fff",
    fontWeight: "700",
    fontSize: wp(3.5),
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  purpleCircle: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: "#A21CAF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(2),
  },

  profileImage: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
  },

  lokalText: {
    textAlign: "center",
    color: "#9333EA",
    fontSize: wp(4),
  },

  buyCoinsText: {
    textAlign: "center",
    color: "#A21CAF",
    fontSize: wp(6.5),
    fontWeight: "800",
  },

  offerText: {
    marginLeft: wp(4),
    marginTop: hp(2),
  },

  sliderBox: {
    marginHorizontal: wp(4),
    marginTop: hp(1),
    height: hp(7),
    borderRadius: wp(4),
  },

  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: hp(1),
  },

  activeDot: {
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(1.25),
    backgroundColor: "#C026D3",
    marginHorizontal: wp(1),
  },

  inactiveDot: {
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(1.25),
    backgroundColor: "#E9D5FF",
    marginHorizontal: wp(1),
  },

  blackBanner: {
    width: "100%",
    height: hp(18),
    marginTop: hp(2),
  },

  bottomWrapper: {
    position: "absolute",
    bottom: hp(2),
    width: "100%",
    alignItems: "center",
  },

  bottomContainer: {
    flexDirection: "row",
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: wp(10),
    paddingVertical: hp(1.5),
    justifyContent: "space-around",
  },

  activeIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: "center",
    alignItems: "center",
  },

  inactiveIcon: {
    fontSize: wp(5),
    color: "#C026D3",
  },

  divider: {
    width: 1,
    height: hp(3),
    backgroundColor: "#E5E7EB",
  },
});