import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";

// Constants
import { colors, happiVoice_constants, } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import SubscriptionCard from "../../components/cards/SubscriptionCard";

// Dummy Data
// const subscriptions = [
//   {
//     id: 1,
//     title: "HappiLIFE",
//     description:
//       "Evaluate your wellbeing on 10 different parameters of emotional and mental health with a unique profile based approach. ",
//     screen: "HappiLIFE",
//   },
//   {
//     id: 2,
//     title: "HappiGUIDE",
//     description:
//       "Make the most out of your HappiLIFE screening summary with a summary reading session by our emotional wellbeing expert.",
//     screen: "ReportReadingBook",
//   },
//   {
//     id: 3,
//     title: "HappiLEARN",
//     description:
//       "24*7 access to 5000+ minutes of curated, well-researched self-help content that includes video, audio, blogs, and more.",
//     screen: "HappiLEARN",
//   },
//   {
//     id: 4,
//     title: "HappiBUDDY",
//     description:
//       "Connect with a professional expert buddy in a personal emotional log room that is non-judgemental, anonymous, and 100% confidential.",
//     screen: "HappiBuddyConnect",
//   },
//   {
//     id: 5,
//     title: "HappiSELF",
//     description:
//       "Self-manage your emotional wellbeing with globally validated, interactive self help tools that include mind soothing content and gamified exercises.",
//     screen: "HappiSELFBook",
//   },
//   {
//     id: 6,
//     title: "HappiTALK",
//     description:
//       "Discuss life, aspirations, personal issues and more with the best of our country’s experts in a confidential safe space from the comfort of your home.",
//     screen: "HappiTALKBook",
//   },
// ];

const Header = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  return (
    <ImageBackground
      source={require("../../assets/images/subscribed_services_background.png")}
      style={styles.headerContainer}
      resizeMode="cover"
    >
      {/* Sized Box */}
      <View style={{ height: hp(6) }} />

      {/* Drawer Button */}
      {/* <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.openDrawer()}
      >
        <Feather name="align-left" size={hp(3)} color="black" />
      </TouchableOpacity> */}

      {/* Header Content */}
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Image
          source={require("../../assets/images/happimynd_logo.png")}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>My Subscribed Services</Text>
      </View>
    </ImageBackground>
  );
};

const SubscribedServices = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { getSubscriptions, screenTrafficAnalytics } = useContext(Hcontext);

  // State Variables
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mounting
  useEffect(() => {
    fetchSubscriptions();
    screenTrafficAnalytics({ screenName: "Subscribed Services Screen" });
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const mySub = await getSubscriptions();
      console.log("che cthe my suvbscribed - ", mySub);

      if (mySub.status === "success") {
        const subs = mySub.data.map((sub) => {
          if (sub.name === "HappiLIFE Screening") {
            return {
              ...sub,
              name: "HappiLIFE Awareness Tool",
              description:
                "Evaluate your wellbeing on several parameters of emotional and mental health with a unique profile based approach.",
              screen: "HappiLIFE",
              subscribed: true,
            };
          } else if (sub.name === "HappiLIFE Summary Reading") {
            //HappiLEARN
            return {
              ...sub,
              name: "HappiLEARN",
              description:
                "Enrich yourself with a 24*7 access to 5000+ minutes of curated, well researched self-help content that includes video, audio, blogs and more.",
              screen: "HappiLEARN",
              subscribed: true,
            };
          } else if (sub.name === "HappiBUDDY") {
            return {
              ...sub,
              description:
                "Connect with a professional expert buddy in a personal emotional log room that is non-judgemental, anonymous, and 100% confidential.",
              screen: "HappiBuddyConnect",
              subscribed: true,
            };
          } else if (sub.name === "HappiSELF") {
            return {
              ...sub,
              description:
                "Self-manage your emotional wellbeing with globally validated, interactive self help tools that include mind soothing content and gamified exercises.",
              screen: "HappiSELFTab",
              subscribed: true,
            };
          } else if (sub.name === "HappiVOICE (Month)") {
            return {
              ...sub,
              description:happiVoice_constants?.happiVoice_desc,
              screen: "HappiVoice",
              subscribed: true,
            };
          } else if (sub.name === "HappiVOICE (Year)") {
            return {
              ...sub,
              description:happiVoice_constants?.happiVoice_desc,
              screen: "HappiVoice",
              subscribed: true,
            };
          } else {
            return {
              ...sub,
              description: "",
              screen: "",
              subscribed: false,
            };
          }
        });

        // remove the HappiGUIDE and HappiTALK
        let removeGuideAndTalk = subs.filter((sub) => {
          return sub.subscribed === true;
        });

        // remove the HappiTALK
        // let removeTalk = removeGuide.filter((sub) => {
        //   return sub.name !== "HappiTALK";
        // });

        setSubscriptions(removeGuideAndTalk);
     
      }
    } catch (err) {
      console.log("Some issue while fetching subscription - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />

      {/* Cards */}
      <ScrollView>
        {/* Sized Box */}
        <View style={{ height: hp(4) }} />
        {loading ? (
          <ActivityIndicator size="small" color={colors.loaderColor} />
        ) : (
          <View style={styles.bodyContainer}>
            {subscriptions.length ? (
              subscriptions.map((subscription) => (
                <>
                  <SubscriptionCard
                    key={subscription.id}
                    navigation={navigation}
                    subscription={subscription}
                  />

                  {/* Sized Box */}
                  <View style={{ height: hp(2) }} />
                </>
              ))
            ) : (
              <Text
                style={{
                  fontSize: RFValue(18),
                  fontFamily: "PoppinsMedium",
                  textAlign: "center",
                  color: colors.borderLight,
                }}
              >
                No Subscriptions
              </Text>
            )}
          </View>
        )}

        {/* Sized Box */}
        <View style={{ height: hp(3) }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  headerContainer: {
    width: wp(100),
    height: hp(30),
    paddingHorizontal: wp(4),
  },
  headerLogo: {
    // backgroundColor: "red",
    width: hp(14),
    height: hp(14),
  },
  headerTitle: {
    fontSize: RFValue(16),
    fontFamily: "PoppinsMedium",
  },
  bodyContainer: {
    paddingHorizontal: wp(4),
  },
});

export default SubscribedServices;
