import React, { useContext, useState, useEffect } from "react";
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
import Button from "../../components/buttons/Button";

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

  // Mounting
  useEffect(() => {
    fetchMoodList();
  }, []);

  const fetchMoodList = async () => {
    setLoading(true);
    try {
      const moodRes = await moodEmojiList();
      console.log("Check the mod dres - ", moodRes);
      if (moodRes.status === "success") {
        setMoodList(moodRes.data);
        let happyItem = moodRes.data.filter((item) => item.name == "happy");
        // console.log("happy", happyItem);
        setSelectedMood(happyItem[0]);
      }
    } catch (err) {
      console.log("Some issue while getting mood list - ", err);
    }
    setLoading(false);
  };

  const saveUserMode = async (id, name) => {
    console.log("name.....", name);
    setButtonLoading(true);
    try {
      const moodRes = await userMood({ id, name });

      if (moodRes.status === "success") {
        snackDispatch({ type: "SHOW_SNACK", payload: moodRes?.message });
        // authDispatch({ type: "FEEDBACK", paload: true });
        navigation.pop();
        navigation.navigate("Home");
      }
    } catch (err) {
      console.log("Some issue while submitting user mood (Moods.js) - ", err);
    }
    setButtonLoading(false);
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
          <Image
            source={{ uri: selectedMood?.image }}
            resizeMode="contain"
            style={styles.feedbackFaceHero}
          />
          <Text style={styles.feedbackHeroText}>
            {capitalize(selectedMood?.name)}
          </Text>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          {moodList.map(
            (mood, index) =>
              index < 5 && (
                <TouchableOpacity
                  key={mood?.id}
                  activeOpacity={0.7}
                  onPress={() => setSelectedMood(mood)}
                  style={styles.feedbackButton}
                >
                  <Image
                    source={{ uri: mood?.image }}
                    resizeMode="contain"
                    style={{
                      ...styles.feedbackFace,
                      borderColor:
                        selectedMood.id === mood.id
                          ? colors.pageTitle
                          : "transparent",
                    }}
                  />
                  <Text
                    style={{
                      ...styles.feedbackFaceText,
                      fontFamily:
                        selectedMood.id === mood.id ? "PoppinsBold" : "Poppins",
                      color:
                        selectedMood.id === mood.id
                          ? colors.primaryText
                          : colors.borderDark,
                    }}
                  >
                    {capitalize(mood?.name)}
                  </Text>
                </TouchableOpacity>
              )
          )}
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(3) }} />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          {moodList.map(
            (mood, index) =>
              index > 4 && (
                <TouchableOpacity
                  key={mood?.id}
                  activeOpacity={0.7}
                  onPress={() => setSelectedMood(mood)}
                  style={styles.feedbackButton}
                >
                  <Image
                    source={{ uri: mood?.image }}
                    resizeMode="contain"
                    style={{
                      ...styles.feedbackFace,
                      borderColor:
                        selectedMood.id === mood.id
                          ? colors.pageTitle
                          : "transparent",
                    }}
                  />
                  <Text
                    style={{
                      ...styles.feedbackFaceText,
                      fontFamily:
                        selectedMood.id === mood.id ? "PoppinsBold" : "Poppins",
                      color:
                        selectedMood.id === mood.id
                          ? colors.primaryText
                          : colors.borderDark,
                    }}
                  >
                    {capitalize(mood?.name)}
                  </Text>
                </TouchableOpacity>
              )
          )}
        </View>
      </View>
      <View style={styles.submitButton}>
        <Button
          text="Confirm"
          pressHandler={() =>
            saveUserMode(selectedMood?.id, selectedMood?.name)
          }
          loading={buttonLoading}
        />
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
    width: hp(16),
    height: hp(16),
  },
  feedbackHeroText: {
    fontSize: RFValue(28),
    fontFamily: "PoppinsSemiBold",
  },
  feedbackButton: {
    // backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
    width: wp(20),
    // borderWidth: 1,
    // borderColor: colors.pageTitle,
    // borderRadius: hp(100),
  },
  feedbackFace: {
    // backgroundColor: "red",
    width: hp(5),
    height: hp(5),
    borderWidth: 2,
    borderRadius: hp(100),
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
});

export default Moods;
