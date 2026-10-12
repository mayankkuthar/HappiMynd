import React from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialIcons } from "@expo/vector-icons";

const benefits = [
  "Just 20 Minutes",
  "Anonymous & Confidential",
  "Guiding Post",
];

const BenefitItem = ({ label }) => (
  <View style={styles.benefitItem}>
    <View style={styles.checkbox}>
      <MaterialIcons name="check" size={13} color="#FFFFFF" />
    </View>
    <Text style={styles.benefitText}>{label}</Text>
  </View>
);

const OfferUpdates = (props) => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/happimynd_logo.png")}
        resizeMode="contain"
        style={styles.logo}
      />

      {/* Title */}
      <Text style={styles.title}>Offers and rewards</Text>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Offer Illustration */}
        <Image
          source={require("../../assets/images/offers_hero.png")}
          resizeMode="contain"
          style={styles.heroImage}
        />

        {/* Content */}
        <Text style={styles.sectionHeading}>Built For Today's Generation</Text>

        <Text style={styles.sectionHeading}>Introducing SOLV</Text>
        <Text style={styles.paragraph}>
          Sometimes all it takes is one meaningful conversation to see things
          clearly.
        </Text>
        <View style={{ height: 16 }} />
        <Text style={styles.paragraph}>
          SOLV connects you with trusted experts for secured, one-on-one
          conversations that help you navigate life decisions, transitions and
          changes with clarity.
        </Text>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          {benefits.map((item) => (
            <BenefitItem key={item} label={item} />
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>AWARENESS • ACCEPTANCE • ACTION</Text>

        {/* Sized Box */}
        <View style={{ height: hp(10) }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FF",
    paddingTop: hp(7),
  },
  logo: {
    height: hp(9),
    width: wp(26),
    alignSelf: "center",
  },
  title: {
    fontSize: RFValue(22),
    fontFamily: "PoppinsSemiBold",
    fontWeight: "600",
    color: "#9747FF",
    textAlign: "center",
    marginTop: hp(1),
  },
  scrollContent: {
    paddingHorizontal: wp(6),
    paddingTop: hp(2),
  },
  heroImage: {
    width: wp(62),
    height: hp(20),
    alignSelf: "center",
  },
  sectionHeading: {
    fontSize: RFValue(18),
    fontFamily: "PoppinsSemiBold",
    color: "#111111",
    textAlign: "left",
    marginTop: hp(2),
    marginBottom: hp(0.5),
  },
  paragraph: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    color: "#606060",
    lineHeight: RFValue(21),
    textAlign: "left",
  },
  benefitsSection: {
    marginTop: hp(3),
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#9747FF",
    alignItems: "center",
    justifyContent: "center",
  },
  benefitText: {
    fontSize: RFValue(14),
    fontFamily: "Poppins",
    color: "#111111",
    marginLeft: 12,
  },
  footer: {
    fontSize: RFValue(13),
    fontFamily: "PoppinsMedium",
    color: "#111111",
    textAlign: "left",
    marginTop: hp(1),
  },
});

export default OfferUpdates;