import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";
import { hasHappiLIFEAccess } from "../../utils/Util";
// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";
// Components
import Button from "../../components/buttons/Button";
import Header from "../../components/common/Header";
import ReportGenConfirmModal from "../../components/Modals/ReportGenConfirmModal";

const AssessmentComplete = (props) => {
  // Context Variables
  const {
    authState,
    screenTrafficAnalytics,
    getUserProfile,
    getSubscriptions,
  } = useContext(Hcontext);
  // Prop Destructuring
  const { navigation } = props;
  // State Variables
  const [showModal, setShowModal] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    screenTrafficAnalytics({
      screenName: "HappiLIFE Assesment Completion Screen",
    });
    fetchUserProfile(authState?.user?.access_token);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick,
      );
    };
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      setLoadingButton(true);
      const userProfile = await getUserProfile({ token });

      console.log("checking in the user profile - ", userProfile);

      if (userProfile.status === "success") {
        if (userProfile.data.verify_user) {
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

  const handleBackButtonClick = () => {
    navigation.navigate("HomeScreen");
    return true;
  };

  const handleViewReport = async () => {
    try {
      const mySub = await getSubscriptions();
      if (mySub?.status === "success") {
        const happiLifeSub = mySub.data.find((sub) =>
          hasHappiLIFEAccess(sub)
        );
        if (happiLifeSub) {
          navigation.navigate("AllReports");
          return;
        }
      }
      navigation.navigate("ExploreServices");
    } catch (err) {
      console.log("Some issue while checking subscription - ", err);
      navigation.navigate("ExploreServices");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/contact_background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <ReportGenConfirmModal
        showModal={showModal}
        setShowModal={setShowModal}
        pressHandler={handleViewReport}
      />
      <TouchableOpacity
        style={styles.backContainer}
        activeOpacity={0.7}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <Ionicons name="ios-chevron-back" size={22} color="black" />
      </TouchableOpacity>
      <View>
        {/* Sized Box */}
        <View style={{ height: hp(16) }} />
        <Image
          source={require("../../assets/images/assessment_complete.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />
        <Text style={styles.heroText}>
          Your report has been generated. Please continue to view.
        </Text>
      </View>
      <View style={{ alignSelf: "flex-end", width: wp(80) }}>
        <Button
          text="Continue"
          loading={loadingButton}
          containerStyle={styles.continueButton}
          textStyle={styles.continueButtonText}
          pressHandler={() => {
            navigation.navigate("HomeScreen");
          }}
        />
        {/* Sized Box */}
        <View style={{ height: hp(2) }} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    paddingHorizontal: wp(10),
    justifyContent: "space-between",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#F2F0FF",
    opacity: 0.5,
  },
  backContainer: {
    position: "absolute",
    left: wp(6),
    top: hp(8),
  },
  heroImage: {
    width: wp(70),
    height: hp(40),
    alignSelf: "center",
  },
  heroText: {
    fontSize: RFValue(18),
    fontFamily: "PoppinsSemiBold",
    textAlign: "center",
  },
  continueButton: {
    backgroundColor: "#E9D5FF",
    height: hp(5),
    shadowColor: "#8E66F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  continueButtonText: {
    color: "#17131F",
  },
});

export default AssessmentComplete;
