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

const HappiLIFE = (props) => {
  // Prop destructuring
  const { navigation } = props;

  // Context Variables
  const { authState, getSubscriptions, screenTrafficAnalytics } =
    useContext(Hcontext);

  // State Varibales
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mounting
  useEffect(() => {
    checkSubscription();
    screenTrafficAnalytics({ screenName: "HappiLIFE Description Screen" });
  }, []);

  const checkSubscription = async () => {
    setLoading(true);
    try {
      const mySub = await getSubscriptions();

      if (mySub.status === "success") {
        const isSub = mySub.data.find(
          (sub) => sub.name === "HappiLIFE Screening"
        );
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
          <Text style={styles.title}>HappiLIFE</Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Text style={styles.subTitle}>
            Simplest way to understand your Emotional Journey
          </Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Image
            source={require("../../assets/images/happiLIFE.png")}
            resizeMode="contain"
            style={styles.banner}
          />

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <View style={styles.detailSection}>
            <Text style={styles.detail}>
              In reality, a first step that evaluates your wellbeing and gives
              you valuable insight into several parameters of emotional and
              mental health including quality of life, happiness, ability to
              bounce back, work-life balance, digital usage patterns, and more.
              The awareness tool is customised for 10 unique social profiles to
              help anyone in relating with their life situations and taking the
              first logical step of their emotional wellbeing journey. The
              assisted summary reading session by our emotional wellbeing expert
              can be coupled with this amazing tool. It helps you interpret your
              awareness summary, opening you up to a world of paths and
              possibilities towards better and healthier living.
            </Text>
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Button
            loading={loading}
            text={
              authState.isScreeningComplete
                ? isSubscribed
                  ? "Download from Home Screen"
                  : "Get Awareness Report"
                : "HappiLIFE Awareness Tool"
            }
            // pressHandler={() => navigation.push("Pricing")}
            pressHandler={() => {
              if (authState.user) {
                if (authState.isScreeningComplete) {
                  if (isSubscribed || props?.route?.params?.isSubscribed) {
                    navigation.navigate("HomeScreen");
                  } else navigation.goBack();
                } else {
                  navigation.navigate("HappiLIFEScreening");
                }
              } else navigation.navigate("WelcomeScreen");
            }}
          />

          {/* Sized Box */}
          <View style={{ height: hp(4) }} />
        </View>
      </ScrollView>
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

export default HappiLIFE;
