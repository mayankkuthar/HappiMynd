import React from "react";
import { StyleSheet, Text, View, ImageBackground, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import WaveButton from "../../components/buttons/WaveButton";

// Constants
import { colors } from "../../assets/constants";
import { heightPercentageToDP } from "react-native-responsive-screen";

const GettingStarted = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  return (
    <View style={styles.container}>
      {/* Section 1 */}
      <ImageBackground
        source={require("../../assets/images/getting_started_background.png")}
        style={styles.upperSection}
        resizeMode="cover"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/happimynd_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.heroContainer}>
          <Image
            source={require("../../assets/images/getting_started_girl.png")}
            style={styles.upperSectionHero}
            resizeMode="contain"
          />
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />
      </ImageBackground>
      {/* Section 2 */}
      <View style={styles.lowerSection}>
        <View style={styles.lowerSectionTextContainer}>
          <Text style={styles.lowerSectionTitle}>Getting started</Text>
          <Text style={styles.lowerSectionSubTitle}>
            Please select your Account type
          </Text>
        </View>
        <View style={styles.lowerSectionButtonContainer}>
          <WaveButton
            width={78}
            height={12}
            text="Organisation/Institution Sponsored"
            pressHandler={() => navigation.push("RegisterWithCode")}
          />
          <WaveButton
            width={78}
            height={12}
            text="Self Sponsored"
            pressHandler={() => navigation.push("Register")}
          />
        </View>
      </View>

      {/* Cloud Image */}
      <Image
        source={require("../../assets/images/cloud1.png")}
        style={styles.cloudOne}
        resizeMode="contain"
      />
      {/* Cloud Image */}
      <Image
        source={require("../../assets/images/cloud1.png")}
        style={styles.cloudTwo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  upperSection: {
    height: hp(50),
    width: wp(100),
    justifyContent: "space-between",
  },
  upperSectionHero: {
    height: hp(22),
    width: wp(100),
    // backgroundColor: "red",
  },
  logoContainer: {
    // backgroundColor: "yellow",
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: hp(8),
  },
  logo: {
    // backgroundColor: "green",
    height: hp(8),
    width: wp(30),
  },
  lowerSection: {
    // backgroundColor: "yellow",
    height: hp(50),
    width: wp(100),
    alignItems: "center",
  },
  lowerSectionTitle: {
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(20),
  },
  lowerSectionSubTitle: {
    fontFamily: "Poppins",
    fontSize: RFValue(14),
  },
  lowerSectionTextContainer: {
    // backgroundColor: "red",
    height: hp(15),
    alignItems: "center",
    justifyContent: "center",
  },
  lowerSectionButtonContainer: {
    // backgroundColor: "blue",
    height: hp(25),
    alignItems: "center",
    justifyContent: "center",
  },
  cloudOne: {
    // backgroundColor: "red",
    width: wp(40),
    height: hp(10),
    position: "absolute",
    top: hp(14),
    right: 0,
  },
  cloudTwo: {
    // backgroundColor: "red",
    width: wp(40),
    height: hp(10),
    position: "absolute",
    top: hp(22),
    left: -wp(20),
  },
});

export default GettingStarted;
