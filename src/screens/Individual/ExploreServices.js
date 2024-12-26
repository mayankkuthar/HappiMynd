import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

// Constants
import { colors, happiVoice_constants} from "../../assets/constants";

// Components
import SubscriptionCard from "../../components/cards/SubscriptionCard";
import { Hcontext } from "../../context/Hcontext";

// Dummy Data
const subscriptions = [
  {
    id: 1,
    name: "HappiLIFE Awareness Tool",
    description:
      "Evaluate your wellbeing on several parameters of emotional and mental health with a unique profile based approach.",
    screen: "HappiLIFE",
    subscribed: false,
  },
  {
    id: 2,
    name: "HappiGUIDE",
    description:
      "On Completing your happiLIFE awareness, as the next logical step. Make the most out of your HappiLIFE awareness summary with a summary reading session by our emotional wellbeing expert.",
    // screen: "ReportReadingBook",
    screen: "HappiGUIDE",
    subscribed: false,
  },
  {
    id: 3,
    name: "HappiLIFE Summary Reading", // HappiLIFE Summary Reading
    description:
      "Enrich yourself with a 24*7 access to 5000+ minutes of curated, well researched self-help content that includes video, audio, blogs and more.",
    // screen: "HappiLEARN",
    screen: "HappiLEARNDescription",
    subscribed: false,
  },
  {
    id: 4,
    name: "HappiBUDDY",
    description:
      "Connect with a professional expert buddy in a personal emotional log room that is non-judgemental, anonymous, and 100% confidential.",
    // screen: "HappiBuddyConnect",
    screen: "HappiBUDDY",
    subscribed: false,
  },
  {
    id: 5,
    name: "HappiSELF",
    description:
      "Self-manage your emotional wellbeing with a globally validated, interactive program with Cognitive Behaviour Therapy at its core.",
    // screen: "HappiSELFBook",
    screen: "HappiSELF",
    subscribed: false,
  },
  {
    id: 6,
    name: "HappiTALK",
    description:
      "Discuss life, aspirations, personal issues, relationships and more with the best of our country’s experts in a confidential safe space from the comfort of your home.",
    // screen: "HappiTALKBook",
    screen: "HappiTALK",
    subscribed: false,
  },
  {
    id: 8,
    name: "HappiVOICE",
    description:happiVoice_constants?.happiVoice_desc,
    // screen: "HappiTALKBook",
    screen: "HappiVoice",
    subscribed: false,
  },
];

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
        <Text style={styles.headerTitle}>Explore Services</Text>
      </View>
    </ImageBackground>
  );
};

const ExploreServices = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { getSubscriptions } = useContext(Hcontext);

  // State Variables
  const [subscribed, setSubscribed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hits when focus hits
  useFocusEffect(
    React.useCallback(() => {
      fetchSubscriptions();
      return () => {};
    }, [])
  );

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const mySub = await getSubscriptions();
      console.log("The my subscriptions - ", mySub);
      if (mySub.status === "success") {
        // let subs = mySub.data.map((sub) => {
        //   if (sub.name === "HappiLIFE Screening") {
        //     return { ...sub, screen: "HappiLIFE" };
        //   } else if (sub.name === "HappiLIFE Summary Reading") {
        //     return { ...sub, screen: "HappiLEARN" };
        //   } else if (sub.name === "HappiBUDDY") {
        //     return { ...sub, screen: "HappiBuddyConnect" };
        //   } else {
        //     return { ...sub, screen: "" };
        //   }
        // });

        let subs = subscriptions.map((sub) => {
          if (mySub.data.find((s) => s.name == sub.name)) {
            if (sub.name === "HappiLIFE Summary Reading") {
              return {
                ...sub,
                name: "HappiLEARN",
                screen: "HappiLEARN",
                subscribed: true,
              };
            } else if (sub.name.includes("HappiLIFE")) {
              return { ...sub, screen: "HappiLIFE", subscribed: true };
            } else if (sub.name.includes("HappiVOICE")) {
              return { ...sub, screen: "HappiVoice", subscribed: true };
            } else if (sub.name === "HappiBUDDY") {
              return { ...sub, screen: "HappiBuddyConnect", subscribed: true };
            } else if (sub.name === "HappiSELF") {
              return { ...sub, screen: "HappiSELFTab", subscribed: true };
            } else if(sub.name === 'HappiTALK'){
              return { ...sub}
            } else if(sub.name === 'HappiGUIDE'){
              return { ...sub}
            } else {
              return { ...sub, screen: "" };
            }
          }

          return { ...sub };
        });
        subs = subs.map((sub) => {
          if (sub.name === "HappiLIFE Summary Reading") {
            return {
              ...sub,
              name: "HappiLEARN",
            };
          } else {
            return sub;
          }
        });
        console.log("heck teh subscriptio hher - ", subs);
        setSubscribed(subs);
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
        <View style={styles.bodyContainer}>
          {subscribed.length
            ? subscribed.map((subscription, index) => (
                <View>
                  <SubscriptionCard
                    navigation={navigation}
                    subscription={subscription}
                  />

                  <View style={{ height: hp(2) }} />
                </View>
              ))
            : null}
        </View>

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

export default ExploreServices;
