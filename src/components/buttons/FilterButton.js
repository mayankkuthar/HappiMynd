import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";

// Constants
import { colors } from "../../assets/constants";

const FilterButton = (props) => {
  // Prop Destructuring
  const {
    navigation,
    notification = false,
    onPress = () => navigation.push("Filters"),
  } = props;

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.container}
        onPress={onPress}
      >
        <Ionicons
          name="md-filter-sharp"
          size={hp(2.5)}
          color={colors.pageTitle}
        />
      </TouchableOpacity>
      {notification ? <View style={styles.activeDot} /> : null}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.borderDim,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    height: hp(5),
    paddingHorizontal: hp(1),
  },
  activeDot: {
    backgroundColor: "#ED5053",
    height: hp(1),
    width: hp(1),
    borderRadius: hp(100),
    position: "absolute",
    right: 0,
    top: -hp(0.2),
  },
});

export default FilterButton;
