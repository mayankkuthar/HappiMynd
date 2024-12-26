import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";

const SendEmailOtp = (props) => {
  // Prop Destructuring
  const {
    value = "",
    setValue = () => {},
    otpHandler = () => {},
    loading = false,
  } = props;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          ...styles.input,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* Sized Box */}
        <View style={{ width: wp(2) }} />
        <TextInput
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="Enter email address"
          value={value}
          onChangeText={(text) => setValue(text)}
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.otpButton}
        disabled={loading}
        onPress={otpHandler}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.otpButtonText}>Send OTP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SendEmailOtp;

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
  otpButton: {
    backgroundColor: colors.primaryText,
    borderRadius: hp(10),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: hp(1),
    marginLeft: hp(1),
  },
  otpButtonText: {
    fontSize: RFValue(8),
    fontFamily: "Poppins",
    color: "#fff",
  },
});
