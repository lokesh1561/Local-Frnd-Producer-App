import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

const LifeStyleScreen = ({ navigation }) => {
  const [drinking, setDrinking] = useState("");
  const [smoking, setSmoking] = useState("");
  const [eating, setEating] = useState("");
  const [about, setAbout] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerRow}>
          <Ionicons name="chevron-back" size={22} />
          <Text style={styles.header}>Life Style</Text>
        </TouchableOpacity>

        {/* Drinking */}
        <Text style={styles.label}>Drinking</Text>
        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={drinking}
            onValueChange={(value) => setDrinking(value)}
          >
            <Picker.Item label="Planning To Quit" value="quit" />
            <Picker.Item label="No" value="no" />
            <Picker.Item label="Occasionally" value="occasionally" />
            <Picker.Item label="Frequently" value="frequently" />
          </Picker>
        </View>

        {/* Smoking */}
        <Text style={styles.label}>Smoking</Text>
        <View style={styles.dropdownWrapperActive}>
          <Picker
            selectedValue={smoking}
            onValueChange={(value) => setSmoking(value)}
          >
            <Picker.Item label="Never" value="never" />
            <Picker.Item label="Trying to Quit" value="quit" />
            <Picker.Item label="Occasionally" value="occasionally" />
            <Picker.Item label="Frequently" value="frequently" />
          </Picker>
        </View>

        {/* Eating */}
        <Text style={styles.label}>Eating</Text>
        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={eating}
            onValueChange={(value) => setEating(value)}
          >
            <Picker.Item label="Non - Vegetarian" value="nonveg" />
            <Picker.Item label="Vegetarian" value="veg" />
            <Picker.Item label="Eggetarian" value="egg" />
            <Picker.Item label="Non-Vegetarian" value="nonveg" />
          </Picker>
        </View>

        {/* About */}
        <Text style={styles.label}>About</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Type Here..."
          multiline
          value={about}
          onChangeText={setAbout}
        />

        {/* Button */}
        <TouchableOpacity style={{ marginTop: 30 }} onPress={()=>{navigation.navigate("InterestScreen")}}>
          <LinearGradient
            colors={["#9D4CF1", "#D800F4"]}
            style={styles.button}
          >
            <Text style={styles.buttonText}>CONTINUE</Text>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default LifeStyleScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF9FF" },
  inner: { paddingHorizontal: 20, paddingBottom: 40 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  header: { fontSize: 20, fontWeight: "600", marginLeft: 8 },
  label: { fontSize: 15, fontWeight: "500", marginBottom: 6, marginTop: 14 },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 10,
    height: 48,
    justifyContent: "center",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  dropdownWrapperActive: {
    borderWidth: 2,
    borderColor: "#B675F8",
    borderRadius: 10,
    height: 48,
    justifyContent: "center",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    height: 120,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
