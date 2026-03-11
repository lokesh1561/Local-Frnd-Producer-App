import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useDispatch, useSelector } from "react-redux";
import WelcomeScreenbackgroundgpage from "../components/BackgroundPages/WelcomeScreenbackgroungpage";
import { languageApiFetchRequest } from "../features/language/languageAction";
import { fetchCitiesRequest } from "../features/Countries/locationActions";
import { newUserDataRequest } from "../features/user/userAction";

const { width, height } = Dimensions.get("window");

const FillYourProfileScreen = ({ navigation, route }) => {
  const country_id = route?.params?.country_id ?? null;

  const dispatch = useDispatch();

  const { languages } = useSelector((state) => state.language);
  const { states, cities } = useSelector((state) => state.location);
  const { message: apiResponse } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [date, setDate] = useState(new Date());
  const [dob, setDob] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [language, setLanguage] = useState(null);
  const [stateValue, setStateValue] = useState(null);
  const [cityValue, setCityValue] = useState(null);

  const [showLanguageDrop, setShowLanguageDrop] = useState(false);
  const [showStateDrop, setShowStateDrop] = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);

  const [showMandatoryMsg, setShowMandatoryMsg] = useState(true);
  const [isResponseHandled, setIsResponseHandled] = useState(false);

  useEffect(() => {
    dispatch(languageApiFetchRequest());
  }, [dispatch]);

  const isFormValid =
    name.trim() !== "" &&
    username.trim() !== "" &&
    dob.trim() !== "" &&
    language !== null &&
    stateValue !== null &&
    cityValue !== null;

  useEffect(() => {
    setShowMandatoryMsg(!isFormValid);
  }, [isFormValid]);

  const calculateAge = (dobString) => {
    const [day, month, year] = dobString.split("-").map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    const age = calculateAge(dob);

    if (age < 18) {
      Alert.alert(
        "Age Restriction ❌",
        "You must be at least 18 years old to continue."
      );
      return;
    }

    if (!country_id) {
      Alert.alert("Error", "Country ID missing.");
      return;
    }

    dispatch(
      newUserDataRequest({
        name,
        username,
        date_of_birth: dob,
        language_id: language.id,
        state_id: stateValue.id,
        city_id: cityValue.id,
        country_id,
      })
    );
  };

  useEffect(() => {
    if (!apiResponse || isResponseHandled) return;

    setIsResponseHandled(true);

    Alert.alert(
      apiResponse.success ? "Success ✅" : "Error ❌",
      apiResponse.message,
      [
        {
          text: "OK",
          onPress: () => {
            if (apiResponse.success) {
              navigation.navigate("LifeStyleScreen");
            }
          },
        },
      ]
    );
  }, [apiResponse]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setIsResponseHandled(false);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <WelcomeScreenbackgroundgpage>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={width * 0.06} color="#000" />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: height * 0.1 }}
          >
            <Text style={styles.title}>Fill Your Profile</Text>

            {showMandatoryMsg && (
              <Text style={styles.mandatoryText}>
                * All fields are mandatory
              </Text>
            )}

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />

            {/* DOB */}
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.inputIconBox}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ flex: 1 }}>{dob || "DD/MM/YYYY"}</Text>
              <Icon name="calendar-outline" size={width * 0.05} />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const day = selectedDate.getDate().toString().padStart(2,"0");
                    const month = (selectedDate.getMonth()+1).toString().padStart(2,"0");
                    const year = selectedDate.getFullYear();
                    setDob(`${day}-${month}-${year}`);
                  }
                }}
              />
            )}

            <Text style={styles.sectionTitle}>General Information</Text>

            {/* LANGUAGE */}
            <Text style={styles.label}>Language</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => {
                setShowLanguageDrop(!showLanguageDrop);
                setShowStateDrop(false);
                setShowCityDrop(false);
              }}
            >
              <Text style={styles.dropdownText}>
                {language?.native_name || "Select Language"}
              </Text>
              <Icon name="chevron-down" size={width * 0.05} />
            </TouchableOpacity>

            {showLanguageDrop && (
              <ScrollView
                style={styles.dropdownList}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                {(languages || []).map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setLanguage(item);
                      setShowLanguageDrop(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>
                      {item.name_en}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* STATE */}
            <Text style={styles.label}>State</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => {
                setShowStateDrop(!showStateDrop);
                setShowLanguageDrop(false);
                setShowCityDrop(false);
              }}
            >
              <Text style={styles.dropdownText}>
                {stateValue?.name || "Select State"}
              </Text>
              <Icon name="chevron-down" size={width * 0.05} />
            </TouchableOpacity>

            {showStateDrop && (
              <ScrollView
                style={styles.dropdownList}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                {(states || []).map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setStateValue(item);
                      dispatch(fetchCitiesRequest(item.id));
                      setCityValue(null);
                      setShowStateDrop(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* CITY */}
            <Text style={styles.label}>City</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => {
                setShowCityDrop(!showCityDrop);
                setShowStateDrop(false);
                setShowLanguageDrop(false);
              }}
            >
              <Text style={styles.dropdownText}>
                {cityValue?.name || "Select City"}
              </Text>
              <Icon name="chevron-down" size={width * 0.05} />
            </TouchableOpacity>

            {showCityDrop && (
              <ScrollView
                style={styles.dropdownList}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                {(cities || []).map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setCityValue(item);
                      setShowCityDrop(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity
              style={[
                styles.continueButton,
                { backgroundColor: isFormValid ? "#B45BFA" : "#D3C8F6" },
              ]}
              disabled={!isFormValid}
              onPress={handleSubmit}
            >
              <Text style={styles.continueText}>CONTINUE</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </WelcomeScreenbackgroundgpage>
  );
};

export default FillYourProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: height * 0.08, paddingHorizontal: width * 0.05 },

  backButton: {
    position: "absolute",
    top: height * 0.07,
    left: width * 0.04,
    zIndex: 10,
  },

  title: {
    fontSize: width * 0.055,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: height * 0.04,
  },

  input: {
    backgroundColor: "#fff",
    height: height * 0.06,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E3D8FF",
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.02,
  },

  inputIconBox: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    height: height * 0.06,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E3D8FF",
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.02,
  },

  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: "600",
    marginTop: height * 0.015,
  },

  dropdown: {
    backgroundColor: "#fff",
    height: height * 0.06,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E3D8FF",
    paddingHorizontal: width * 0.03,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.015,
  },

  label: { fontSize: width * 0.035, fontWeight: "600" },

  dropdownText: { flex: 1, fontSize: width * 0.04 },

  dropdownList: {
    maxHeight: height * 0.25,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E3D8FF",
    marginBottom: height * 0.02,
  },

  dropdownItem: {
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
  },

  dropdownItemText: { fontSize: width * 0.04 },

  continueButton: {
    marginTop: height * 0.02,
    borderRadius: 10,
    paddingVertical: height * 0.02,
    alignItems: "center",
  },

  continueText: { color: "#fff", fontWeight: "700", fontSize: width * 0.04 },

  mandatoryText: {
    color: "red",
    textAlign: "center",
    marginBottom: height * 0.01,
  },
});