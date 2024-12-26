import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { FontAwesome } from "@expo/vector-icons";

// Constants
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";

const TimerScreen = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <Header showLogo={false} showBack={true} navigation={navigation} />

      <View style={styles.timerContainer}>
        <ImageBackground
          source={require("../../assets/images/timer_background.png")}
          resizeMode="contain"
          style={styles.timerBox}
        >
          <Text style={styles.timerText}>1:45</Text>
        </ImageBackground>
      </View>

      {/* SIzed Box */}
      <View style={{ height: hp(16) }} />

      <View style={styles.playButtonContaier}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
          <FontAwesome name="play-circle" size={hp(8)} color="#58C4CB" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  timerContainer: {
    // backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
  },
  timerBox: {
    // backgroundColor: "red",
    width: hp(30),
    height: hp(30),
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: RFValue(38),
    fontFamily: "PoppinsBold",
  },
  playButtonContaier: {
    // backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TimerScreen;
