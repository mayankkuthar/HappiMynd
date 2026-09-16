import React, { useState, useEffect, useContext, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { FontAwesome } from "@expo/vector-icons";
import AppIntroSlider from "react-native-app-intro-slider";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Constants
import { colors } from "../../assets/constants";

// Context
import { Hcontext } from "../../context/Hcontext";

// Screen Slides
const slides = [
  {
    key: 1,
    title: "Life gets overwhelming when you don’t understand yourself.",
    text: "Your thoughts, emotions, habits, relationships, and decisions shape how you move through life. This space helps you become more aware, balanced, and in control of your growth journey.",
    image: require("../../assets/images/onboarding_one.png"),
  },
  {
    key: 2,
    title: "A space designed to help you heal, focus and grow.",
    text: "Take guided self-assessments, access expert support, explore growth resources and build better habits through tools designed for real everyday life.",
    image: require("../../assets/images/onboarding_two.png"),
  },
  {
    key: 3,
    title: "Become Aware. Gain\nAcceptance. Take action.",
    text: "Start by understanding yourself better. Get personalized insights, talk to experts when needed, and discover practical steps that help you move forward with more confidence and direction.",
    image: require("../../assets/images/onboarding_three.png"),
  },
  {
    key: 4,
    title: "A safe and trusted space for your journey",
    text: "Join with 2 lakh+ users growing through life with personalised guidance, private support and tools that fit naturally into everyday routines anytime, anywhere.",
    trustTitle: "Small trust points:",
    trustPoints: [
      "100% Confidential",
      "Trusted by leading organisations",
      "Built for every life phase",
    ],
    image: require("../../assets/images/onboarding_four.png"),
  },
];

const OnBoarding = (props) => {
  // Context VAraibles
  const { authDispatch } = useContext(Hcontext);

  // Prop Destructuring
  const { navigation } = props;

  const sliderRef = useRef(null);

  const _renderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        {/* Image Section - fills the entire upper half */}
        <View style={styles.imageSection}>
          <Image
            source={item.image}
            style={styles.slideImage}
            resizeMode="cover"
          />
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.descText}>{item.text}</Text>
          {item.trustPoints ? (
            <View style={styles.trustBlock}>
              <Text style={styles.trustTitle}>{item.trustTitle}</Text>
              {item.trustPoints.map((point, index) => (
                <View key={index} style={styles.trustRow}>
                  <FontAwesome name="check-circle" size={hp(2)} color="green" />
                  <View style={{ width: wp(2) }} />
                  <Text style={styles.text}>{point}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  const _onDone = async () => {
    try {
      // User finished the introduction. Show real app through
      // navigation or simply by controlling state
      authDispatch({ type: "ON_BOARDING_PROCESS" });
      await AsyncStorage.setItem("IS_ONBOARDED", "true");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (err) {
      console.log("Some issue while on-boarding - ", err);
    }
  };

  const _renderPagination = (activeIndex) => {
    const isLast = activeIndex === slides.length - 1;
    return (
      <View style={styles.paginationContainer}>
        <View style={styles.paginationDots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          style={styles.buttonDone}
          onPress={() =>
            isLast
              ? _onDone()
              : sliderRef.current && sliderRef.current.goToSlide(activeIndex + 1, true)
          }
        >
          <Text style={styles.buttonDoneText}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <AppIntroSlider
      ref={sliderRef}
      renderItem={_renderItem}
      data={slides}
      renderPagination={_renderPagination}
      onDone={_onDone}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageSection: {
    height: hp(60),
    width: wp(100),
    overflow: "hidden",
  },
  slideImage: {
    height: hp(60),
    width: wp(100),
  },
  textContainer: {
    backgroundColor: colors.background,
    height: hp(40),
    width: wp(100),
    paddingTop: hp(4),
    paddingHorizontal: hp(3),
  },
  title: {
    fontSize: RFValue(18),
    fontFamily: "PoppinsBold",
    marginBottom: hp(0.6),
    textAlign: "justify",
  },
  trustTitle: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsSemiBold",
    color: colors.borderDark,
    marginBottom: hp(0.8),
  },
  trustBlock: {
    marginTop: hp(0.6),
  },
  trustRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(0.8),
  },
  text: {
    fontSize: RFValue(13),
    fontFamily: "PoppinsMedium",
    color: colors.borderLight,
    textAlign: "justify",
    flex: 1,
  },
  descText: {
    fontSize: RFValue(13),
    fontFamily: "PoppinsMedium",
    color: colors.borderLight,
    textAlign: "justify",
  },
  inactiveDot: {
    backgroundColor: "#D9D9D9",
  },
  activeDot: {
    backgroundColor: "#EDE7FA",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  paginationDots: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDone: {
    backgroundColor: "#E6DFFF",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 100,
    marginBottom: 6,
  },
  buttonDoneText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#31205A",
  },
});

export default OnBoarding;
