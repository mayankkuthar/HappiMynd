import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { FontAwesome } from "@expo/vector-icons";

// COnstatnts
import { Hcontext } from "../../context/Hcontext";
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";
import QueryModal from "../../components/Modals/QueryModal";
import QueryRaisedModal from "../../components/Modals/QueryRaisedModal";

const contactRows = [
  { label: "Offices at:", value: "Gurgaon & London" },
  { label: "Contact no:", value: "9136895581" },
  { label: "Email us at:", value: "contactus@happimynd.com" },
];

const socialLinks = [
  {
    name: "facebook",
    url: "https://www.facebook.com/HappiMynd/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/happi_mynd",
  },
  {
    name: "linkedin",
    url: "https://www.linkedin.com/company/happimynd/",
  },
  {
    name: "youtube-play",
    url: "https://www.youtube.com/channel/UCoc1RbYJwun3umKVOoImswg",
  },
  {
    name: "instagram",
    url: "https://www.instagram.com/happimynd/",
  },
];

const Contact = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { raiseQuery } = useContext(Hcontext);

  // State Variables
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Query Submission Handler
  const queryHandler = async (category, description) => {
    setLoading(true);
    try {
      const queryRes = await raiseQuery({ category, description });
      if (queryRes.status === "success") {
        setShowModal(false);
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.log("Some issue while query submission - ", err);
    }
    setLoading(false);
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../../assets/images/contact_background.png")}
      resizeMode="cover"
    >
      <Header navigation={navigation} showLogo={false} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Brand Section */}
        <View style={styles.brandSection}>
          <Image
            style={styles.contactLogo}
            source={require("../../assets/images/happimynd_logo.png")}
            resizeMode="contain"
          />

          {/* Sized Box */}
          <View style={{ height: hp(1) }} />

          <Image
            style={styles.mascotImage}
            source={require("../../assets/images/Get_in_touch_mascot.png")}
            resizeMode="contain"
          />
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Get In Touch</Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          {contactRows.map((row, index) => (
            <View key={index}>
              <Text style={styles.contactDescription}>
                <Text style={styles.contactDescriptionTitle}>
                  {row.label}{" "}
                </Text>
                {row.value}
              </Text>
              {/* Sized Box */}
              <View style={{ height: hp(1) }} />
            </View>
          ))}

          {/* Sized Box */}
          <View style={{ height: hp(2.5) }} />

          {/* Social Links */}
          <View style={styles.socialRow}>
            {socialLinks.map((social, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => Linking.openURL(social.url)}
                style={styles.socialButton}
              >
                <FontAwesome
                  name={social.name}
                  size={hp(3.2)}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* CTA Section */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowModal(true)}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaButtonText}>Raise Query</Text>
        </TouchableOpacity>
      </View>

      {showModal && (
        <QueryModal
          showModal={showModal}
          setShowModal={setShowModal}
          pressHandler={queryHandler}
          loading={loading}
        />
      )}

      {showSuccessModal && (
        <QueryRaisedModal
          showModal={showSuccessModal}
          setShowModal={setShowSuccessModal}
        />
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  brandSection: {
    alignItems: "center",
    marginTop: hp(3),
  },
  contactLogo: {
    width: wp(30),
    height: hp(12),
  },
  mascotImage: {
    width: wp(40),
    height: hp(20),
  },
  contactSection: {
    alignItems: "flex-start",
    marginTop: hp(3),
    paddingHorizontal: wp(6),
  },
  contactTitle: {
    fontSize: RFValue(26),
    fontFamily: "PoppinsBold",
    color: "#111111",
  },
  contactDescriptionTitle: {
    fontSize: RFValue(13),
    fontFamily: "PoppinsSemiBold",
    color: "#111111",
  },
  contactDescription: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    color: "#606060",
  },
  socialRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  socialButton: {
    backgroundColor: "#8B5CF6",
    width: wp(12),
    height: wp(12),
    borderRadius: hp(1),
    alignItems: "center",
    justifyContent: "center",
  },
  ctaContainer: {
    position: "absolute",
    bottom: hp(4.1),
    left: 0,
    right: 0,
    paddingHorizontal: wp(3.8),
  },
  ctaButton: {
    backgroundColor: "#E6DFFF",
    height: hp(4.7),
    borderRadius: hp(2.15),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8E66F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  ctaButtonText: {
    fontSize: RFValue(13),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
  },
});

export default Contact;