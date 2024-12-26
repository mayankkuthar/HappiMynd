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

// Contants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Button from "../../components/buttons/Button";
import Header from "../../components/common/Header";
import ReportGenConfirmModal from "../../components/Modals/ReportGenConfirmModal";

const AssessmentComplete = (props) => {
  // Context Variables
  const { authState, screenTrafficAnalytics } = useContext(Hcontext);

  // Prop Destructuring
  const { navigation } = props;

  // State Variables
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    screenTrafficAnalytics({
      screenName: "HappiLIFE Assesment Completion Screen",
    });
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);

  const handleBackButtonClick = () => {
    navigation.navigate("HomeScreen");
    return true;
  };

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <ReportGenConfirmModal
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <TouchableOpacity
        style={styles.backContainer}
        activeOpacity={0.7}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <Ionicons name="ios-chevron-back" size={hp(4)} color="black" />
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
          Access your HappiLIFE Awareness Tool from App Home Page.
        </Text>
      </View>

      <View style={{ alignSelf: "flex-end", width: wp(80) }}>
        <Button
          text="Continue"
          pressHandler={() => {
            navigation.navigate("ContactVerification");
            //navigation.navigate("HomeScreen");

            //  console.log("usertoken", "90=", authState.user.user);
            // console.log("usertoken", "90=", authState.user.user.user_token);

            // if (authState.user.user.user_token) {
            // navigation.navigate("HomeScreen");
            // } else {
            // navigation.navigate("ContactVerification");
            // }
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
  backContainer: {
    position: "absolute",
    left: wp(6),
    top: hp(8),
    // backgroundColor: "red",
  },
  heroImage: {
    // backgroundColor: "red",
    width: wp(70),
    height: hp(40),
    alignSelf: "center",
  },
  heroText: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
  },
});

export default AssessmentComplete;
