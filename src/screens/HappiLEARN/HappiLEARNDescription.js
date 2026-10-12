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
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialIcons } from "@expo/vector-icons";
import { hasHappiLEARNAccess } from "../../utils/Util";

// Components
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
        const isSub = mySub.data.find((sub) => hasHappiLEARNAccess(sub));
        if (isSub) setIsSubscribed(true);
      }
    } catch (err) {
      console.log("Some issue while checking subscription - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="chevron-left" size={22} color="#4B4854" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Heading */}
        <Text style={styles.heading}>HappiLEARN</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>A learning space for growth.</Text>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require("../../assets/images/happiSPACE.png")}
            resizeMode="contain"
            style={styles.banner}
          />
        </View>

        {/* Description Card */}
        <View style={styles.descriptionCard}>
          <Text style={styles.paragraph}>
            HappiLEARN gives you access to a rich collection of expert-curated
            learning resources helping you to build awareness, perspective, and
            life skills.
          </Text>
          <View style={{ height: 20 }} />
          <Text style={styles.paragraph}>
            Content is organized around themes relevant to each life phase and
            growth interests. Build new perspectives, develop better habits, and
            implement simple, actionable ideas into daily life - all at your own
            pace.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButton}>
        <Button
          text={isSubscribed ? "Start Learning" : "Get HappiLEARN Now"}
          pressHandler={() => {
            if (authState.user) {
              if (isSubscribed) {
                navigation.navigate("HappiLEARN");
              } else {
                navigation.navigate("ExploreServices");
              }
            } else {
              navigation.push("WelcomeScreen");
            }
          }}
          loading={loading}
          containerStyle={styles.ctaButton}
          textStyle={styles.ctaButtonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FF",
    paddingTop: hp(6),
  },
  header: {
    width: wp(100),
    paddingHorizontal: wp(4),
  },
  scrollContent: {
    paddingHorizontal: wp(4.4),
    paddingBottom: hp(16),
  },
  heading: {
    fontSize: RFValue(30),
    fontFamily: "PoppinsSemiBold",
    fontWeight: "400",
    color: "#9747FF",
    textAlign: "left",
  },
  subtitle: {
    fontSize: RFValue(20),
    fontFamily: "Poppins",
    fontWeight: "400",
    color: "#111111",
    textAlign: "left",
    marginTop: hp(1.5),
  },
  illustrationContainer: {
    alignItems: "center",
    marginTop: hp(3),
  },
  banner: {
    width: wp(80),
    height: hp(30),
  },
  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 26,
    marginTop: hp(2),
  },
  paragraph: {
    fontSize: RFValue(13),
    fontFamily: "PoppinsMedium",
    fontWeight: "400",
    color: "#606060",
    lineHeight: RFValue(21),
  },
  bottomButton: {
    position: "absolute",
    bottom: hp(4.3),
    left: 20,
    right: 20,
  },
  ctaButton: {
    backgroundColor: "#E8DEFF",
    borderRadius: 50,
    height: hp(6),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8E66F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  ctaButtonText: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsSemiBold",
    color: "#191919",
  },
});

export default HappiLEARNDescription;