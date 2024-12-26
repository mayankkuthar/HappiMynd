import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";

const OutlineButton = (props) => {
  // Prop Destructuring
  const { text = "Outline", pressHandler = () => {}, loading = false } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={pressHandler}
      style={styles.buttonContainer}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.loaderColor} />
      ) : (
        <Text style={styles.buttonText}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.background,
    borderColor: colors.borderDark,
    borderWidth: 1,
    height: hp(6),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: hp(50),
  },
  buttonText: {
    color: "#000",
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(13),
  },
});

export default OutlineButton;
