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
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialIcons } from "@expo/vector-icons";

// Context
import { Hcontext } from "../../context/Hcontext";

// Utils
import { hasHappiSELFAccess } from "../../utils/Util";

// Components
import Button from "../../components/buttons/Button";

const HappiSELF = (props) => {
  // Prop destructuring
  const { navigation } = props;

  // Context Variables
  const { authState, getSubscriptions, screenTrafficAnalytics } =
    useContext(Hcontext);

  // STate variables
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
        const isSub = mySub.data.find((sub) => hasHappiSELFAccess(sub));
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
          <MaterialIcons name="chevron-left" size={22} color="#494650" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Heading */}
        <Text style={styles.heading}>HappiSELF</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Daily practices for inner strength.</Text>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require("../../assets/images/happiAPP.png")}
            resizeMode="contain"
            style={styles.banner}
          />
        </View>

        {/* Description Card */}
        <View style={styles.descriptionCard}>
          <Text style={styles.paragraph}>
            Build meaningful daily habits through interactive tools and guided
            practices designed to strengthen awareness, balance, and inner
            resilience in everyday life.
          </Text>
          <View style={{ height: 24 }} />
          <Text style={styles.paragraph}>
            It helps you create positive, sustainable routines that support
            conscious personal growth.
          </Text>
          <View style={{ height: 24 }} />
          <Text style={styles.paragraph}>
            Rooted in scientifically backed behavioural methods, the experience
            is designed to make self-development practical, engaging, and easy
            to integrate into daily life.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButton}>
        <Button
          text="Start Now"
          pressHandler={() => {
            if (authState.user) {
              if (isSubscribed) {
                navigation.navigate("HappiSELFTab");
              } else {
                navigation.navigate("ExploreServices");
              }
            } else {
              navigation.push("WelcomeScreen");
            }
          }}
          loading={loading}
          containerStyle={styles.startButton}
          textStyle={styles.startButtonText}
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
    paddingBottom: hp(17),
  },
  heading: {
    fontSize: RFValue(30),
    fontFamily: "Poppins",
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
    backgroundColor: "#F8F7FF",
    borderRadius: 28,
    marginTop: hp(3),
    paddingVertical: hp(2),
  },
  banner: {
    width: wp(70),
    height: hp(28),
  },
  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 32,
    paddingVertical: 32,
    marginTop: hp(2),
  },
  paragraph: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    fontWeight: "400",
    color: "#606060",
    lineHeight: RFValue(21),
  },
  bottomButton: {
    position: "absolute",
    bottom: hp(5),
    left: 14,
    right: 14,
  },
  startButton: {
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
  startButtonText: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsSemiBold",
    color: "#191919",
  },
});

export default HappiSELF;