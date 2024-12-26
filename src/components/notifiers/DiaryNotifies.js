import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Feather, AntDesign, Ionicons, Foundation } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

// Context
import { Hcontext } from "../../context/Hcontext";
import { colors } from "../../assets/constants";

// Static HappiDIARY Messages
const HAPPILIFE_ASSESSMENT = "You have pending HappiLIFE assessment";
const HAPPILIFE_ASSESSMENT_DOWNLOAD =
  "Subscribe or verify to get HappiLIFE assessment report";
const HAPPIGUIDE = "Try summary illustration by HappiGUIDE";
const HAPPILEARN = "Try exclusive content with HappiLEARN";
const HAPPIBUDDY = "Try reaching out to our experts by HappiBUDDY";
const HAPPISELF = "Try interactive questions with HappiSELF";
const HAPPITALK = "Try video calling using HappiTALK";

const DiaryNotifies = (props) => {
  // Prop Destructuring
  const {
    navigation = null,
    isSubscribed = false,
    isPhoneVerified = false,
    isEmailVerified = false,
  } = props;

  // Context Variables
  const { authState, getSubscriptions } = useContext(Hcontext);

  // State Variables
  const [message, setMessage] = useState("");
  const [sessionCount, setSessionCount] = useState(0);

  //   // Hits when focus hits
  useFocusEffect(
    useCallback(() => {
      console.log("CHeck Subscriptions - ", props);
      if (!authState.isScreeningComplete) setMessage(HAPPILIFE_ASSESSMENT);
      else if (!isSubscribed && !isEmailVerified && !isPhoneVerified)
        setMessage(HAPPILIFE_ASSESSMENT_DOWNLOAD);
      else {
        nextToolHandler();
      }

      return () => {
        setMessage("");
      };
    }, [authState, isSubscribed, isEmailVerified, isPhoneVerified])
  );

  const nextToolHandler = async () => {
    try {
      const subscriptions = await getSubscriptions();
      console.log("CHeck Subscriptions - ", subscriptions);
      if (subscriptions.status === "success") {
        const happiGuide = subscriptions.data.find((subscription) =>
          subscription.name.includes("HappiGUIDE")
        );
        const happiLearn = subscriptions.data.find((subscription) =>
          subscription.name.includes("HappiLEARN")
        );
        const happiBuddy = subscriptions.data.find((subscription) =>
          subscription.name.includes("HappiBUDDY")
        );
        const happiSelf = subscriptions.data.find((subscription) =>
          subscription.name.includes("HappiSELF")
        );
        const happiTalk = subscriptions.data.find((subscription) =>
          subscription.name.includes("HappiTALK")
        );

        if (false) {
        }
        // else if (!happiGuide) setMessage(HAPPIGUIDE);
        else if (!happiLearn) setMessage(HAPPILEARN);
        else if (!happiBuddy) setMessage(HAPPIBUDDY);
        else if (!happiSelf) setMessage(HAPPISELF);
        // else if (!happiTalk) setMessage(HAPPITALK);
        else setMessage("");
      }
    } catch (err) {
      console.log(
        "Some issue while suggesting next tool (DiaryNotifies.js) - ",
        err
      );
    }
  };

  return (
    <TouchableOpacity
      style={{ display: !message ? "none" : "flex" }}
      activeOpacity={0.7}
      // style={{ display: assignedPsy ? "block" : "none" }}
      //   onPress={() => {
      //     navigation.push("ManageBookings");
      //   }}
    >
      <ImageBackground
        source={require("../../assets/images/session_background.png")}
        resizeMode="cover"
        style={styles.messageContainer}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: wp(1.5),
          }}
        >
          <Text style={styles.messageText}>{message}</Text>
          <Foundation name="lightbulb" size={hp(3.3)} color="#749695" />
        </View>
        {sessionCount > 0 ? (
          <View style={styles.unreadContainer}>
            <Text
              style={{
                fontSize: RFValue(12),
                fontFamily: "PoppinsMedium",
                color: "#fff",
              }}
            >
              {sessionCount}
            </Text>
          </View>
        ) : null}
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default DiaryNotifies;

const styles = StyleSheet.create({
  messageContainer: {
    // backgroundColor: "red",
    backgroundColor: colors.background,
    height: hp(8),
    width: wp(90),
    alignSelf: "center",
    borderRadius: hp(4),
    // alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(6),
    marginBottom: hp(2),
  },
  messageText: {
    // backgroundColor: "yellow",
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    width: wp(65),
  },
  unreadContainer: {
    position: "absolute",
    backgroundColor: "red",
    top: -hp(1),
    right: -hp(1),
    height: hp(3),
    width: hp(3),
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: hp(1),
    // paddingVertical: hp(0.5),
    borderRadius: hp(100),
  },
});
