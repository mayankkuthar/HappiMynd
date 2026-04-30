import React, { useState, useContext, useCallback, useRef } from "react";
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
import { RFValue } from "react-native-responsive-fontsize";
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

// Languages we support in HappiBUDDY
const SUPPORTED_LANGUAGES = ["english", "hindi"];

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
  // ─── Context ────────────────────────────────────────────────────────────────
  const {
    currentlyAssignedPsychologist,
    assignPsychologist,
    snackDispatch,
    getLanguages,
  } = useContext(Hcontext);

  // ─── Props ──────────────────────────────────────────────────────────────────
  const { navigation } = props;

  // ─── Modal visibility ────────────────────────────────────────────────────────
  const [showConfidentialModal, setShowConfidentialModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);

  // ─── Psychologist state (single object = single re-render per update) ────────
  const [psyState, setPsyState] = useState({
    loading: false,
    groupId: null,
    receiverPsy: "",
  });
  const { loading, groupId, receiverPsy } = psyState;

  // ─── Languages pre-fetched while user reads the screen ───────────────────────
  const [fetchedLanguages, setFetchedLanguages] = useState([]);

  // ─── Stable refs — always hold the latest context / nav values ───────────────
  // This pattern lets us write useCallback with [] deps (stable identity)
  // while still always calling the freshest function from context.
  const currentlyAssignedPsychologistRef = useRef(currentlyAssignedPsychologist);
  const assignPsychologistRef = useRef(assignPsychologist);
  const snackDispatchRef = useRef(snackDispatch);
  const navigationRef = useRef(navigation);
  const getLanguagesRef = useRef(getLanguages);

  // Sync refs on every render (cheap, no side-effects)
  currentlyAssignedPsychologistRef.current = currentlyAssignedPsychologist;
  assignPsychologistRef.current = assignPsychologist;
  snackDispatchRef.current = snackDispatch;
  navigationRef.current = navigation;
  getLanguagesRef.current = getLanguages;

  // ─── Check previously assigned psychologist ──────────────────────────────────
  const checkCurrentPsycologist = useCallback(async () => {
    setPsyState((prev) => ({ ...prev, loading: true }));
    try {
      const currentPsy = await currentlyAssignedPsychologistRef.current();
      if (currentPsy.status === "success") {
        // Single setState call = single re-render (was 3 separate calls before)
        setPsyState({
          loading: false,
          groupId: currentPsy.group_id,
          receiverPsy: currentPsy.psychologist_detail.id + "_p",
        });
      } else {
        setPsyState((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.log("Error checking current psychologist:", err);
      setPsyState((prev) => ({ ...prev, loading: false }));
    }
  }, []); // stable — reads context via ref

  // ─── Pre-fetch languages in the background ───────────────────────────────────
  // By the time the user taps through to LanguageModal the data is already
  // ready, so the dropdown renders instantly with no spinner at all.
  const prefetchLanguages = useCallback(async () => {
    try {
      const res = await getLanguagesRef.current();
      if (res?.status === "success" && res?.data?.length > 0) {
        const filtered = res.data.filter((l) =>
          SUPPORTED_LANGUAGES.includes(l.name),
        );
        if (filtered.length > 0) setFetchedLanguages(filtered);
      }
    } catch (err) {
      // Silent — LanguageModal carries its own FALLBACK_LANGUAGES safety net
    }
  }, []); // stable — reads context via ref

  // ─── Assign psychologist after language is selected ──────────────────────────
  // useCallback with [] makes this reference-stable so LanguageModal never
  // re-renders just because HappiBuddyConnect re-renders.
  const fetchPsycologist = useCallback(async (language) => {
    try {
      const psycologist = await assignPsychologistRef.current({ language });
      if (psycologist.status === "success") {
        snackDispatchRef.current({
          type: "SHOW_SNACK",
          payload: "Your Buddy is waiting for you.",
        });
        const psyId = psycologist.psychologist_detail.id + "_p";
        setPsyState((prev) => ({ ...prev, receiverPsy: psyId }));
        navigationRef.current.push("HappiBUDDYChat", {
          assignedPsy: psyId,
          group: psycologist.group_id,
        });
      }
    } catch (err) {
      console.log("Error assigning psychologist:", err);
    }
  }, []); // stable — reads context via ref

  // ─── Run on every screen focus ───────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      checkCurrentPsycologist();
      prefetchLanguages(); // fire-and-forget background fetch
      return () => {};
    }, [checkCurrentPsycologist, prefetchLanguages]), // both stable → callback never changes
  );

  // ─── Render ──────────────────────────────────────────────────────────────────
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
          // Pass pre-fetched languages so the modal renders instantly.
          // If pre-fetch hasn't finished yet (edge case), LanguageModal
          // will fall back to its own API call + FALLBACK_LANGUAGES.
          preloadedLanguages={fetchedLanguages}
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
              onPress={() => setShowConfidentialModal(true)}
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
