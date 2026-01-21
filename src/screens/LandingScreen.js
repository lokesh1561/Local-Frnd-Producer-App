import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";

const LandingScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("OnboardScreen");
    },3000); // ⏱ 3 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require("../components/BackgroundPages/backgroundimage.jpg")}
      style={styles.background}
    >
       <Image
        source={require("../assets/leftheart.png")}
        style={styles.leftHeart}
      />

      <Image
        source={require("../assets/rightheart.png")}
        style={styles.rightHeart}
      />
      <View style={styles.container}>
        {/* Center Logo */}
        <Image
          source={require("../components/BackgroundPages/main_log1.png")}
          style={styles.logo}
        />
      </View>
    </ImageBackground>
  );
};

export default LandingScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 500,
    height: 500,
    resizeMode: "contain",
  },
  leftHeart: {
  position: "absolute",
  top: 140,  
  width: 80,
  height: 140,
  resizeMode: "contain",
  opacity: 0.6,
},

rightHeart: {
  position: "absolute",
  top: 30,
  left:160,
  width: 290,
  height: 230,
  resizeMode: "contain",
  opacity: 0.6,
},

});
