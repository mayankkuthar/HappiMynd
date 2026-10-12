import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { CountryPicker } from "react-native-country-codes-picker";

// Context
import { Hcontext } from "../../context/Hcontext";

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
  const [showOtp, setShowOtp] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [countryCodeIso, setCountryCodeIso] = useState("IN");
  const [showCountry, setShowCountry] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const formatCountdown = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (otp) otpVerificationHandler();
  }, [otp]);

  const otpSendHandler = async (type) => {
    setOtpLoading(true);
    setShowOtp(true);
    setCooldown(30);
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
      console.log("Some issue while sending otp (ParentOtp.js) - ", err);
    }
    setOtpLoading(false);
  };

  const otpVerificationHandler = async () => {
    try {
      const verifyRes = await verifyGuardianOtp({ uniqueId, otp });
      console.log("check the otp res - ", verifyRes);
      if (verifyRes.status === "success") setOtpVerified(true);
      else setOtpVerified(false);
    } catch (err) {
      console.log("Some issue while verifying guardian otp - ", err);
    }
  };

  const canSendMobile = parentNumber.length === 10;
  const canSendEmail = parentEmail.length > 0;

  const renderSendButton = (enabled, onPress) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.sendOtpButton,
        enabled && styles.sendOtpButtonEnabled,
      ]}
      disabled={otpLoading || !enabled}
      onPress={onPress}
    >
      {otpLoading ? (
        <ActivityIndicator size="small" color="#A0A0A0" />
      ) : (
        <Text
          style={[
            styles.sendOtpText,
            enabled ? styles.sendOtpTextEnabled : styles.sendOtpTextDisabled,
          ]}
        >
          Send OTP
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderOtpSection = () =>
    showOtp && !otpVerified ? (
      <>
        <Text style={[styles.fieldTitle, styles.otpFieldTitle]}>Enter OTP</Text>
        <View style={styles.otpBox}>
          <TextInput
            keyboardType="number-pad"
            maxLength={6}
            placeholder="Enter OTP"
            placeholderTextColor="#B3B3B3"
            value={otp}
            onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ""))}
            style={styles.otpInput}
          />
        </View>
        <View style={styles.resendRow}>
          <Text style={styles.resendText}>
            {cooldown > 0
              ? `Resend OTP in ${formatCountdown(cooldown)}`
              : "Resend OTP"}
          </Text>
        </View>
      </>
    ) : null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Parent's Approval Required</Text>

      {!parentEmail && (
        <>
          <Text style={styles.fieldTitle}>Parent Mobile Number</Text>
          <View style={styles.mobileBox}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowCountry(true)}
              style={styles.countryCodeBtn}
            >
              <Text style={styles.countryCodeText}>
                {countryCodeIso} {countryCode}
              </Text>
            </TouchableOpacity>
            <View style={styles.codeDivider} />
            <CountryPicker
              show={showCountry}
              initialState={countryCode}
              pickerButtonOnPress={(item) => {
                setCountryCode(item.dial_code);
                setCountryCodeIso(item.code);
                setShowCountry(false);
              }}
              onBackdropPress={() => setShowCountry(false)}
              style={{ modal: { height: 400 } }}
            />
            <TextInput
              keyboardType="number-pad"
              maxLength={10}
              placeholder="Enter mobile number"
              placeholderTextColor="#B3B3B3"
              value={parentNumber}
              onChangeText={(text) =>
                setParentNumber(text.replace(/[^0-9]/g, ""))
              }
              style={styles.mobileInput}
            />
          </View>
          {renderSendButton(canSendMobile, () => otpSendHandler("mobile"))}
          {renderOtpSection()}
        </>
      )}

      {/*
      {!parentNumber && (
        <>
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          <Text style={styles.fieldTitle}>Parent Email</Text>
          <View style={styles.emailBox}>
            <TextInput
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="Enter email address"
              placeholderTextColor="#B3B3B3"
              value={parentEmail}
              onChangeText={(text) => setParentEmail(text)}
              style={styles.emailInput}
            />
          </View>
          {renderSendButton(canSendEmail, () => otpSendHandler("email"))}
          {renderOtpSection()}
        </>
      )}
      */}
    </View>
  );
};

export default ParentOtp;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D40000",
    borderRadius: 16,
    padding: hp(2),
  },
  title: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsMedium",
    color: "#D40000",
    marginBottom: hp(1),
  },
  fieldTitle: {
    fontSize: RFValue(13),
    fontFamily: "PoppinsMedium",
    color: "#191928",
    marginBottom: hp(1),
  },
  otpFieldTitle: {
    marginTop: hp(1.5),
  },
  mobileBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 8,
    paddingHorizontal: wp(3),
    height: hp(6.5),
  },
  countryCodeBtn: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  countryCodeText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#191928",
  },
  codeDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#D4D4D4",
    marginHorizontal: wp(1),
  },
  mobileInput: {
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#191928",
    paddingVertical: 0,
    paddingLeft: 7,
    letterSpacing: 1,
  },
  emailBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D8D8DE",
    borderRadius: 8,
    paddingHorizontal: wp(3),
    height: hp(6.5),
    justifyContent: "center",
  },
  emailInput: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#191928",
    paddingVertical: 0,
  },
  sendOtpButton: {
    width: "100%",
    height: hp(4.8),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8D8DE",
    marginTop: hp(1.5),
  },
  sendOtpButtonEnabled: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 4,
  },
  sendOtpText: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsMedium",
    letterSpacing: 1,
  },
  sendOtpTextEnabled: {
    color: "#000",
  },
  sendOtpTextDisabled: {
    color: "#A0A0A0",
  },
  otpBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 8,
    height: hp(6.5),
    justifyContent: "center",
    paddingHorizontal: wp(3),
  },
  otpInput: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#191928",
    paddingVertical: 0,
  },
  resendRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: hp(0.8),
  },
  resendText: {
    fontSize: RFValue(11),
    fontFamily: "Poppins",
    color: "#999999",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp(1.5),
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D8D8DE",
  },
  orText: {
    marginHorizontal: wp(3),
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    color: "#999999",
  },
});