import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { colors } from "../../assets/constants";

const WaveIconButton = (props) => {
  // Prop Destructuring
  const {
    text = "Wave Icon Button",
    subText = "Wave Icon Button Sub-Text",
    icon = require("../../assets/images/waveicon_progress.png"),
    width = 40,
    height = 18,
    isSubscribed = false,
    pressHandler = () => {},
  } = props;

  return (
    <View style={[styles.glowContainer, isSubscribed && styles.subscribed]}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.buttonContainer}
        onPress={pressHandler}
      >
        <ImageBackground
          source={require("../../assets/images/wave_icon_button.png")}
          style={{
            width: wp(width),
            height: hp(height),
          }}
          resizeMode="cover"
        >
          <View style={{ flex: 1 }}>
            {/* Icon Section */}
            <View style={styles.iconSection}>
              <Image source={icon} style={styles.waveIcon} resizeMode="contain" />
            </View>
            {/* Text Section */}
            <View style={styles.textSection}>
              {/* Sized Box */}
              <View style={{ height: hp(0.5) }} />
              <Text style={styles.buttonText}>{text}</Text>
              <Text style={styles.buttonSubText}>{subText}</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  glowContainer: {
    borderRadius: 10,
    padding: 2, // Space for the glow effect
  },
  subscribed: {
    borderRadius: 10,
    shadowColor: "#00e6b8",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8, // For Android
    backgroundColor: "#00e6b8",
  },
  buttonContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
  iconSection: {
    flex: 1,
    paddingLeft: wp(5),
    justifyContent: "center",
  },
  textSection: {
    flex: 1,
    paddingLeft: wp(4),
  },
  waveIcon: {
    width: hp(5),
    height: hp(5),
  },
  buttonText: {
    fontSize: RFValue(11),
    fontFamily: "PoppinsMedium",
  },
  buttonSubText: {
    fontSize: RFValue(11),
    fontFamily: "PoppinsMedium",
  },
});

export default WaveIconButton;