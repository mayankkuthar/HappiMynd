import React, { useEffect, useContext } from "react";
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
import { Ionicons } from "@expo/vector-icons";

// Context
import { Hcontext } from "../../context/Hcontext";

const HappiLifeIntroduction = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { screenTrafficAnalytics } = useContext(Hcontext);

  // Mounting
  useEffect(() => {
    screenTrafficAnalytics({ screenName: "HappiLifeIntroduction" });
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="ios-chevron-back" size={22} color="#494650" />
        </TouchableOpacity>
        <Text style={styles.brand}>HappiLIFE</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Heading */}
        <Text style={styles.heading}>
          Understand what's going within you.
        </Text>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require("../../assets/images/happiLIFE.png")}
            resizeMode="contain"
            style={styles.illustration}
          />
        </View>

        {/* Description Card */}
        <View style={styles.descriptionCard}>
          <Text style={styles.paragraph}>
            Your growth begins with awareness. It is a guided self-reflection
            tool. It helps to understand your important life dimensions such as
            life satisfaction, adaptability, balance, habits and personal
            alignment.
          </Text>
          <View style={{ height: 20 }} />
          <Text style={styles.paragraph}>
            It provides personalized insights that bring clarity to your
            patterns, strengths and growth areas. A guided session with a growth
            expert can further help you understand meaningful next steps for
            conscious progress and life direction.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButton}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.startButton}
          onPress={() => navigation.replace("HappiLIFEScreening")}
        >
          <Text style={styles.startButtonText}>Start Your Journey</Text>
        </TouchableOpacity>
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
  brand: {
    fontSize: RFValue(30),
    fontFamily: "Poppins",
    fontWeight: "400",
    color: "#A454FE",
    marginTop: hp(1),
  },
  scrollContent: {
    paddingHorizontal: wp(4.4),
    paddingBottom: hp(16),
  },
  heading: {
    fontSize: RFValue(20),
    fontFamily: "Poppins",
    fontWeight: "400",
    color: "#111111",
    textAlign: "left",
    marginTop: hp(2),
  },
  illustrationContainer: {
    alignItems: "center",
    marginTop: hp(1),
  },
  illustration: {
    width: wp(72),
    height: hp(26),
  },
  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 25,
    paddingVertical: 25,
    marginTop: hp(1),
  },
  paragraph: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    fontWeight: "400",
    color: "#626262",
    lineHeight: RFValue(21),
  },
  bottomButton: {
    position: "absolute",
    bottom: hp(4.3),
    left: 20,
    right: 20,
  },
  startButton: {
    backgroundColor: "#E6DFFF",
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
    color: "#17131F",
  },
});

export default HappiLifeIntroduction;