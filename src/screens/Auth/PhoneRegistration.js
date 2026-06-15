import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

import InputField from "../../components/input/InputField";
import DropDown from "../../components/input/DropDown";
import Checkbox from "../../components/input/Checkbox";
import Button from "../../components/buttons/Button";
import RadioButton from "../../components/buttons/RadioButton";
import SendPhoneOtp from "../../components/input/SendPhoneOtp";
import VerifyOtp from "../../components/input/VerifyOtp";
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

const PhoneRegistration = (props) => {
  const {
    sendOTP,
    verifyOtp,
    userSignup,
    snackDispatch,
    authDispatch,
    getProfileList,
  } = useContext(Hcontext);

  const { navigation, route } = props;
  const signupType = route?.params?.signupType || "individual";
  const mobileVerifiedToken = route?.params?.mobile_verified_token;

  const [step, setStep] = useState(mobileVerifiedToken ? 3 : 1);
  const [countryCode, setCountryCode] = useState(route?.params?.country_code || "+91");
  const [mobile, setMobile] = useState(route?.params?.mobile || "");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(mobileVerifiedToken ? true : false);
  const [otpVerified, setOtpVerified] = useState(mobileVerifiedToken ? true : false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [otpValid, setOtpValid] = useState(false);

  const COOLDOWN_SECONDS = 120;
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const [nickName, setNickName] = useState("");
  const [profileType, setProfileType] = useState([]);
  const [selectedProfileType, setSelectedProfileType] = useState({});
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    fetchProfileList();
  }, []);

  const fetchProfileList = async () => {
    try {
      const res = await getProfileList();
      setProfileType(res.data);
    } catch (err) {
      console.log("Profile list error:", err);
    }
  };

  const sendOtpHandler = async () => {
    if (!mobile || mobile.length < 10) {
      return snackDispatch({
        type: "SHOW_SNACK",
        payload: "Please enter a valid phone number",
      });
    }
    setSendOtpLoading(true);
    const res = await sendOTP({ type: "mobile", mobile, country_code: countryCode.replace("+", "") });
    if (res?.status === "success") {
      setOtpSent(true);
      setStep(2);
      setCooldown(COOLDOWN_SECONDS);
      snackDispatch({ type: "SHOW_SNACK", payload: "OTP sent to your phone" });
    } else {
      snackDispatch({
        type: "SHOW_SNACK",
        payload: res?.message || "Failed to send OTP",
      });
    }
    setSendOtpLoading(false);
  };

  const verifyOtpHandler = async () => {
    if (!otp || otp.length < 4) {
      return snackDispatch({
        type: "SHOW_SNACK",
        payload: "Please enter the OTP",
      });
    }
    setVerifyOtpLoading(true);
    const res = await verifyOtp({ mobile, otp });
    if (res?.status === "success") {
      setOtpVerified(true);
      setStep(3);
      snackDispatch({
        type: "SHOW_SNACK",
        payload: "Phone verified! Complete your profile",
      });
    } else {
      snackDispatch({
        type: "SHOW_SNACK",
        payload: res?.message || "Invalid OTP",
      });
    }
    setVerifyOtpLoading(false);
  };

  const registerHandler = async () => {
    if (!nickName || !userName || !password || !confirmPassword) {
      return snackDispatch({
        type: "SHOW_SNACK",
        payload: "Please fill all required fields",
      });
    }
    if (password !== confirmPassword) {
      return snackDispatch({
        type: "SHOW_SNACK",
        payload: "Password mismatch",
      });
    }
    if (password.length < 6) {
      return snackDispatch({
        type: "SHOW_SNACK",
        payload: "Password must be at least 6 characters",
      });
    }
    if (!agreeTerms) {
      return snackDispatch({
        type: "SHOW_SNACK",
        payload: "Please agree to terms and conditions",
      });
    }

    setRegisterLoading(true);
    let genderText = "";
    if (gender === "M") genderText = "male";
    else if (gender === "F") genderText = "female";
    else if (gender === "O") genderText = "other";

    const dataToSend = {
      nickName,
      selectedProfileType: selectedProfileType?.id,
      age: age ? Number(age) : null,
      gender: genderText,
      userName,
      password,
      confirmPassword,
      country_code: countryCode.replace("+", ""),
      mobile,
      signupType,
      language: 1,
      mobile_verified_token: mobileVerifiedToken,
    };

    const res = await userSignup(dataToSend);
    if (res?.status === "success" && res?.access_token) {
      await AsyncStorage.setItem("USER", JSON.stringify(res));
      authDispatch({ type: "LOGIN", payload: res });
    } else {
      snackDispatch({
        type: "SHOW_SNACK",
        payload: res?.message || "Registration failed",
      });
    }
    setRegisterLoading(false);
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <ImageBackground
          source={require("../../assets/images/register_background.png")}
          style={styles.headerBg}
          resizeMode="cover"
        >
          <ImageBackground
            source={require("../../assets/images/register_mask.png")}
            style={styles.headerMask}
            resizeMode="cover"
          >
            <View style={styles.headerImages}>
              <Image
                source={require("../../assets/images/register_boy.png")}
                style={styles.headerImage}
                resizeMode="contain"
              />
              <Image
                source={require("../../assets/images/happimynd_logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Be Happi!!</Text>
              <Text style={styles.subtitle}>
                {step === 1
                  ? "Verify your phone"
                  : step === 2
                  ? "Enter OTP"
                  : "Complete registration"}
              </Text>
            </View>
          </ImageBackground>
        </ImageBackground>

        <View style={styles.formContainer}>
          {step === 1 && (
            <>
              <Text style={styles.sectionTitle}>Enter Phone Number</Text>
              <SendPhoneOtp
                value={mobile}
                setValue={setMobile}
                otpHandler={sendOtpHandler}
                loading={sendOtpLoading}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                cooldown={cooldown}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.sectionTitle}>Verify OTP</Text>
              <Text style={styles.phoneDisplay}>
                OTP sent to {countryCode} {mobile}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setStep(1);
                  setOtpSent(false);
                }}
              >
                <Text style={styles.changeLink}>Change number</Text>
              </TouchableOpacity>
              <View style={{ height: hp(2) }} />
              <VerifyOtp value={otp} setValue={setOtp} valid={otpValid} />
              <View style={{ height: hp(3) }} />
              <Button
                text="Verify OTP"
                pressHandler={verifyOtpHandler}
                loading={verifyOtpLoading}
              />
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.sectionTitle}>Create Your Account</Text>
              <Text style={styles.phoneDisplay}>
                Phone: {countryCode} {mobile}
              </Text>
              <View style={{ height: hp(2) }} />

              <InputField
                title="Nick Name"
                placeHolder="Enter Nick Name"
                value={nickName}
                onChangeText={setNickName}
              />
              <View style={{ height: hp(1.5) }} />

              <DropDown
                title="Profile Type"
                placeHolder="Select profile type"
                data={profileType}
                setSelectedData={setSelectedProfileType}
              />
              <View style={{ height: hp(1.5) }} />

              <InputField
                title="Age (optional)"
                placeHolder="Enter your age"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
              />
              <View style={{ height: hp(1.5) }} />

              <Text style={styles.formLabel}>Gender (optional)</Text>
              <View style={styles.genderRow}>
                <RadioButton
                  size={14}
                  innerColor={colors.primaryText}
                  outerColor={colors.primaryText}
                  isSelected={gender === "M"}
                  onPress={() => setGender("M")}
                />
                <Text
                  style={[
                    styles.genderText,
                    gender === "M" && styles.genderSelected,
                  ]}
                >
                  Male
                </Text>
                <View style={{ width: wp(8) }} />
                <RadioButton
                  size={14}
                  innerColor={colors.primaryText}
                  outerColor={colors.primaryText}
                  isSelected={gender === "F"}
                  onPress={() => setGender("F")}
                />
                <Text
                  style={[
                    styles.genderText,
                    gender === "F" && styles.genderSelected,
                  ]}
                >
                  Female
                </Text>
                <View style={{ width: wp(8) }} />
                <RadioButton
                  size={14}
                  innerColor={colors.primaryText}
                  outerColor={colors.primaryText}
                  isSelected={gender === "O"}
                  onPress={() => setGender("O")}
                />
                <Text
                  style={[
                    styles.genderText,
                    gender === "O" && styles.genderSelected,
                  ]}
                >
                  Other
                </Text>
              </View>

              <InputField
                title="Username"
                placeHolder="Enter username"
                value={userName}
                onChangeText={setUserName}
              />
              <View style={{ height: hp(1.5) }} />

              <InputField
                title="Password"
                placeHolder="Enter password"
                password
                value={password}
                onChangeText={setPassword}
              />
              <View style={{ height: hp(1.5) }} />

              <InputField
                title="Confirm Password"
                placeHolder="Re-enter password"
                password
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <View style={{ height: hp(1.5) }} />

              <View style={styles.termsRow}>
                <Checkbox checked={agreeTerms} setChecked={setAgreeTerms} />
                <View style={{ width: wp(2) }} />
                <Text style={styles.termsText}>
                  By creating an account, you agree to our{" "}
                  <Text
                    style={styles.linkText}
                    onPress={() =>
                      Linking.openURL("https://happimynd.com/terms")
                    }
                  >
                    Terms & Conditions
                  </Text>
                </Text>
              </View>
              <View style={{ height: hp(3) }} />

              <Button
                text="Create Account"
                pressHandler={registerHandler}
                loading={registerLoading}
              />
            </>
          )}
        </View>

        <View style={{ height: hp(6) }} />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerBg: { height: hp(50), width: wp(100) },
  headerMask: { height: hp(50), width: wp(100) },
  headerImage: { width: wp(40), height: hp(30), alignSelf: "flex-start" },
  logo: { width: wp(20), height: hp(10) },
  headerImages: {
    height: hp(25),
    width: wp(100),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(10),
  },
  headerText: {
    paddingHorizontal: wp(10),
    paddingTop: hp(2),
    height: hp(25),
    width: wp(100),
  },
  title: { fontSize: RFValue(30), fontFamily: "PoppinsBold" },
  subtitle: { fontSize: RFValue(14), fontFamily: "Poppins" },
  formContainer: { paddingHorizontal: wp(10) },
  sectionTitle: {
    fontSize: RFValue(18),
    fontFamily: "PoppinsSemiBold",
    marginVertical: hp(2),
  },
  phoneDisplay: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    color: "#555",
  },
  changeLink: {
    fontSize: RFValue(11),
    fontFamily: "PoppinsMedium",
    color: colors.primaryText,
    marginTop: hp(0.5),
  },
  formLabel: {
    fontSize: RFValue(12),
    color: "#758080",
    fontFamily: "Poppins",
    paddingBottom: 4,
  },
  genderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
  },
  genderText: { fontSize: RFValue(12), fontFamily: "Poppins", color: "#758080" },
  genderSelected: { color: colors.primaryText },
  termsRow: { flexDirection: "row", alignItems: "flex-start" },
  termsText: { fontSize: RFValue(11), fontFamily: "Poppins", flex: 1 },
  linkText: { textDecorationLine: "underline", color: colors.primaryText },
});

export default PhoneRegistration;
