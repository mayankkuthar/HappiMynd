import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Constatnts
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
import Button from "../../components/buttons/Button";
import DropDown from "../../components/input/DropDown";

const Feedback = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const {
    getEmojiList,
    submitRating,
    submitFeedback,
    snackDispatch,
    submitOpinionAfterSession,
  } = useContext(Hcontext);

  // State variables
  const [emojiList, setEmojiList] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Mounting
  useEffect(() => {
    fetchEmojiList();
  }, []);

  const fetchEmojiList = async () => {
    setLoading(true);
    try {
      const emojis = await getEmojiList();

      console.log("chec kthe emolji list - ", emojis);

      if (emojis.status === "success") {
        // setEmojiList(
        //   emojis.list.map((e) => {
        //     if (e.id == 1) return { ...e, name: "Delighted" };
        //     else if (e.id == 2) return { ...e, name: "Happy" };
        //     else if (e.id == 3) return { ...e, name: "Not Happy" };
        //     else if (e.id == 4) return { ...e, name: "Somewhat \n Happy" };
        //     else if (e.id == 5) return { ...e, name: "Very Happy" };
        //     else return e;
        //   })
        // );
        setEmojiList(emojis.list);
      }
    } catch (err) {
      console.log("Some issuw while fetching the emojis - ", err);
    }
    setLoading(false);
  };

  const feedbackSubmitHandler = async () => {
    setLoading(true);
    try {
      if (!selectedMood) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Please select a mood",
        });
      }
      if (!comment) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Please enter a comment",
        });
      }

      let ratingRes;

      if (
        props?.route?.params?.module === "guide" ||
        props?.route?.params?.module === "talk"
      ) {
        ratingRes = await submitOpinionAfterSession({
          module: props?.route?.params?.module,
          sessionId: props?.route?.params?.sessionId,
          emojiId: selectedMood,
          reason: selectedReason?.name,
          comments: comment,
        });
        navigation.goBack();
      }

      if (props?.route?.name === "Rate") {
        ratingRes = await submitRating({
          id: selectedMood,
          review: comment,
        });
      } else if (props?.route?.name === "Feedback") {
        ratingRes = await submitFeedback({
          id: selectedMood,
          review: comment,
        });
      }

      console.log("Check rating res - ", ratingRes);

      if (ratingRes?.message == "Your reviewed has been already submitted.") {
        snackDispatch({
          type: "SHOW_SNACK",
          payload: "Your inputs have been already submitted",
        });
      } else {
        // snackDispatch({ type: "SHOW_SNACK", payload: ratingRes.message });
        snackDispatch({
          type: "SHOW_SNACK",
          payload: "Your inputs have been submitted successfully",
        });
      }

      setSelectedMood(null);
      setComment("");
    } catch (err) {
      console.log("Some issue while submitting feedback - ", err);
    }
    setLoading(false);
  };

  console.log("CHeck teh feedback props - ", props);

  return (
    <View style={styles.container}>
      <Header navigation={navigation} showBack={props.route.params?.showBack} />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: wp(10) }}>
          {/* Sized Box */}
          <View style={{ height: hp(3) }} />

          {/* Hero Section */}
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../../assets/images/feedback_hero.png")}
              resizeMode="contain"
              style={styles.feedbackHero}
            />
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(4) }} />

          <View>
            <Text style={styles.feedbackTitle}>Your opinion matters</Text>
            {/* Sized Box */}
            <View style={{ height: hp(2) }} />
            <Text style={styles.feedbackDescription}>
              Please Rate your Experience
            </Text>

            {/* Sized Box */}
            <View style={{ height: hp(2) }} />

            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              {emojiList.length
                ? emojiList.map((emoji) => (
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setSelectedMood(emoji.id)}
                      style={styles.feedbackButton}
                    >
                      <Image
                        source={{ uri: emoji.image }}
                        resizeMode="contain"
                        style={styles.feedbackFace}
                      />
                      {/* Sized Box */}
                      <View style={{ height: hp(1) }} />
                      <Text
                        style={{
                          ...styles.faceText,
                          color:
                            selectedMood === emoji.id
                              ? colors.primaryText
                              : "#000",
                          fontFamily:
                            selectedMood === emoji.id
                              ? "PoppinsSemiBold"
                              : "Poppins",
                        }}
                      >
                        {emoji.name}
                      </Text>
                    </TouchableOpacity>
                  ))
                : null}
            </View>

            {/* Sized Box */}
            <View style={{ height: hp(2) }} />

            {props?.route?.params?.module === "guide" ||
              (props?.route?.params?.module === "talk" && (
                <View style={{ width: wp(80) }}>
                  <DropDown
                    title="Select Reason"
                    placeHolder="Select status"
                    data={[
                      { id: 1, name: "Very insightful, will book again" },
                      { id: 2, name: "Session was helpful" },
                      { id: 3, name: "Session was not helpful" },
                      { id: 4, name: "Please change the therapist" },
                      { id: 5, name: "Therapist did not show up" },
                    ]}
                    setSelectedData={setSelectedReason}
                  />
                </View>
              ))}

            {/* Sized Box */}
            <View style={{ height: hp(2) }} />

            <Text style={styles.feedbackDescription}>Additional comment</Text>

            {/* Sized Box */}
            <View style={{ height: hp(2) }} />

            <TextInput
              multiline={true}
              // numberOfLines={4}
              style={styles.feedbackComment}
              placeholder="Type your Comment here . . . . . . ."
              value={comment}
              onChangeText={(text) => setComment(text)}
            />

            {/* Sized Box */}
            <View style={{ height: hp(3) }} />

            <Button
              text="Submit"
              loading={loading}
              pressHandler={feedbackSubmitHandler}
            />
          </View>
        </View>
        {/* Sized Box */}
        <View style={{ height: hp(6) }} />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  feedbackHero: {
    // backgroundColor: "red",
    width: wp(90),
    height: hp(24),
  },
  feedbackTitle: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsBold",
  },
  feedbackDescription: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
  feedbackButton: {
    // backgroundColor: "yellow",
    alignItems: "center",
  },
  feedbackFace: {
    // backgroundColor: "red",
    width: hp(6),
    height: hp(4),
  },
  feedbackComment: {
    backgroundColor: "#fff",
    paddingHorizontal: hp(2),
    paddingVertical: hp(2),
    borderRadius: 4,
    height: hp(14),
    fontSize: RFValue(12),
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  faceText: {
    fontSize: RFValue(8),
    fontFamily: "Poppins",
    textAlign: "center",
  },
});

export default Feedback;
