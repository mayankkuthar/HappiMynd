import React from "react";
import {
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const WaveButton = (props) => {
  // Prop Destructuring
  const { width = 78, height = 12, text = "Wave", pressHandler } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.buttonContainer}
      onPress={pressHandler}
    >
      <ImageBackground
        source={require("../../assets/images/button_wave_background.png")}
        style={{
          width: wp(width),
          height: hp(height),
          paddingHorizontal: hp(4),
          paddingVertical: hp(3),
        }}
        resizeMode="cover"
      >
        <Text style={styles.buttonText}>{text}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 10,
    height: "auto",
    // backgroundColor: "red",
  },
  buttonText: {
    fontSize: RFValue(13),
    fontFamily: "PoppinsMedium",
  },
});

export default WaveButton;
