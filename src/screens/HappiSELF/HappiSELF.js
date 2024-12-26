import React, { useEffect, useState, useContext } from "react";
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

const HappiSELF = (props) => {
  // Prop destructuring
  const { navigation } = props;

  // Context Variables
  const { authState, getSubscriptions, screenTrafficAnalytics } =
    useContext(Hcontext);

  // STate variables
  const [showModal, setShowModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mounting
  useEffect(() => {
    checkSubscription();
    screenTrafficAnalytics({ screenName: "HappiSELF Description Screen" });
  }, []);

  const checkSubscription = async () => {
    setLoading(true);
    try {
      const mySub = await getSubscriptions();

      if (mySub.status === "success") {
        const isSub = mySub.data.find((sub) => sub.name === "HappiSELF");
        if (isSub) setIsSubscribed(true);
      }
    } catch (err) {
      console.log("Some issue while checking subscription - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Header showBack={true} navigation={navigation} />

      <ScrollView style={{ paddingHorizontal: wp(10) }}>
        {/* Sized Box */}
        <View style={{ height: hp(3) }} />

        <View>
          <Text style={styles.title}>HappiSELF</Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Text style={styles.subTitle}>
            Tune up your emotions anytime anywhere
          </Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Image
            source={require("../../assets/images/happiAPP.png")}
            resizeMode="contain"
            style={styles.banner}
          />

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <View style={styles.detailSection}>
            <Text style={styles.detail}>
              Lift up your emotional wellbeing or build positive habits into
              your daily schedule with globally validated, interactive, research
              and evidence based self-help tools. Engage yourself in a self -
              reflection journey, mind-soothing content, socialising activities,
              and gamified exercises or empower yourself by setting daily goals
              to meet your mental wellness targets. We aim to help you develop
              the faculties of self-management and emotional resilience by
              enabling you to bring about positive and constructive changes in
              your life. This program is embedded in the most powerful technique
              of Cognitive Behaviour Therapy, which has a similar therapeutic
              impact as personal interaction.
            </Text>
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Button
            text={isSubscribed ? "Subscribed" : "Get HappiSELF Now"}
            // pressHandler={() => {
            //   if (authState.user) {
            //     navigation.push("HappiSELFTab");
            //     // setShowModal(true);
            //   } else {
            //     navigation.push("WelcomeScreen");
            //   }
            // }}
            pressHandler={() => {
              if (authState.user) {
                if (isSubscribed) {
                  navigation.navigate("SubscribedServices");
                } else {
                  navigation.push("Pricing", { selectedPlan: "HappiSELF" });
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

export default HappiSELF;
