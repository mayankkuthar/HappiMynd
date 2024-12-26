import React, { useState, useEffect, useContext } from "react";
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

// Components
import SendPhoneOtp from "../input/SendPhoneOtp";
import SendEmailOtp from "../input/SendEmailOtp";
import VerifyOtp from "../input/VerifyOtp";

// Context
import { Hcontext } from "../../context/Hcontext";
import { colors } from "../../assets/constants";

const ParentOtp = (props) => {
  // Prop Destructuring
  const { otpVerified = false, setOtpVerified = () => {} } = props;

  // Context Variables
  const { guardianVerification, verifyGuardianOtp, snackDispatch } =
    useContext(Hcontext);

  // State Variables
  const [parentNumber, setParentNumber] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  useEffect(() => {
    if (otp) otpVerificationHandler();
  }, [otp]);

  const otpSendHandler = async (type) => {
    setOtpLoading(true);
    try {
      const id = Date.now();
      setUniqueId(id);
      const otpRes = await guardianVerification({
        type,
        uniqueId: id,
        email: parentEmail,
        mobile: parentNumber,
      });
      snackDispatch({ type: "SHOW_SNACK", payload: otpRes.message });
    } catch (err) {
      console.log("Some issue while sending otp (Register.js) - ", err);
    }
    setOtpLoading(false);
  };

  const otpVerificationHandler = async () => {
    try {
      const verifyRes = await verifyGuardianOtp({ uniqueId, otp });
      console.log("chekc the otp res - ", verifyRes);
      if (verifyRes.status === "success") setOtpVerified(true);
      else setOtpVerified(false);
    } catch (err) {
      console.log("Some issue while verifying guardian otp - ", err);
    }
  };

  return (
    <>
      <View style={styles.boxContainer}>
        {!parentEmail && (
          <>
            <Text style={styles.formText}>Parent Contact Number</Text>
            <SendPhoneOtp
              value={parentNumber}
              setValue={setParentNumber}
              otpHandler={() => otpSendHandler("mobile")}
              loading={otpLoading}
            />
            <View style={{ height: hp(1.5) }} />

            {!parentNumber && (
              <>
                <Text style={styles.dividerText}>OR</Text>
              </>
            )}
          </>
        )}

        {!parentNumber && (
          <>
            <Text style={styles.formText}>Parent Email</Text>
            <SendEmailOtp
              value={parentEmail}
              setValue={setParentEmail}
              otpHandler={() => otpSendHandler("email")}
              loading={otpLoading}
            />
          </>
        )}
      </View>

      <View style={{ height: hp(1.5) }} />

      <>
        <Text style={styles.formText}>Enter OTP</Text>
        <VerifyOtp value={otp} setValue={setOtp} valid={otpVerified} />
        <View style={{ height: hp(1.5) }} />
      </>
    </>
  );
};

export default ParentOtp;

const styles = StyleSheet.create({
  boxContainer: {
    borderWidth: 1,
    borderColor: colors.borderDim,
    padding: hp(2),
    borderRadius: hp(2),
  },
  formText: {
    fontSize: RFValue(12),
    color: "#758080",
    fontFamily: "Poppins",
    paddingBottom: 4,
  },
  dividerText: {
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(10),
    textAlign: "center",
  },
});
