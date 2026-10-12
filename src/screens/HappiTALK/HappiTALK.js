import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Context
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
import Button from "../../components/buttons/Button";
import ComingSoon from "../../components/Modals/ComingSoon";

const HappiTALK = (props) => {
  // Prop destructuring
  const { navigation } = props;

  // Context Varibales
  const { authState, getSubscriptions, getUserProfile } = useContext(Hcontext);

  // STate variables
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  // Mounting
  useEffect(() => {
    checkSubscription();
    fetchUserProfile(authState?.user?.access_token);
  }, []);

  const checkSubscription = async () => {
    setLoading(true);
    try {
      const mySub = await getSubscriptions();

      console.log("CHeck teh subs - ", mySub);

      if (mySub.status === "success") {
        const isSub = mySub.data.find((sub) => sub.name === "HappiTALK");
        if (isSub) console.log("User is subscribed to HappiTALK");
      }
    } catch (err) {
      console.log("Some issue while checking subscription - ", err);
    }
    setLoading(false);
  };

  const fetchUserProfile = async (token) => {
    try {
      setLoadingButton(true);
      const userProfile = await getUserProfile({ token });

      console.log("checking in the user profile - ", userProfile);

      if (userProfile.status === "success") {
        if (userProfile.data.verify_user) {
          if (userProfile.data.verify_user.email_verify) {
            setIsEmailVerified(true);
          }
          if (userProfile.data.verify_user.mobile_verify) {
            setIsPhoneVerified(true);
          }
        }
      }
      setLoadingButton(false);
    } catch (err) {
      setLoadingButton(false);
      console.log("Some issue while fetching user profile - ", err);
    }
  };

  const navigateToExperts = () => {
    if (authState.user) {
      console.log("isEmailVerified", isEmailVerified);
      console.log("isPhoneVerified", isPhoneVerified);
      navigation.push("HappiTALKBook");
    } else {
      navigation.push("WelcomeScreen");
    }
  };

  return (
    <View style={styles.container}>
      <Header showBack={true} showLogo={false} navigation={navigation} />

      <ScrollView style={{ paddingHorizontal: wp(10) }}>
        {/* Sized Box */}
        <View style={{ height: hp(3) }} />

        <View>
          <Text style={styles.title}>HappiTALK</Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Text style={styles.subTitle}>
            Sometimes a conversation changes everything
          </Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Image
            source={require("../../assets/images/happiTALK.png")}
            resizeMode="contain"
            style={styles.banner}
          />

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <View style={styles.detailSection}>
            <Text style={styles.detail}>
              Are you feeling stuck, confused, overwhelmed, or simply looking
              for direction? HappiTalk connects you with experienced experts for
              therapeutic one-on-one conversations that help you overcome
              difficult situations with confidence.
            </Text>

            {/* Sized Box */}
            <View style={styles.paragraphGap} />

            <Text style={styles.detail}>
              Talk now and move forward with stronger self-awareness and
              practical guidance for everyday life.
            </Text>
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Button
            text="Talk with Experts"
            loading={loadingButton}
            containerStyle={styles.expertsButton}
            textStyle={styles.expertsButtonText}
            pressHandler={navigateToExperts}
          />
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />
      </ScrollView>
      <ComingSoon showModal={showModal} setShowModal={setShowModal} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F7FF",
    flex: 1,
  },
  title: {
    fontSize: RFValue(22),
    fontFamily: "PoppinsSemiBold",
    fontWeight: "400",
    color: "#9747FF",
    textAlign: "left",
  },
  subTitle: {
    fontSize: RFValue(18),
    fontFamily: "PoppinsMedium",
    fontWeight: "400",
    color: "#111111",
    textAlign: "left",
  },
  banner: {
    alignSelf: "center",
    width: wp(80),
    height: hp(28),
  },
  detailSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 25,
  },
  detail: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    color: "#646268",
    textAlign: "left",
    lineHeight: hp(3),
  },
  paragraphGap: {
    height: 22,
  },
  expertsButton: {
    backgroundColor: "#E6DEFF",
    borderRadius: 999,
    marginHorizontal: 16,
    marginBottom: 30,
    shadowColor: "#BDB5CE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  expertsButtonText: {
    color: "#191719",
  },
});

export default HappiTALK;