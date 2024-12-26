import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// COnstatnts
import { Hcontext } from "../../context/Hcontext";
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";
import SocialMedia from "../../components/common/SocialMedia";
import OutlineButton from "../../components/buttons/OutineButton";
import QueryModal from "../../components/Modals/QueryModal";

const Contact = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { raiseQuery, snackDispatch } = useContext(Hcontext);

  // State Variables
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Query Submission Handler
  const queryHandler = async (category, description) => {
    setLoading(true);
    try {
      const queryRes = await raiseQuery({ category, description });
      console.log("CHekc submision handler - ", queryRes);
      if (queryRes.status === "success") {
        snackDispatch({ type: "SHOW_SNACK", payload: queryRes.message });
        setShowModal(false);
      }
    } catch (err) {
      console.log("Some issuw while query submission - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.contactBackground}
        source={require("../../assets/images/contact_background.png")}
        resizeMode="cover"
      >
        <Header navigation={navigation} showLogo={false} />

        {/* Main Section */}
        <View style={styles.mainSection}>
          {/* Sized Box */}
          <View style={{ height: hp(8) }} />

          <Image
            style={styles.contactLogo}
            source={require("../../assets/images/happimynd_logo.png")}
            resizeMode="contain"
          />
          <Text style={styles.contactTitle}>Get in Touch</Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Text style={styles.contactDescription}>
            <Text style={styles.contactDescriptionTitle}>Headquarter in: </Text>
            Gurgaon, India
          </Text>
          {/* Sized Box */}
          <View style={{ height: hp(1) }} />
          <Text style={styles.contactDescription}>
            <Text style={styles.contactDescriptionTitle}>Contact No: </Text>
            +91-9110599581
          </Text>
          {/* Sized Box */}
          <View style={{ height: hp(1) }} />
          <Text style={styles.contactDescription}>
            <Text style={styles.contactDescriptionTitle}>Email us at: </Text>
            support@happimynd.com
          </Text>

          {/* Sized Box */}
          <View style={{ height: hp(2.5) }} />

          {/* Social Links */}
          <SocialMedia />
        </View>
        <View style={{ bottom: hp(10), paddingHorizontal: wp(10) }}>
          <OutlineButton
            text="Raise Query"
            pressHandler={() => setShowModal(true)}
          />
        </View>

        {showModal && (
          <QueryModal
            showModal={showModal}
            setShowModal={setShowModal}
            pressHandler={queryHandler}
            loading={loading}
          />
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  contactBackground: {
    width: wp(100),
    height: hp(100),
  },
  mainSection: {
    // backgroundColor: "yellow",
    flex: 1,
    paddingHorizontal: hp(8),
  },
  contactLogo: {
    // backgroundColor: "red",
    width: wp(45),
    height: hp(25),
  },
  contactTitle: {
    fontSize: RFValue(26),
    fontFamily: "PoppinsBold",
  },
  contactDescriptionTitle: {
    fontSize: RFValue(13),
    fontFamily: "PoppinsSemiBold",
  },
  contactDescription: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
  },
});

export default Contact;
