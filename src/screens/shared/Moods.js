import React, { useContext, useState, useEffect, useRef } from "react";
import useIsMounted from "../../hooks/useIsMounted";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";

const Moods = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const {
    authDispatch,
    moodEmojiList,
    userMood,
    snackDispatch,
    selectedMood,
    setSelectedMood,
  } = useContext(Hcontext);

  // State variables
  const [moodList, setMoodList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  // Mount guard — prevents setState on unmounted component
  const isMounted = useIsMounted();

  // Mounting
  useEffect(() => {
    fetchMoodList();
  }, []);

  const fetchMoodList = async () => {
    if (!isMounted.current) return;
    setLoading(true);
    try {
      const moodRes = await moodEmojiList();
      if (!isMounted.current) return;
      console.log("Check the mood res - ", moodRes);
      if (moodRes.status === "success" && moodRes.data && moodRes.data.length > 0) {
        setMoodList(moodRes.data);
      } else {
        console.log("No mood data received from API");
        snackDispatch({
          type: "SHOW_SNACK",
          payload: "Unable to load mood options. Please try again.",
        });
      }
    } catch (err) {
      console.log("Some issue while getting mood list - ", err);
      snackDispatch({
        type: "SHOW_SNACK",
        payload: "Failed to load mood options. Please check your connection.",
      });
    }
    if (isMounted.current) setLoading(false);
  };

  const saveUserMode = async (id, name) => {
    console.log("name.....", name);
    if (!isMounted.current) return;
    setButtonLoading(true);
    try {
      const moodRes = await userMood({ id, name });
      if (!isMounted.current) return;
      if (moodRes.status === "success") {
        snackDispatch({ type: "SHOW_SNACK", payload: moodRes?.message });
        // authDispatch({ type: "FEEDBACK", paload: true });
        navigation.pop();
        navigation.navigate("Home");
      }
    } catch (err) {
      console.log("Some issue while submitting user mood (Moods.js) - ", err);
    }
    if (isMounted.current) setButtonLoading(false);
  };

  if (loading)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="small" color={colors.loaderColor} />
      </View>
    );

  function capitalize(str) {
    if (str == null || str == undefined) {
      return "";
    }
    return str[0].toUpperCase() + str.slice(1);
  }

  // Group moods into 3 rows: 4 + 4 + remaining (last 2)
  const moodRows = [];
  for (let i = 0; i < moodList.length; i += 4) {
    moodRows.push(moodList.slice(i, i + 4));
  }

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      style={styles.container}
    >
      {/* Sized Box */}
      <View style={{ height: hp(15) }} />

      <View style={styles.mainSection}>
        <Text style={styles.title}>How are you feeling today?</Text>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {selectedMood ? (
            <>
              <Image
                source={{ uri: selectedMood?.image }}
                resizeMode="contain"
                style={styles.feedbackFaceHero}
              />
              <Text style={styles.feedbackHeroText}>
                {capitalize(selectedMood?.name)}
              </Text>
            </>
          ) : (
            <Image
              source={require("../../assets/images/mood_indicator_mascot.png")}
              resizeMode="contain"
              style={styles.feedbackFaceHero}
            />
          )}
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        <View style={styles.moodGrid}>
          {moodRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.moodRow}>
              {row.map((mood) => {
                const isSelected = selectedMood && selectedMood.id === mood.id;
                return (
                  <TouchableOpacity
                    key={mood?.id}
                    activeOpacity={0.7}
                    onPress={() => setSelectedMood(mood)}
                    style={styles.feedbackButton}
                  >
                    <View
                      style={[
                        styles.moodBox,
                        isSelected ? styles.moodBoxSelected : null,
                      ]}
                    >
                      <Image
                        source={{ uri: mood?.image }}
                        resizeMode="contain"
                        style={styles.feedbackFace}
                      />
                    </View>
                    <Text
                      style={{
                        ...styles.feedbackFaceText,
                        fontFamily: isSelected ? "PoppinsBold" : "Poppins",
                        color: isSelected
                          ? colors.primaryText
                          : colors.borderDark,
                      }}
                    >
                      {capitalize(mood?.name)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
      <View style={styles.submitButton}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.confirmButton,
            selectedMood
              ? styles.confirmButtonEnabled
              : styles.confirmButtonDisabled,
          ]}
          disabled={!selectedMood || buttonLoading}
          onPress={() => {
            if (!selectedMood) {
              snackDispatch({
                type: "SHOW_SNACK",
                payload: "Please select a mood",
              });
              return;
            }
            saveUserMode(selectedMood?.id, selectedMood?.name);
          }}
        >
          {buttonLoading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text
              style={[
                styles.confirmButtonText,
                selectedMood
                  ? styles.confirmTextEnabled
                  : styles.confirmTextDisabled,
              ]}
            >
              Confirm
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainSection: {
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal: wp(10),
  },
  title: {
    fontSize: RFValue(26),
    fontFamily: "PoppinsBold",
  },
  feedbackFaceHero: {
    width: hp(22),
    height: hp(22),
  },
  feedbackHeroText: {
    fontSize: RFValue(28),
    fontFamily: "PoppinsSemiBold",
  },
  feedbackButton: {
    justifyContent: "center",
    alignItems: "center",
    width: wp(20),
  },
  moodGrid: {
    width: "100%",
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: hp(2),
  },
  moodBox: {
    width: wp(19),
    height: wp(19),
    borderRadius: 11,
    backgroundColor: "#EDE6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  moodBoxSelected: {
    backgroundColor: "#A38AF2",
  },
  feedbackFace: {
    width: hp(6.5),
    height: hp(6.5),
  },
  feedbackFaceText: {
    fontSize: RFValue(9),
    fontFamily: "Poppins",
  },
  submitButton: {
    paddingHorizontal: wp(10),
    width: "100%",
    position: "absolute",
    bottom: hp(4),
  },
  confirmButton: {
    width: "100%",
    height: hp(6),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  confirmButtonDisabled: {
    backgroundColor: "#EEDFFF",
  },
  confirmButtonEnabled: {
    backgroundColor: "#EBDAFF",
    shadowColor: "rgba(0,0,0,0.16)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  confirmButtonText: {
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(14),
  },
  confirmTextDisabled: { color: "#A0A0A0" },
  confirmTextEnabled: { color: "#000" },
});

export default Moods;
