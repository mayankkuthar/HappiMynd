import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";

const SubscriptionCard = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  const {
    
    name = "",
    description = "",
    screen = "",
    subscribed = false,
  } = props.subscription;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>

      {/* Sized Box */}
      <View style={{ height: hp(1) }} />

      <Text style={styles.description}>{description}</Text>

      {/* Sized Box */}
      <View style={{ height: hp(1) }} />

      <Text style={{ ...styles.purchaseDetail, opacity: 0 }}>
        1 year purchased
      </Text>

      <TouchableOpacity
        style={styles.detailButton}
        activeOpacity={0.7}
        onPress={() => {
          console.log("check the subscripiton screen - ", screen);
          screen && navigation.navigate(screen, { isSubscribed: subscribed });
        }}
      >
        <Text style={styles.detailButtonText}>See Details</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFFFF",
    paddingHorizontal: hp(2),
    paddingVertical: hp(3),
    borderRadius: 6,
    position: "relative",
  },
  title: {
    fontSize: RFValue(16),
    fontFamily: "PoppinsSemiBold",
  },
  description: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    textAlign: "justify",
  },
  purchaseDetail: {
    fontSize: RFValue(11),
    fontFamily: "PoppinsSemiBold",
  },
  detailButton: {
    backgroundColor: "#062641",
    width: wp(40),
    paddingVertical: hp(0.7),
    borderTopLeftRadius: 20,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  detailButtonText: {
    color: "#FAFFFF",
    fontSize: RFValue(13),
    fontFamily: "PoppinsSemiBold",
    textAlign: "center",
  },
});

export default SubscriptionCard;
