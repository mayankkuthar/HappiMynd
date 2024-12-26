import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import moment from "moment";

// Constants
import { colors } from "../../assets/constants";

const NotificationCard = (props) => {
  // Prop Destructuring
  const { id = "", message = "", created_at = "", read = 0 } = props.data;

  const readNotificationhandler = (id) => {};

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.container}
      onPress={() => readNotificationhandler(id)}
    >
      {/* Action Dot Section */}
      <View>
        {/* Sized Box */}
        <View style={{ height: hp(0.5) }} />

        <View
          style={{
            ...styles.activeDot,
            backgroundColor: read ? colors.pageTitle : "#C6C6C6",
          }}
        />
      </View>

      {/* Sized Box */}
      <View style={{ width: wp(4) }} />

      {/* Notification Text Section */}
      <View
        style={{
          justifyContent: "space-between",
          width: wp(66),
        }}
      >
        <Text style={styles.notificationText}>{message}</Text>
        <Text style={styles.notificationTime}>
          {moment(created_at).format("hh:mm A")}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7FCFC",
    height: hp(12),
    width: wp(80),
    borderRadius: 10,
    paddingVertical: hp(1.5),
    paddingHorizontal: hp(2),
    flexDirection: "row",
    shadowColor: colors.borderLight,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: hp(1.5),
    // elevation: 10,
  },
  activeDot: {
    width: hp(1),
    height: hp(1),
    backgroundColor: colors.pageTitle,
    borderRadius: hp(100),
  },
  notificationText: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
    color: "#414141",
    textAlign: "justify",
  },
  notificationTime: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
    color: "#AFAFAF",
  },
});

export default NotificationCard;
