import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
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

const SessionNotifies = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { myBookingUsers } = useContext(Hcontext);

  // State Variables
  const [sessionCount, setSessionCount] = useState(0);

  // Hits when focus hits
  useFocusEffect(
    useCallback(() => {
      checkUpcomingTalkSession("today");
      return () => {};
    }, [])
  );

  const checkUpcomingTalkSession = async (bookingType) => {
    try {
      const fetchedSessions = await myBookingUsers({ bookingType });

      if (fetchedSessions.status === "success") {
        setSessionCount(fetchedSessions?.session_detail?.length);
      }
    } catch (err) {
      console.log(
        "Some issue while checkng upcoming talk session (Home.js) - ",
        err
      );
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{ display: sessionCount ? "flex" : "none" }}
      onPress={() => {
        navigation.push("ManageBookings");
      }}
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
          <Text style={styles.messageText}>Continue HappiTALK Session</Text>
          <AntDesign name="videocamera" size={hp(3.3)} color="#749695" />
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

export default SessionNotifies;

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
