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
import { Svg, Path } from "react-native-svg";
import { colors } from "../../assets/constants";

const DownloadIcon = ({ size = hp(3), color = "#111111" }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 12L3 7L4.4 5.55L7 8.15V0H9V8.15L11.6 5.55L13 7L8 12ZM2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V11H2V14H14V11H16V14C16 14.55 15.8042 15.0208 15.4125 15.4125C15.0208 15.8042 14.55 16 14 16H2Z"
      fill={color}
    />
  </Svg>
);

const WaveIconButton = (props) => {
  // Prop Destructuring
  const {
    text = "Wave Icon Button",
    subText = "Wave Icon Button Sub-Text",
    icon = require("../../assets/images/waveicon_progress.png"),
    width = 40,
    height = 18,
    isSubscribed = false,
    downloadBadge = false,
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
              <View style={styles.iconCircle}>
                {downloadBadge ? (
                  <DownloadIcon size={hp(1.6)} color="#111111" />
                ) : (
                  <Image
                    source={icon}
                    style={styles.waveIcon}
                    resizeMode="contain"
                  />
                )}
              </View>
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
    shadowColor: colors.pageTitle,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: "transparent",
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
    width: hp(3),
    height: hp(3),
  },
  iconCircle: {
    width: hp(3.8),
    height: hp(3.8),
    borderRadius: hp(1.9),
    backgroundColor: "#DCBEFF",
    borderWidth: 1.5,
    borderColor: "#A38AF2",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
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