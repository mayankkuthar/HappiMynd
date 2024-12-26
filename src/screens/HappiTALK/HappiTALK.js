import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";
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
  const [isSubscribed, setIsSubscribed] = useState(false);
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
        if (isSub) setIsSubscribed(true);
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

  return (
    <View style={styles.container}>
      <Header showBack={true} navigation={navigation} />

      <ScrollView style={{ paddingHorizontal: wp(10) }}>
        {/* Sized Box */}
        <View style={{ height: hp(3) }} />

        <View>
          <Text style={styles.title}>HappiTALK</Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Text style={styles.subTitle}>
            Guidance of an Expert but touch of a Friend
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
              Discuss your life, ambitions, personal issues, relationships,
              success, failures, or anything under the sun with a highly
              qualified and experienced therapist. It is a fully confidential,
              reliable, and cost-effective way to avail one-to-one expert advice
              and guidance from the comfort of your home via our digital
              platform. Our therapists are among the best in the country, chosen
              after rigorous screening and multiple levels of interviews. We
              strive to provide you with the best therapeutic counselling
              experience that is aimed at ensuring peace of mind, building life
              direction, and supporting your journey towards emotional, mental,
              and overall wellness.
            </Text>
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Button
            text="Talk with Experts"
            loading={loadingButton}
            pressHandler={() => {
              if (authState.user) {
                // navigation.push("HappiTALKBook");

                console.log("isEmailVerified", isEmailVerified);
                console.log("isPhoneVerified", isPhoneVerified);
                if (isEmailVerified && isPhoneVerified) {
                  navigation.push("HappiTALKBook");
                } else {
                  navigation.navigate("ContactVerification", {
                    isFrom: "Talk",
                  });
                }
              } else {
                navigation.push("WelcomeScreen");
              }
            }}
          />

          {/* Sized Box */}
          <View style={{ height: hp(4) }} />
        </View>
      </ScrollView>
      <ComingSoon showModal={showModal} setShowModal={setShowModal} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  title: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
  },
  subTitle: {
    fontSize: RFValue(22),
    fontFamily: "PoppinsMedium",
  },
  banner: {
    // backgroundColor: "yellow",
    width: wp(80),
    height: hp(30),
  },
  detailSection: {
    backgroundColor: "#FAFFFF",
    paddingHorizontal: hp(2.5),
    paddingVertical: hp(1.5),
    borderRadius: 10,
  },
  detail: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    lineHeight: hp(3),
    textAlign: "justify",
  },
});

export default HappiTALK;
