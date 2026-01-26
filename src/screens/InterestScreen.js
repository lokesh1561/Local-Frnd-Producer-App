import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import WelcomeScreenbackgroundgpage from "../components/BackgroundPages/WelcomeScreenbackgroungpage.js";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInterestsRequest,
  selectInterestsRequest,
} from "../features/interest/interestActions";

const InterestScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const { interests, loading } = useSelector((state) => state.interest);

  // stores ONLY interest IDs
  const [selected, setSelected] = useState([]);

  // toggle by ID
  const toggleSelect = (item) => {
    setSelected((prev) =>
      prev.includes(item.id)
        ? prev.filter((v) => v !== item.id)
        : [...prev, item.id]
    );
  };

  useEffect(() => {
    dispatch(fetchInterestsRequest());
  }, [dispatch]);

  return (
    <WelcomeScreenbackgroundgpage>
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Your Interest</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* SUB TEXT */}
        <Text style={styles.subText}>
          Select your interests to match with soul mate who have{"\n"}
          similar things in common
        </Text>

        {/* LOADER */}
        {loading && <Text style={{ color: "#000" }}>Loading...</Text>}

        {/* TAGS LIST */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.tagsWrapper}>
            {interests?.map((item) => {
              const active = selected.includes(item.id); // ✅ FIX
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => toggleSelect(item)} // ✅ FIX
                  style={[styles.tag, active && styles.tagActive]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      active && styles.tagTextActive,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* CONTINUE BUTTON */}
          <LinearGradient
            colors={["#D916F1", "#7E0FFF"]}
            style={[
              styles.continueBtn,
              selected.length === 0 && { opacity: 0.5 },
            ]}
          >
            <TouchableOpacity
              disabled={selected.length === 0}
              onPress={() => {
                dispatch(
                  selectInterestsRequest({
                    interests: selected, 
                  })
                );

                navigation.navigate("GenderScreen");
              }}
            >
              <Text style={styles.continueText}>CONTINUE</Text>
            </TouchableOpacity>
          </LinearGradient>

          <View style={{ height: 30 }} />
        </ScrollView>
      </SafeAreaView>
    </WelcomeScreenbackgroundgpage>
  );
};

export default InterestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  subText: {
    color: "#6A6A6A",
    fontSize: 14,
    marginBottom: 40,
    lineHeight: 20,
  },
  tagsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    borderWidth: 1,
    borderColor: "#E3D4FF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#FFEFFE",
    marginTop: 10,
  },
  tagActive: {
    backgroundColor: "#8A2DFF",
    borderColor: "#8A2DFF",
  },
  tagText: {
    color: "#4c4c4c",
    fontSize: 13,
    fontWeight: "500",
  },
  tagTextActive: {
    color: "#FFFFFF",
  },
  continueBtn: {
    marginTop: 130,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 1,
  },
});
