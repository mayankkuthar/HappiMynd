import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Header from "../../components/common/Header";

// Constants
import { colors } from "../../assets/constants";

// Components
import WaveButton from "../../components/buttons/WaveButton";
import ConfidentialModal from "../../components/Modals/ConfidentialModal";
import LanguageModal from "../../components/Modals/LanguageModal";
import ComingSoon from "../../components/Modals/ComingSoon";

const bulletPoints = [
  {
    id: 0,
    text: "Discuss life, ambitions, personal issues, relationships, success, failures, or anything under the sun with a highly qualified and experienced therapist.",
  },
  {
    id: 1,
    text: "A 100% confidential, cost-effective, reliable, efficient, and digital platform for one-to-one therapeutic counselling aimed at ensuring peace of mind, building life direction, and supporting your journey towards emotional, mental and overall wellness.",
  },
  {
    id: 2,
    text: "Get access to the best experts in the country, chosen after rigorous screening and multiple levels of interviews, from the comfort and privacy of your home.",
  },
];

const HappiTALKBook = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // State Variables
  const [showConfidentialModal, setShowConfidentialModal] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <Header showLogo={false} showBack={true} navigation={navigation} />

      {showComingSoon ? (
        <ComingSoon
          showModal={showComingSoon}
          setShowModal={setShowComingSoon}
        />
      ) : null}

      <ConfidentialModal
        showModal={showConfidentialModal}
        setShowModal={setShowConfidentialModal}
        pressHandler={() => {
          setShowConfidentialModal(false);
          navigation.push("BookingList");
        }}
      />

      {/* Body Section */}
      <ScrollView style={{ paddingHorizontal: wp(10) }}>
        <Text style={styles.pageTitle}>HappiTALK</Text>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        <View style={styles.heroContainer}>
          {/* Sized Box */}
          <View style={{ height: hp(2) }} />
          <Image
            // source={require("../../assets/images/happiTALK_hero.png")}
            source={require("../../assets/images/happiTALK.png")}
            resizeMode="contain"
            style={styles.heroImage}
          />
          {/* Sized Box */}
          <View style={{ height: hp(2) }} />
          <View style={styles.heroContentContainer}>
            <Text
              style={{ fontSize: RFValue(16), fontFamily: "PoppinsMedium" }}
            >
              Guidance of an Expert but touch of a Friend
            </Text>
            {/* <Text
              style={{ fontSize: RFValue(20), fontFamily: "PoppinsSemiBold" }}
            >
              Counselling
            </Text> */}

            {/* Sized Box */}
            <View style={{ height: hp(2) }} />

            <View>
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
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              // onPress={() => navigation.push("VideoCall")}
              onPress={() => navigation.push("BookingList")}
              // onPress={() => {
              //   if (!props?.route?.params?.isSubscribed) {
              //     setShowComingSoon(true);
              //   } else {
              //     setShowConfidentialModal(true);
              //   }
              // }}
              style={styles.connectButton}
            >
              <Text style={styles.connectText}>Book Now</Text>
            </TouchableOpacity>
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <Text style={styles.choiceText}>View Your Bookings</Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <WaveButton
            text="Manage Bookings"
            width={38}
            pressHandler={() => navigation.push("ManageBookings")}
          />
          <WaveButton
            text="Session Balance"
            width={38}
            pressHandler={() => navigation.push("Credits")}
          />
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
  heroContainer: {
    backgroundColor: "#C2F3F1",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: colors.borderLight,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: hp(0.5),
    elevation: 5,
  },
  heroImage: {
    // backgroundColor: "green",
    width: hp(30),
    height: hp(30),
  },
  heroContentContainer: {
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: hp(2),
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
    width: "100%",
  },
  connectText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: colors.pageTitle,
    textAlign: "center",
  },
  choiceText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: colors.borderLight,
    textAlign: "center",
  },
});

export default HappiTALKBook;
