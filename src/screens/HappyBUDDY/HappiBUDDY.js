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

// Context
import { Hcontext } from "../../context/Hcontext";

// Utils
import { hasHappiBUDDYAccess } from "../../utils/Util";

// Components
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
        const isSub = mySub.data.find((sub) => hasHappiBUDDYAccess(sub));
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
        <Text style={styles.heading}>HappiBUDDY</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>A chat tool with a companion</Text>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require("../../assets/images/happiBUDDY.png")}
            resizeMode="contain"
            style={styles.banner}
          />
        </View>

        {/* Description Card */}
        <View style={styles.descriptionCard}>
          <Text style={styles.paragraph}>
            Share your thoughts, experiences, and everyday reflections with a
            dedicated growth expert who listens, guides, and helps you gain
            meaningful perspective through ongoing conversations.
          </Text>
          <View style={{ height: 20 }} />
          <Text style={styles.paragraph}>
            Designed as a private and judgement-free space, it keeps you
            connected with expert guidance anytime, anywhere, helping you
            navigate life with greater awareness and clarity.
          </Text>
          <View style={{ height: 20 }} />
          <Text style={styles.paragraph}>
            Built on trust, respect, and complete confidentiality, it's a space
            that supports steady progress with confidence and ease.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButton}>
        <Button
          text={isSubscribed ? "Chat with BUDDY" : "Get HappiBUDDY Now"}
          pressHandler={() => {
            if (authState.user) {
              if (isSubscribed) {
                navigation.push("HappiBuddyConnect");
              } else {
                navigation.push("ExploreServices");
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

export default HappiBUDDY;
