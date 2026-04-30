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

const HappiBUDDY = (props) => {
  // Prop destructuring
  const { navigation } = props;

  // Context Varibales
  const { authState, getSubscriptions, screenTrafficAnalytics } =
    useContext(Hcontext);

  // State variables
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkSubscription();
    screenTrafficAnalytics({ screenName: "HappiBUDDY Description Screen" });
  }, []);

  const checkSubscription = async () => {
    setLoading(true);
    try {
      const mySub = await getSubscriptions();

      if (mySub.status === "success") {
        const isSub = mySub.data.find((sub) => sub.name === "HappiBUDDY");
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
          <Text style={styles.title}>HappiBUDDY</Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Text style={styles.subTitle}>
            A Friend in Need is a Friend Indeed
          </Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Image
            source={require("../../assets/images/happiBUDDY.png")}
            resizeMode="contain"
            style={styles.banner}
          />

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <View style={styles.detailSection}>
            <Text style={styles.detail}>
              We aim to provide a non-judgemental, anonymous, virtual space that
              connects you to a professional expert buddy anytime, anywhere.
              Share your emotions, feelings, and general thoughts with your
              buddy who will resolve your queries personally and make you feel
              cared for, while being ensured of 100% confidentiality at all
              times. Journaling thoughts daily and sharing them without any
              hesitation can prove to be of significant importance in
              personality development of younger groups and emotional management
              of elder ones. So don't let your emotions die in silence but share
              them with a broad smile and an air of relief, because your buddy
              is around!
            </Text>
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Button
            text={isSubscribed ? "Subscribed" : "Get HappiBUDDY Now"}
            pressHandler={() => {
              if (authState.user) {
                // navigation.push("HappiBuddyConnect");
                if (isSubscribed) {
                  //navigation.push("SubscribedServices");
                  navigation.push("HappiBuddyConnect");
                } else {
                  navigation.push("Pricing", { selectedPlan: "HappiBUDDY" });
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

export default HappiBUDDY;
