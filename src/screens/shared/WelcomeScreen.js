import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import WaveButton from "../../components/buttons/WaveButton";
import { colors } from "../../assets/constants";

const WelcomeScreen = (props) => {
  // Prop Destructurig
  const { navigation } = props;
  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      style={styles.backgroundContainer}
    >
      <Image
        source={require("../../assets/images/welcome_group.png")}
        style={styles.welcomeGroupImage}
      />
      <ScrollView style={{ paddingTop: hp(20) }}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/images/happimynd_logo.png")}
            style={{ width: hp(24), height: hp(12) }}
            resizeMode="contain"
          />

          {/* Vertical Spacing */}
          <View style={{ height: hp(4) }} />

          <Text style={styles.welcomeText}>Welcome to HappiMynd</Text>

          {/* Vertical Spacing */}
          <View style={{ height: hp(4) }} />

          <WaveButton
            width={78}
            height={12}
            text="Already Registered"
            // text="Sponsored/Referred user"
            pressHandler={() => navigation.push("Login")}
          />
          <WaveButton
            width={78}
            height={12}
            text="Registering First Time"
            pressHandler={() => navigation.push("GettingStarted")}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    backgroundColor: colors.background,
    width: wp(100),
    height: hp(100),
    // paddingHorizontal: wp(10),
    alignItems: "center",
  },
  welcomeText: {
    fontSize: RFValue(20),
    fontFamily: "PoppinsSemiBold",
    color: "#000",
  },
  welcomeGroupImage: {
    // backgroundColor: "red",
    height: hp(26),
    width: wp(100),
    resizeMode: "contain",
    position: "absolute",
    bottom: 0,
  },
});

export default WelcomeScreen;
