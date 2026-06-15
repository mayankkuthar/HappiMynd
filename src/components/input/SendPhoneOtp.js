import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { CountryPicker } from "react-native-country-codes-picker";

import { colors } from "../../assets/constants";

const SendPhoneOtp = (props) => {
  const {
    value = "",
    setValue = () => {},
    otpHandler = () => {},
    loading = false,
    countryCode = "+91",
    setCountryCode = () => {},
    cooldown = 0,
  } = props;

  const [show, setShow] = useState(false);

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
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShow(true)}
          disabled={cooldown > 0}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingRight: wp(1),
          }}
        >
          <Text style={{ fontSize: RFValue(10), fontFamily: "Poppins" }}>
            {countryCode}
          </Text>
          <Image
            source={require("../../assets/images/downArrow.png")}
            style={{ height: 12, width: 12, marginLeft: 3, tintColor: "grey" }}
          />
        </TouchableOpacity>

        <CountryPicker
          show={show}
          initialState={countryCode}
          pickerButtonOnPress={(item) => {
            setCountryCode(item.dial_code);
            setShow(false);
          }}
          onBackdropPress={() => setShow(false)}
          style={{ modal: { height: 400 } }}
        />

        <TextInput
          keyboardType="number-pad"
          placeholder="Enter phone number"
          value={value}
          onChangeText={(text) => setValue(text)}
          style={{ flex: 1, fontSize: RFValue(12) }}
        />
      </View>
      <TouchableOpacity
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect={false}
        activeOpacity={0.7}
        style={styles.otpButton}
        disabled={loading || cooldown > 0}
        onPress={otpHandler}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : cooldown > 0 ? (
          <Text style={styles.otpButtonText}>Resend in {String(Math.floor(cooldown / 60)).padStart(2, '0')}:{String(cooldown % 60).padStart(2, '0')}</Text>
        ) : (
          <Text style={styles.otpButtonText}>Send OTP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SendPhoneOtp;

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
