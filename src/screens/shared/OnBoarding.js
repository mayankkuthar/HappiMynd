import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, ImageBackground, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
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
    title: "Emotional Regulation for healthy life",
    text: "Emotional wellbeing is an integral part of your overall wellbeing and plays a vital role in 6 spheres of human life. Understanding its impact and managing a balance is key.",
    background: require("../../assets/images/onboarding1_rectangle.png"),
    mask: require("../../assets/images/onboarding1_rectangle_mask.png"),
    person: require("../../assets/images/onboarding_one.png"),
    backgroundColor: colors.background,
  },
  {
    key: 2,
    title: "Prevention is better than Cure",
    text: "We believe in preventing emotional & mental concerns building up at various stages of life, by providing globally validated self care & self management tools with personalised assistance.",
    background: require("../../assets/images/onboarding2_rectangle.png"),
    mask: require("../../assets/images/onboarding2_rectangle_mask.png"),
    person: require("../../assets/images/onboarding_two.png"),
    backgroundColor: colors.background,
  },
  {
    key: 3,
    title: "Customised & Confidential  support ",
    text: "We offer Accessible, Affordable & Reliable support for all age groups in any situation of life. At every step you get solutions that are made just for you.",
    background: require("../../assets/images/onboarding3_rectangle.png"),
    mask: require("../../assets/images/onboarding3_rectangle_mask.png"),
    person: require("../../assets/images/onboarding_three.png"),
    backgroundColor: colors.background,
  },
];

const OnBoarding = (props) => {
  // Context VAraibles
  const { authDispatch } = useContext(Hcontext);

  // Prop Destructuring
  const { navigation } = props;

  const _renderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        {/* Background Image Section */}
        <View style={styles.backgroundContainer}>
          <ImageBackground
            source={item.mask}
            style={{
              ...styles.backgroundMask,
              justifyContent: item.key == 1 ? "center" : "flex-end",
            }}
          >
            <Image
              source={require("../../assets/images/happimynd_logo.png")}
              resizeMode="contain"
              style={styles.pageLogo}
            />
            {item.key === 1 ? <View style={{ height: hp(10) }} /> : null}
            <Image
              source={item.person}
              style={{
                ...styles.backgroundPerson,
                height:
                  item.key === 1 ? hp(50) : item.key === 2 ? hp(40) : hp(50),
              }}
              resizeMode="cover"
            />
          </ImageBackground>
        </View>
        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const _renderDoneButton = () => {
    return (
      <View style={styles.buttonDone}>
        <Text style={styles.buttonDoneText}>Next</Text>
      </View>
    );
  };

  const _onDone = async () => {
    try {
      // User finished the introduction. Show real app through
      // navigation or simply by controlling state
      authDispatch({ type: "ON_BOARDING_PROCESS" });
      await AsyncStorage.setItem("IS_ONBOARDED", "true");
      navigation.push("OfferUpdates");
      // navigation.push("WelcomeScreen");
      // navigation.push("Home");
    } catch (err) {
      console.log("Some issue while on-boarding - ", err);
    }
  };

  return (
    <AppIntroSlider
      renderItem={_renderItem}
      data={slides}
      renderDoneButton={_renderDoneButton}
      renderNextButton={_renderDoneButton}
      onDone={_onDone}
      dotStyle={styles.inactiveDot}
      activeDotStyle={styles.activeDot}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    height: hp(60),
    width: wp(100),
    backgroundColor: "#ACE9E6",
  },
  backgroundMask: {
    // backgroundColor: "red",
    height: hp(60),
    width: wp(100),
    alignItems: "center",
    justifyContent: "flex-end",
  },
  pageLogo: {
    // backgroundColor: "red",
    position: "absolute",
    top: hp(8),
    width: wp(30),
    height: hp(6),
  },
  backgroundPerson: {
    // backgroundColor: "green",
    height: hp(40),
    width: wp(90),
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
    fontFamily: "PoppinsSemiBold",
    marginBottom: hp(2),
  },
  text: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsMedium",
    color: colors.borderLight,
  },
  inactiveDot: {
    backgroundColor: "#D9D9D9",
  },
  activeDot: {
    backgroundColor: "#59C5CC",
  },
  buttonDone: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 100,
  },
  buttonDoneText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
});

export default OnBoarding;
