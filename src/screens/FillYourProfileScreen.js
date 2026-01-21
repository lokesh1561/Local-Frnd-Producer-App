import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import WelcomeScreenbackgroundgpage from "../components/BackgroundPages/WelcomeScreenbackgroungpage";

const { width } = Dimensions.get("window");

const FillYourProfileScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [language, setLanguage] = useState("English");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  return (
    <WelcomeScreenbackgroundgpage>
      <View style={styles.container}>
        
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Fill Your Profile</Text>

        {/* Full Name */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        {/* Username */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />

        {/* DOB */}
        <View style={styles.inputIconBox}>
          <TextInput
            style={styles.inputIconText}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#999"
            value={dob}
            onChangeText={setDob}
          />
          <Icon name="calendar-outline" size={20} color="#999" />
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>General Information</Text>

        {/* Language Dropdown (UI only) */}
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>{language}</Text>
          <Icon name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {/* State Dropdown (UI only) */}
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>
            {state || "Select State"}
          </Text>
          <Icon name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {/* City */}
        <TextInput
          style={styles.input}
          placeholder="City"
          placeholderTextColor="#999"
          value={city}
          onChangeText={setCity}
        />

        {/* Continue Button */}
        <TouchableOpacity
  style={styles.continueButton}
  onPress={() => navigation.navigate("LifeStyleScreen")}
>
  <Text style={styles.continueText}>CONTINUE</Text>
</TouchableOpacity>

        {/* Bottom Indicator */}
        <View style={styles.bottomIndicator} />

      </View>
    </WelcomeScreenbackgroundgpage>
  );
};

export default FillYourProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 15,
    padding: 4,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E3D8FF",
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#000",
    marginBottom: 15,
  },
  inputIconBox: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E3D8FF",
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  inputIconText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginTop: 10,
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: "#fff",
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E3D8FF",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  continueButton: {
    position: "absolute",
    bottom: 50,
    width: width - 40,
    alignSelf: "center",
    backgroundColor: "#B45BFA",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  bottomIndicator: {
    position: "absolute",
    bottom: 10,
    width: 80,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#aaa",
    alignSelf: "center",
  },
});
