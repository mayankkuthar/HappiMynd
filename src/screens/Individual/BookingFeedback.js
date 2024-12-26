import React from "react";
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

// Components
import Header from "../../components/common/Header";
import Button from "../../components/buttons/Button";

const BookingFeedback = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <Header navigation={navigation} showBack={true} showLogo={false} />
      <KeyboardAwareScrollView>
        <View style={{ paddingHorizontal: wp(10) }}>
          {/* Sized Box */}
          <View style={{ height: hp(3) }} />

          {/* Hero Section */}
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../../assets/images/excited.png")}
              resizeMode="contain"
              style={styles.feedbackHero}
            />
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <View>
            <Text style={styles.feedbackTitle}>Delighted</Text>
            {/* Sized Box */}
            <View style={{ height: hp(4) }} />
            <Text style={styles.feedbackDescription}>
              Please Rate your Experience
            </Text>

            {/* Sized Box */}
            <View style={{ height: hp(2) }} />

            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {}}
                style={styles.feedbackButton}
              >
                <Image
                  source={require("../../assets/images/red_sad.png")}
                  resizeMode="contain"
                  style={styles.feedbackFace}
                />
                {/* Sized Box */}
                <View style={{ height: hp(1) }} />
                <Text style={styles.faceText}>Not</Text>
                <Text style={styles.faceText}>Happy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {}}
                style={styles.feedbackButton}
              >
                <Image
                  source={require("../../assets/images/yellow_sad.png")}
                  resizeMode="contain"
                  style={styles.feedbackFace}
                />
                {/* Sized Box */}
                <View style={{ height: hp(1) }} />
                <Text style={styles.faceText}>Somewhat</Text>
                <Text style={styles.faceText}>Happy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {}}
                style={styles.feedbackButton}
              >
                <Image
                  source={require("../../assets/images/moderate.png")}
                  resizeMode="contain"
                  style={styles.feedbackFace}
                />
                {/* Sized Box */}
                <View style={{ height: hp(1) }} />
                <Text style={styles.faceText}>Happy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {}}
                style={styles.feedbackButton}
              >
                <Image
                  source={require("../../assets/images/green_happy.png")}
                  resizeMode="contain"
                  style={styles.feedbackFace}
                />
                {/* Sized Box */}
                <View style={{ height: hp(1) }} />
                <Text style={styles.faceText}>Very</Text>
                <Text style={styles.faceText}>Happy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {}}
                style={styles.feedbackButton}
              >
                <Image
                  source={require("../../assets/images/excited.png")}
                  resizeMode="contain"
                  style={styles.feedbackFace}
                />
                {/* Sized Box */}
                <View style={{ height: hp(1) }} />
                <Text style={styles.faceText}>Delighted</Text>
              </TouchableOpacity>
            </View>

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
            />

            {/* Sized Box */}
            <View style={{ height: hp(3) }} />

            <Button
              text="Submit"
              pressHandler={() => navigation.navigate("Home")}
            />
          </View>
        </View>
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
    width: wp(80),
    height: hp(20),
  },
  feedbackTitle: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsBold",
    textAlign: "center",
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
    width: hp(4),
    height: hp(4),
  },
  feedbackComment: {
    backgroundColor: "#fff",
    paddingHorizontal: hp(2),
    paddingVertical: hp(2),
    borderRadius: 4,
    height: hp(14),
    fontSize: RFValue(12),
  },
  faceText: {
    fontSize: RFValue(8),
    fontFamily: "Poppins",
  },
});

export default BookingFeedback;
