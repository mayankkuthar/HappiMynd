import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// COnstants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
import InputField from "../../components/input/InputField";
import Button from "../../components/buttons/Button";

const VerificationCode = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { snackDispatch, verifyOtp, forgotPassword } = useContext(Hcontext);

  // State Variables
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Mounting
  useEffect(() => {
    console.log("The Verification code screen mount - ", props.route.params);
  }, []);

  const submitHandler = async () => {
    setLoading(true);
    try {
      if (!otp) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Please enter OTP !",
        });
      }

      const { email, mobile } = props.route.params;
      const otpRes = await verifyOtp({ email, mobile, otp });

      snackDispatch({ type: "SHOW_SNACK", payload: otpRes.message });

      if (otpRes.status === "success") {
        navigation.push("ResetPassword", { email, mobile });
      }
    } catch (err) {
      console.log("Some issue while Verify Code - ", err);
    }
    setLoading(false);
  };

  const resendCodeHandler = async () => {
    setLoading(true);
    try {
      const { email, mobile } = props.route.params;

      const otpRes = await forgotPassword({ email, mobile });

      snackDispatch({ type: "SHOW_SNACK", payload: otpRes.message });
    } catch (err) {
      console.log("Some issue while resending code - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} showLogo={false} showBack={true} />
      <KeyboardAwareScrollView style={{ paddingHorizontal: wp(10) }}>
        <Text style={styles.pageTitle}>Verification Code</Text>
        {/* Sized Box */}
        <View style={{ height: hp(4) }} />
        <InputField
          title="Enter the Verification Code"
          placeHolder="Enter the Verification Code"
          keyboardType="numeric"
          value={otp}
          onChangeText={(text) => setOtp(text)}
        />
        {/* Sized Box */}
        <View style={{ height: hp(2) }} />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.resendButton}
          onPress={resendCodeHandler}
        >
          <Text style={styles.resendButtonText}>Resend Code</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
      <View style={styles.buttonContainer}>
        <Button
          text="Continue"
          loading={loading}
          pressHandler={submitHandler}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E3FDFE",
    flex: 1,
  },
  pageTitle: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  choiceText: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    color: "#ABB6B6",
    textAlign: "center",
  },
  buttonContainer: {
    // backgroundColor: "red",
    width: wp(100),
    paddingHorizontal: wp(10),
    position: "absolute",
    bottom: hp(4),
  },
  resendButton: {
    // backgroundColor: "red",
  },
  resendButtonText: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    color: colors.pageTitle,
    textAlign: "center",
  },
});

export default VerificationCode;
