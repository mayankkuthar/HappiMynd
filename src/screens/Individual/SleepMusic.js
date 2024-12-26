import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";
import CourseCard from "../../components/cards/CourseCard";

const SleepMusic = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <Header showLogo={false} showBack={true} navigation={navigation} />

      {/* Body Section */}
      <ScrollView style={{ paddingHorizontal: wp(10) }}>
        <Text style={styles.pageTitle}>Sleep Music</Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />
        <CourseCard
          type="video"
          title="Audio"
          pressHandler={() => navigation.push("TimerScreen")}
        />
        {/* Sized Box */}
        <View style={{ height: hp(2) }} />
        <CourseCard
          type="video"
          title="Video"
          pressHandler={() => navigation.push("TimerScreen")}
        />
        {/* Sized Box */}
        <View style={{ height: hp(2) }} />
        <CourseCard
          type="video"
          title="Audio"
          pressHandler={() => navigation.push("TimerScreen")}
        />
        {/* Sized Box */}
        <View style={{ height: hp(2) }} />
        <CourseCard
          type="video"
          title="Audio"
          pressHandler={() => navigation.push("TimerScreen")}
        />
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pageTitle: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
});

export default SleepMusic;
