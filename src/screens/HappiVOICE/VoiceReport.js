import React, { useEffect, useContext, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Image, BackHandler } from 'react-native'
import Button from "../../components/buttons/Button"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors, happiVoice_constants } from "../../assets/constants";
import Header from "../../components/common/Header";
import { Ionicons } from "@expo/vector-icons";
import { Hcontext } from "../../context/Hcontext";

import { getReport, saveReport } from './VoiceAPIService';


const VoiceReport = (props) => {
  const { navigation } = props;


  // Context Variables

  const { authState, getSubscriptions, getUserProfile, screenTrafficAnalytics } = useContext(Hcontext);
  const { sondeJobId, tokenSonde, setVoiceReport, voiceReport } = useContext(Hcontext);

  // STate variables

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);


  const [userData, setUserData] = useState({})


  const { whiteLabelState } = useContext(Hcontext);
  // Prop Destructuring


  useEffect(() => {
    checkSubscription();
    fetchUserProfile(authState?.user?.access_token);
  }, []);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    screenTrafficAnalytics({
      screenName: "HappiVoice Assesment Completion Screen",
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


  const checkSubscription = async () => {
    setLoading(true);
    try {
      const mySub = await getSubscriptions();
console.log("my subscription>>", mySub)
      if (mySub.status === "success") {
        const isSub = mySub?.data?.find((sub) =>
          sub?.name === "HappiVOICE (Year)" ||
          sub?.name === "HappiVOICE (Month)");
        if (isSub) setIsSubscribed(true);
      }
    } catch (err) {

    }
    setLoading(false);
  };

  const fetchUserProfile = async (token) => {
    try {
      setLoadingButton(true);
      const userProfile = await getUserProfile({ token });
      setUserData(userProfile)



      if (userProfile.status === "success") {
        if (userProfile?.data?.verify_user) {
          if (userProfile?.data?.verify_user?.email_verify) {
            setIsEmailVerified(true);
          }
          if (userProfile?.data?.verify_user?.mobile_verify) {
            setIsPhoneVerified(true);
          }
        }
      }
      setLoadingButton(false);
    } catch (err) {
      setLoadingButton(false);

    }
  };

  const audioReport = async () => {

    setLoadingButton(true);
    var voiceScore = await getReport(tokenSonde, sondeJobId);
    console.log("data from sonde ------",voiceScore);
    if (voiceScore?.status == "DONE") {

      setVoiceReport(voiceScore) 
      await saveReport(userData, voiceScore)
      if (authState?.user) {
        if (isEmailVerified && isPhoneVerified) {            

          if (voiceScore) {
            if (isSubscribed) {
              setLoadingButton(false);
              navigation.navigate("ReportsCheck");
            } else {

              setLoadingButton(false);
              navigation.push("Pricing", {
                selectedPlan: "HappiVOICE (Year)",
              });
            }
          }
          else{
            setLoadingButton(false)
          }
        } else {
          setLoadingButton(false);
          navigation.navigate("ContactVerification", {
            isFrom: "Voice",
          });
        }
      } else {
        setLoadingButton(false);
        navigation.push("HomeScreen");
      }
    }else{
      console.log("error generate ---- ",voiceScore.status)
      alert("Fail to load report");
      setLoadingButton(false);
    } 
  }


  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <TouchableOpacity
        style={styles.backContainer}
        activeOpacity={0.7}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <Ionicons name="ios-chevron-back" size={hp(4)} color="black" />
      </TouchableOpacity>
      <View>
        <View style={{ height: hp(6) }} />
        <Image
          source={
            whiteLabelState.logo
              ? { uri: whiteLabelState.logo }
              : require("../../assets/images/happimynd_logo.png")
          }
          style={{ ...styles.headerLogo }}
          resizeMode="contain"
        />
        <View style={{ height: hp(4) }} />
        <Image
          source={require("../../assets/images/assessment_complete.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />
        <View style={{ height: hp(8) }} />
        <Text style={styles.heroText}>
          {happiVoice_constants?.voice_rep}
        </Text>
      </View>
      <View style={{ alignSelf: "flex-end", width: wp(80) }}>
        <Button
          loading={loadingButton}
          text={happiVoice_constants?.button_cont}
          pressHandler={() => audioReport()}
        />
        {/* Sized Box */}
        <View style={{ height: hp(5) }} />
      </View>
    </ImageBackground>
  );

}
const styles = StyleSheet.create({

  containerhere: {
    backgroundColor: colors.background,
    flex: 1,
  },
  headerLogo: {
    alignSelf: 'center',
    width: wp(28),
    height: hp(7),
  },
  topicTexthere: {
    padding: 10,
    fontSize: RFValue(22),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
    // textAlign: 'center'
  },
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
    fontSize: RFValue(20),
    fontFamily: "PoppinsSemiBold",
    textAlign: 'center'
  },
});

export default VoiceReport
