import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

// Constants
import { colors } from "../../assets/constants";

const VerifyOtp = (props) => {
  // Prop Destructuring
  const { value = "", setValue = () => {}, valid = false } = props;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <TextInput
        keyboardType="number-pad"
        style={styles.input}
        placeholder="Enter phone OTP"
        value={value}
        onChangeText={(text) => setValue(text)}
      />
      <View style={{ width: wp(2) }} />
      {value ? (
        valid ? (
          <FontAwesome name="check-circle" size={hp(2.5)} color="green" />
        ) : (
          <MaterialIcons name="report-problem" size={hp(2.5)} color="red" />
        )
      ) : null}
    </View>
  );
};

export default VerifyOtp;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.borderDim,
    borderRadius: hp(0.5),
    paddingHorizontal: hp(1),
    paddingVertical: hp(1),
    fontSize: RFValue(13),
    flex: 1,
  },
});
