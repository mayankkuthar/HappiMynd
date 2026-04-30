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
import { colors } from "../../assets/constants";
import ComingSoon from "../../components/Modals/ComingSoon";

// Components
import ConfidentialModal from "../../components/Modals/ConfidentialModal";

const bulletPoints = [
  {
    id: 0,
    text: "Get your screening summary thoroughly explained and interpreted by our professional expert.",
  },
  {
    id: 1,
    text: "A deeper understanding on the different facets of your personality lets you discover strengths and weaknesses while helping you identify areas of management and improvement.",
  },
  {
    id: 2,
    text: "Get one step closer to knowing yourself and keeping a check on your mental and emotional wellbeing to achieve happiness and a truly enhanced quality of life.",
  },
];

const ReportReadingBook = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // State Variables
  const [showConfidentialModal, setShowConfidentialModal] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      style={styles.container}
    >
      <Header showLogo={false} showBack={true} navigation={navigation} />

      <ConfidentialModal
        showModal={showConfidentialModal}
        setShowModal={setShowConfidentialModal}
        pressHandler={() => {
          setShowConfidentialModal(false);
          navigation.push("MakeBooking", {
            type: "add",
            psyId: "",
            planId: "",
            amount: "",
            session: "",
          });
        }}
      />

      <ComingSoon showModal={showComingSoon} setShowModal={setShowComingSoon} />

      <ScrollView style={{ paddingHorizontal: wp(10) }}>
        <Text style={styles.pageTitle}>HappiGUIDE</Text>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        <View style={styles.reportContainer}>
          <Image
            source={require("../../assets/images/report_hero.png")}
            style={styles.reportHero}
            resizeMode="contain"
          />

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <View>
            <Text style={styles.reportTitle}>
              Screening Summary Reading by Emotional Wellbeing Expert.
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
                console.log("chec kyh the suvsc", props);
                if (!props?.route?.params?.isSubscribed) {
                  setShowComingSoon(true);
                } else {
                  setShowConfidentialModal(true);
                }
              }}
              style={styles.connectButton}
            >
              <Text style={styles.connectText}>Book Now</Text>
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
  reportHero: {
    // backgroundColor: "red",
    width: hp(30),
    height: hp(30),
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

export default ReportReadingBook;
