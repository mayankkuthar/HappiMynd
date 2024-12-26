import React from "react";
import { StyleSheet, Text, View, Image, ImageBackground } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// Constants
import { colors } from "../../assets/constants";

const AnimatedSplash = (props) => {
  // Prop Destructuring
  const {} = props;
  return (
    <ImageBackground
      style={styles.container}
      //   source={require("../../assets/images/splash-back.png")}
    >
      <Image
        source={require("../../assets/images/HappiMynd-Spalsh.gif")}
        style={styles.splashGif}
        resizeMode="contain"
      />
    </ImageBackground>
  );
};

export default AnimatedSplash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  splashGif: {
    width: wp(100),
    height: hp(100),
  },
});
