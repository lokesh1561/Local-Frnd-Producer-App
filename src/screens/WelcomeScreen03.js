import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import WelcomeScreenbackgroundgpage from "../components/BackgroundPages/WelcomeScreenbackgroungpage";

const { width } = Dimensions.get("window");

const WelcomeScreen03 = ({ navigation }) => {
  return (
    <WelcomeScreenbackgroundgpage>
      <View style={styles.container}>
        
        {/* LOGO */}
        <Image
          source={require("../components/BackgroundPages/main_log1.png")}
          style={styles.logo}
        />

        {/* CENTER HEART IMAGE */}
        <View style={styles.heartWrapper}>
          <Image
            source={require("../assets/coupleimage.png")} // 🔥 your center couple heart image
            style={styles.coupleHeart}
          />
        </View>

        {/* FLOATING SMALL HEARTS */}
        <Image
          source={require("../assets/smallheart.png")}
          style={[styles.smallHeart, { top: 190, left: 40,width:17,height:17 }]}
        />
        <Image
          source={require("../assets/smallheart.png")}
          style={[styles.smallHeart, { top: 230 ,right: 30 }]}
        />
        <Image
          source={require("../assets/smallheart.png")}
          style={[styles.smallHeart, { bottom: 400, width: 40, height:40,left: -20 }]}
        />
<Image
          source={require("../assets/smallheart.png")}
          style={[styles.smallHeart, { bottom: 380,width: 20, height:20, left: 350 }]}
        />

        {/* TEXT */}
        <View style={styles.textWrapper}>
          <Text style={styles.title}>Don’t wait anymore, find</Text>
          <Text style={styles.title}>your soulmate right now!</Text>
        </View>

        {/* CALL TO ACTION BUTTON */}
       <TouchableOpacity
  style={styles.startButton}
  onPress={() => {
    console.log("Pressed");
    navigation.navigate("Phone");
  }}
  
>

          <Text style={styles.startButtonText}>GET STARTED</Text>
        </TouchableOpacity>
      </View>
    </WelcomeScreenbackgroundgpage>
  );
};

export default WelcomeScreen03;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    width: "100%",
  },

  logo: {
    width: 100,
    height: 120,
    resizeMode: "contain",
    marginBottom: 50,
  },

  heartWrapper: {
    width: width * 0.8,
    height: width * 0.65,
    justifyContent: "center",
    alignItems: "center",
  },

  coupleHeart: {
    marginTop:100,
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },

  smallHeart: {
    width: 28,
    height: 28,
    tintColor: "#C657FF",
    position: "absolute",
    resizeMode: "contain",
  },

  textWrapper: {
    marginTop: 170,
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5b4747ff",
    textAlign: "center",
  },

  startButton: {
    width: width * 0.8,
    backgroundColor: "#9747FF",
    paddingVertical: 14,
    borderRadius: 12,
    position: "absolute",
    bottom: 70,
  },

  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
