import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import Header from "../../components/common/Header";
import ComingSoon from "../../components/Modals/ComingSoon";

// Constants
import { colors } from "../../assets/constants";

const bulletPoints = [
  {
    id: 0,
    text: "A globally validated, interactive self-help app that enables you to incorporate emotional well-being habits into your daily schedule.",
  },
  {
    id: 1,
    text: "Engage yourself in a self - reflection journey,  mind-soothing content, socialising activities, and gamified exercises or set daily goals to build emotional resilience through positive and constructive changes.",
  },
  {
    id: 2,
    text: "This program is embedded in the most powerful technique of Cognitive Behaviour Therapy, which has a similar therapeutic impact as personal interaction.",
  },
];

const HappiSELFBook = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // State Variables
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      style={styles.container}
    >
      <Header showLogo={false} showBack={true} navigation={navigation} />

      {showComingSoon ? (
        <ComingSoon
          showModal={showComingSoon}
          setShowModal={setShowComingSoon}
        />
      ) : null}

      <ScrollView style={{ paddingHorizontal: wp(10) }}>
        <Text style={styles.pageTitle}>HappiSELF</Text>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        <View style={styles.reportContainer}>
          <Image
            // source={require("../../assets/images/self_book.png")}
            source={require("../../assets/images/happiAPP.png")}
            style={styles.selfHero}
            resizeMode="contain"
          />

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <View>
            <Text style={styles.reportTitle}>
              Tune up your emotions anytime anywhere
            </Text>
            {/* Sized Box */}
            <View style={{ height: hp(2) }} />
            {bulletPoints.map((point) => (
              <>
                <View style={{ flexDirection: "row" }} key={point.id}>
                  <View style={styles.bulletPoint} />
                  {/* Sized Box */}
                  <View style={{ width: hp(1) }} />
                  <Text style={styles.pointText}>{point.text}</Text>
                </View>
                {/* Sized Box */}
                <View style={{ height: hp(2) }} />
              </>
            ))}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (!props?.route?.params?.isSubscribed) {
                  setShowComingSoon(true);
                } else {
                  navigation.push("HappiSELFTab");
                }
              }}
              style={styles.connectButton}
            >
              <Text style={styles.connectText}>Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Sized Box */}
        <View style={{ height: hp(4) }} />
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  pageTitle: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  selfHero: {
    // backgroundColor: "red",
    width: wp(65),
    height: hp(24),
  },
  reportContainer: {
    backgroundColor: "#C2F3F1",
    width: wp(80),
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: hp(2),
    paddingVertical: hp(2),
  },
  reportTitle: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsMedium",
  },
  bulletPoint: {
    backgroundColor: colors.pageTitle,
    width: hp(1),
    height: hp(1),
    borderRadius: hp(100),
    marginTop: hp(0.4),
  },
  pointText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    width: wp(65),
  },
  connectButton: {
    backgroundColor: "#fff",
    borderRadius: hp(100),
    paddingVertical: hp(1.5),
    // width: "100%",
    width: wp(70),
  },
  connectText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: colors.pageTitle,
    textAlign: "center",
  },
});

export default HappiSELFBook;
