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
  ScrollView,
  NativeModules,
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
    rewardList,
    selectedMood,
    setSelectedMood,
    isMoodOMeterDue,
    setMoodTimestamp,
  } = useContext(Hcontext);

  // State variables
  const [moodList, setMoodList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  // Mount guard — prevents setState on unmounted component
  const isMounted = useIsMounted();

  // Mounting
  useEffect(() => {
    (async () => {
      const moodDue = await isMoodOMeterDue();
      if (!moodDue) {
        snackDispatch({
          type: "SHOW_SNACK",
          payload:
            "Mood already recorded. The Mood O Meter will open again after 24 hours.",
        });
        if (navigation?.pop) navigation.pop();
        else if (navigation?.goBack) navigation.goBack();
        else if (isMounted.current) setMoodList([]);
        return;
      }
      fetchMoodList();
    })();
  }, []);

  // Hide system bottom navigation bar while on this screen
  useEffect(() => {
    NativeModules.SystemBars.hideNavigationBar();
    return () => {
      NativeModules.SystemBars.showNavigationBar();
    };
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
        await setMoodTimestamp();
        snackDispatch({ type: "SHOW_SNACK", payload: moodRes?.message });
        let points = 50;
        try {
          const rewards = await rewardList();
          if (rewards.status === "success") {
            const moodReward = rewards.list.find((entry) => entry.id == 7);
            if (moodReward) {
              const pts = Number(moodReward.points_to_be_given);
              if (!isNaN(pts)) points = pts;
            }
          }
        } catch (err) {
          console.log(
            "Some issue while fetching reward points (Moods.js) - ",
            err
          );
        }
        navigation.pop();
        navigation.navigate("HomeScreen", { pointsToast: points });
        navigation.navigate("Home", { pointsToast: points });
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

  return (
    <ImageBackground
      source={require("../../assets/images/contact_background.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.mainSection}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: hp(4) }} />

        <Text style={styles.title}>How are you feeling Today?</Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

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
              style={styles.feedbackFaceMascot}
            />
          )}
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(1) }} />

        <View style={styles.moodGrid}>
          {moodList.map((mood) => {
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

        {/* Sized Box */}
        <View style={{ height: hp(14) }} />
      </ScrollView>
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
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: RFValue(26),
    fontFamily: "PoppinsBold",
    textAlign: "center",
  },
  feedbackFaceHero: {
    width: hp(25),
    height: hp(25),
  },
  feedbackFaceMascot: {
    width: hp(30),
    height: hp(30),
  },
  feedbackHeroText: {
    fontSize: RFValue(28),
    fontFamily: "PoppinsSemiBold",
  },
  feedbackButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "25%",
    marginBottom: hp(1.5),
  },
  moodGrid: {
    width: wp(92),
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  moodBox: {
    width: wp(13),
    height: wp(13),
    borderRadius: 11,
    backgroundColor: "#EDE6FF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  moodBoxSelected: {
    backgroundColor: "#A38AF2",
  },
  feedbackFace: {
    width: "90%",
    height: "90%",
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
