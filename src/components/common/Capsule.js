import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";

const Capsule = (props) => {
  // Prop Destructuring
  const { title = "" } = props;

  return (
    <View style={styles.capsuleContainer}>
      <Text style={styles.capsuleContainerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  capsuleContainer: {
    backgroundColor: "transparent",
    height: hp(3),
    // width: wp(14),
    paddingHorizontal: hp(2),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    alignItems: "center",
    justifyContent: "center",
  },
  capsuleContainerText: {
    fontSize: RFValue(8),
    fontFamily: "PoppinsMedium",
    textAlign: "center",
    color: colors.primaryText,
  },
});

export default Capsule;
