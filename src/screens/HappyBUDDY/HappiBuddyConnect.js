import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect } from "@react-navigation/native";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
import WaveButton from "../../components/buttons/WaveButton";
import ConfidentialModal from "../../components/Modals/ConfidentialModal";
import LanguageModal from "../../components/Modals/LanguageModal";
import ComingSoon from "../../components/Modals/ComingSoon";

const bulletPoints = [
  {
    id: 0,
    text: "Communicate your emotions, feelings, and general thoughts to a professional expert buddy who responds to your queries personally and makes you feel cared for.",
  },
  {
    id: 1,
    text: "A non-judgemental, confidential, anonymous, and fully virtual platform that keeps you connected to an expert anytime, anywhere, all year round.",
  },
  {
    id: 2,
    text: "Journaling thoughts daily and sharing emotions without hesitation helps in personality development of younger groups and emotional management of elder ones.",
  },
];

const HappiBuddyConnect = (props) => {
  // Context Variables
  const { currentlyAssignedPsycologist, assignPsychologist, snackDispatch } =
    useContext(Hcontext);

  // Prop Destructuring
  const { navigation } = props;

  console.log("checking my subs ct - ", props);

  // State Variables
  const [showConfidentialModal, setShowConfidentialModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [receiverPsy, setReceiverPsy] = useState(""); // The Assigned Psycologist
  const [groupId, setGroupId] = useState(null);
  const [comingSoon, setComingSoon] = useState(false);
  const [loading, setLoading] = useState(false);

  // // Mounting
  // useEffect(() => {
  //   checkCurrentPsycologist();
  // }, []);

  // Hits when focus hits
  useFocusEffect(
    useCallback(() => {
      checkCurrentPsycologist();
      return () => {};
    }, [])
  );

  // CHeck the previously assigned psycologist to continue with
  const checkCurrentPsycologist = async () => {
    setLoading(true);
    try {
      const currentPsy = await currentlyAssignedPsycologist();
      console.log("The current psycoligist - ", 
      // currentPsy
      );
      if (currentPsy.status === "success") {
        setGroupId(currentPsy.group_id);
        setReceiverPsy(currentPsy.psychologist_detail.id + "_p");
      }
    } catch (err) {
      console.log("Some issue while checking current psycologist - ", err);
    }
    setLoading(false);
  };

  // Assigning a Psycologist
  const fetchPsycologist = async (language) => {
    console.log("here is inisde duncion");
    try {
      const psycologist = await assignPsychologist({ language });

      console.log("The fetched selected psycologist - ", psycologist);

      if (psycologist.status === "success") {
        snackDispatch({
          type: "SHOW_SNACK",
          payload: "Your Buddy is waiting for you.",
        });

        setReceiverPsy(psycologist.psychologist_detail.id + "_p");
        navigation.push("HappiBUDDYChat", {
          assignedPsy: psycologist.psychologist_detail.id + "_p",
          group: psycologist.group_id,
        });
      }
    } catch (err) {
      console.log("Some issue while asigning psycologist - ", err);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <Header showLogo={false} showBack={true} navigation={navigation} />

      {comingSoon ? (
        <ComingSoon showModal={comingSoon} setShowModal={setComingSoon} />
      ) : null}

      {showConfidentialModal ? (
        <ConfidentialModal
          showModal={showConfidentialModal}
          setShowModal={setShowConfidentialModal}
          navigation={navigation}
          setShowLanguageModal={setShowLanguageModal}
          receiverPsy={receiverPsy}
          pressHandler={() => {
            if (receiverPsy) {
              setShowConfidentialModal(false);
              navigation.push("HappiBUDDYChat", {
                assignedPsy: receiverPsy,
                group: groupId,
              });
            } else {
              setShowConfidentialModal(false);
            }
          }}
        />
      ) : null}

      {showLanguageModal ? (
        <LanguageModal
          navigation={navigation}
          showModal={showLanguageModal}
          setShowModal={setShowLanguageModal}
          fetchPsycologist={fetchPsycologist}
        />
      ) : null}

      {/* Body Section */}
      <ScrollView style={{ paddingHorizontal: wp(10) }}>
        <Text style={styles.pageTitle}>HappiBUDDY</Text>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        <View style={styles.heroContainer}>
          {/* Sized Box */}
          <View style={{ height: hp(2) }} />
          <Image
            // source={require("../../assets/images/happiBUDDY_girl.png")}
            source={require("../../assets/images/happiBUDDY.png")}
            resizeMode="contain"
            style={styles.heroImage}
          />
          {/* Sized Box */}
          <View style={{ height: hp(2) }} />
          <View style={styles.heroContentContainer}>
            <Text
              style={{ fontSize: RFValue(16), fontFamily: "PoppinsMedium" }}
            >
              A Friend in Need is
            </Text>
            <Text
              style={{ fontSize: RFValue(16), fontFamily: "PoppinsMedium" }}
            >
              a Friend Indeed
            </Text>

            {/* Sized Box */}
            <View style={{ height: hp(2) }} />

            <View>
              {bulletPoints.map((point) => (
                <View key={point.id}>
                  <View style={{ flexDirection: "row" }}>
                    <View style={styles.bulletPoint} />
                    {/* Sized Box */}
                    <View style={{ width: hp(1) }} />
                    <Text style={styles.pointText}>{point.text}</Text>
                  </View>
                  {/* Sized Box */}
                  <View style={{ height: hp(2) }} />
                </View>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              // onPress={() => navigation.push("HappiBUDDYChat")}
              onPress={() => {
                if (!props?.route?.params?.isSubscribed) {
                  // navigation.navigate("Payments");
                  setShowConfidentialModal(true);
                } else {
                  setShowConfidentialModal(true);
                }
              }}
              style={styles.connectButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.loaderColor} />
              ) : (
                <Text style={styles.connectText}>Connect Now</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <Text style={styles.choiceText}>Not comfortable chatting ?</Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <WaveButton
          text="Explore other services"
          width={80}
          pressHandler={() => navigation.goBack()}
        />

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

export default HappiBuddyConnect;
