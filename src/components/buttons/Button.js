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

const Button = (props) => {
  // Prop Destructuring
  const {
    text = "Button",
    pressHandler,
    loading = false,
    disabled = false,
  } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={pressHandler}
      style={{ ...styles.buttonContainer, opacity: disabled ? 0.5 : 1 }}
      disabled={loading || disabled}
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
    backgroundColor: colors.primary,
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

export default Button;
