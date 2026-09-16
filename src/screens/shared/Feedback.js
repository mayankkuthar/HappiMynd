import React, { useState, useContext } from "react";
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
import { RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome } from "@expo/vector-icons";

// Constatnts
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
import Button from "../../components/buttons/Button";
import DropDown from "../../components/input/DropDown";

const totalStars = [1, 2, 3, 4, 5];

const Feedback = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const {
    submitRating,
    submitFeedback,
    snackDispatch,
    submitOpinionAfterSession,
  } = useContext(Hcontext);

  // State variables
  const [rating, setRating] = useState(0);
  const [selectedReason, setSelectedReason] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const feedbackSubmitHandler = async () => {
    setLoading(true);
    try {
      if (!rating) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Please select a rating",
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
          emojiId: rating,
          reason: selectedReason?.name,
          comments: comment,
        });
        navigation.goBack();
      }

      if (props?.route?.name === "Rate") {
        ratingRes = await submitRating({
          id: rating,
          review: comment,
        });
      } else if (props?.route?.name === "Feedback") {
        ratingRes = await submitFeedback({
          id: rating,
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

      setRating(0);
      setComment("");
    } catch (err) {
      console.log("Some issue while submitting feedback - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} showBack={props.route.params?.showBack} />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: wp(3.8), paddingVertical: hp(2.5) }}
      >
        <View>
          {/* Illustration */}
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../../assets/images/feedback_hero.png")}
              resizeMode="contain"
              style={styles.feedbackHero}
            />
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(1.5) }} />

          {/* Heading */}
          <Text style={styles.feedbackTitle}>Your Opinion Matters</Text>

          {/* Sized Box */}
          <View style={{ height: hp(2.5) }} />

          {/* Rating */}
          <Text style={styles.feedbackDescription}>
            Please Rate Your Experience
          </Text>

          {/* Sized Box */}
          <View style={{ height: hp(1.5) }} />

          <View style={styles.starRow}>
            {totalStars.map((star) => (
              <TouchableOpacity
                key={star}
                activeOpacity={0.7}
                onPress={() => setRating(star)}
              >
                <FontAwesome
                  name={star <= rating ? "star" : "star-o"}
                  size={hp(3.5)}
                  color={star <= rating ? "#9747FF" : "#111111"}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(2.5) }} />

          {props?.route?.params?.module === "guide" ||
            props?.route?.params?.module === "talk" ? (
              <View>
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

                {/* Sized Box */}
                <View style={{ height: hp(2) }} />
              </View>
            ) : null}

          {/* Sized Box */}
          <View style={{ height: hp(2.5) }} />

          {/* Comment */}
          <Text style={styles.feedbackDescription}>
            Additional Comment
          </Text>

          {/* Sized Box */}
          <View style={{ height: hp(1.5) }} />

          <TextInput
            multiline={true}
            style={styles.feedbackComment}
            placeholder="Type your comment here . . . . . ."
            placeholderTextColor="#666666"
            value={comment}
            onChangeText={(text) => setComment(text)}
            textAlignVertical="top"
          />

          {/* Sized Box */}
          <View style={{ height: hp(3) }} />
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.bottomContainer}>
        <Button
          text="Submit"
          loading={loading}
          pressHandler={feedbackSubmitHandler}
          containerStyle={styles.submitButton}
          textStyle={styles.submitText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3EFFD",
    flex: 1,
  },
  feedbackHero: {
    width: wp(72),
    height: hp(22),
  },
  feedbackTitle: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsBold",
    color: "#111111",
    textAlign: "left",
  },
  feedbackDescription: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    color: "#666666",
  },
  starRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(2),
  },
  feedbackComment: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D6D6D6",
    borderRadius: hp(2.5),
    minHeight: hp(14),
    paddingHorizontal: wp(5),
    paddingVertical: hp(2.5),
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    color: "#222222",
  },
  submitButton: {
    backgroundColor: "#E6DEFF",
    height: hp(4.7),
    borderRadius: hp(2.3),
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: {
    color: "#222222",
    fontFamily: "PoppinsSemiBold",
  },
  bottomContainer: {
    paddingHorizontal: wp(3.8),
    paddingBottom: hp(4),
    paddingTop: hp(1.5),
  },
});

export default Feedback;