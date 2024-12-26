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

// Components
import Header from "../../components/common/Header";
import Button from "../../components/buttons/Button";
import { Hcontext } from "../../context/Hcontext";

const HappiLEARNDescription = (props) => {
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
    screenTrafficAnalytics({ screenName: "HappiLEARN Description Screen" });
  }, []);

  const checkSubscription = async () => {
    setLoading(true);
    try {
      const mySub = await getSubscriptions();

      console.log("CHeck teh subs - ", mySub);

      if (mySub.status === "success") {
        const isSub = mySub.data.find(
          (sub) => sub.name === "HappiLIFE Summary Reading"
          // (sub) => sub.name === "HappiLEARN"
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
          <Text style={styles.title}>HappiLEARN</Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Text style={styles.subTitle}>
            Virtual Self Learning Space For Emotional & Mental Wellbeing
          </Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Image
            source={require("../../assets/images/happiSPACE.png")}
            resizeMode="contain"
            style={styles.banner}
          />

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <View style={styles.detailSection}>
            <Text style={styles.detail}>
              Get 24*7 access to 5000+ minutes of well-researched self-help
              content repository of video, audio, blogs, and more, available in
              both English and Hindi. Browse through rich content curated
              especially for the profile and areas that you want to look at.
              Empower yourself by becoming self-aware and enrich yourself in
              mental wellbeing ideas that are easy to grasp and implement in
              day-to-day life.
            </Text>
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Button
            text={isSubscribed ? "Subscribed" : "Get HappiLEARN Now"}
            pressHandler={() => {
              if (authState.user) {
                // navigation.push("HappiLEARN");
                if (isSubscribed) {
                  navigation.navigate("SubscribedServices");
                } else {
                  navigation.push("Pricing", {
                    selectedPlan: "HappiLIFE Summary Reading",
                  });
                }
              } else {
                navigation.push("WelcomeScreen");
              }
            }}
            loading={loading}
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

export default HappiLEARNDescription;
