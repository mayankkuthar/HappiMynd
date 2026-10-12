import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CountryPicker } from "react-native-country-codes-picker";

import InputField from "../../components/input/InputField";
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

const Login = (props) => {
  const {
    authDispatch,
    userLogin,
    snackDispatch,
    sendLoginOTP,
    verifyLoginOTP,
  } = useContext(Hcontext);

  const { navigation } = props;

  const [activeTab, setActiveTab] = useState("phone");

  const [countryCode, setCountryCode] = useState("+91");
  const [countryCodeIso, setCountryCodeIso] = useState("IN");
  const [showCountry, setShowCountry] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [otpValid, setOtpValid] = useState(false);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const COOLDOWN_SECONDS = 30;
  const [cooldown, setCooldown] = useState(0);

  const formatCountdown = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      sec % 60
    ).padStart(2, "0")}`;

  const isPhoneValid = mobile.length === 10;
  const isOtpValidLength = otp.length === 6;
  const canSend = isPhoneValid && !otpSent;
  const canSubmit = isPhoneValid && otpSent && isOtpValidLength;
  const canPasswordLogin = userName.length > 0 && password.length > 0;

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

  const sendOtpHandler = async () => {
    if (!mobile || mobile.length < 10) {
      return snackDispatch({
        type: "SHOW_SNACK",
        payload: "Please enter a valid phone number",
      });
    }
    setSendOtpLoading(true);
    const res = await sendLoginOTP({ type: "mobile", mobile, country_code: countryCode.replace("+", "") });
    if (res?.status === "success") {
      setOtpSent(true);
      setOtp("");
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

  const loginWithOtpHandler = async () => {
    if (!otp || otp.length < 4) {
      return snackDispatch({
        type: "SHOW_SNACK",
        payload: "Please enter the OTP",
      });
    }
    setVerifyOtpLoading(true);
    const res = await verifyLoginOTP({ mobile, otp, country_code: countryCode.replace("+", "") });
    if (res?.access_token) {
      await AsyncStorage.setItem("USER", JSON.stringify(res));
      authDispatch({ type: "LOGIN", payload: res });
    } else if (res?.status === "register" && res?.mobile_verified_token) {
      navigation.replace("GettingStarted", {
        country_code: countryCode,
        mobile,
        mobile_verified_token: res.mobile_verified_token,
      });
    } else {
      snackDispatch({
        type: "SHOW_SNACK",
        payload: res?.message || "Verification failed",
      });
    }
    setVerifyOtpLoading(false);
  };

  const loginHandler = async () => {
    setLoading(true);
    try {
      if (!userName || !password) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Please enter login details.",
        });
      }

      const userRes = await userLogin({ username: userName, password });

      if (userRes.status === "error") {
        setLoading(false);
        return snackDispatch({ type: "SHOW_SNACK", payload: userRes.message });
      }

      await AsyncStorage.setItem("USER", JSON.stringify(userRes));

      if (userRes) {
        authDispatch({ type: "LOGIN", payload: userRes });
      }
    } catch (err) {
      console.log("Login error - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground
          source={require("../../assets/images/login_head.png")}
          style={styles.loginHeadContainer}
          resizeMode="cover"
        >
          <ImageBackground
            source={require("../../assets/images/login_head_mask.png")}
            style={styles.loginHeadMask}
            resizeMode="cover"
          >
            <View style={styles.loginImagesContainer}>
              <Image
                source={require("../../assets/images/login_key.png")}
                style={styles.loginGirl}
                resizeMode="contain"
              />
              <Image
                source={require("../../assets/images/happimynd_logo.png")}
                style={styles.loginLogo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.loginHeadTitle}>
              <Text style={styles.loginHeadTitleText}>Be Happi !!</Text>
            </View>
          </ImageBackground>
        </ImageBackground>

        <View style={styles.loginBodyContainer}>
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "phone" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("phone")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "phone" && styles.activeTabText,
                ]}
              >
                Login with{"\n"}OTP
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "password" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("password")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "password" && styles.activeTabText,
                ]}
              >
                Login with{"\n"}Password
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "phone" ? (
            <View style={styles.phoneTabContent}>
              <Text style={styles.inputLabel}>Mobile number</Text>
              <View style={styles.phoneInputBox}>
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
                  placeholder="Enter Mobile Number"
                  placeholderTextColor="#B3B3B3"
                  value={mobile}
                  onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, ""))}
                  style={styles.phoneInput}
                />
              </View>

              {otpSent ? (
                <>
                  <View style={{ height: hp(2) }} />
                  <View style={styles.otpBox}>
                    <TextInput
                      keyboardType="number-pad"
                      maxLength={6}
                      placeholder="Enter OTP"
                      value={otp}
                      onChangeText={(text) =>
                        setOtp(text.replace(/[^0-9]/g, ""))
                      }
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
              ) : null}

              <View style={{ flex: 1 }} />

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.continueButton,
                  canSend || canSubmit
                    ? styles.continueButtonEnabled
                    : styles.continueButtonDisabled,
                ]}
                disabled={
                  (!canSend && !canSubmit) || sendOtpLoading || verifyOtpLoading
                }
                onPress={otpSent ? loginWithOtpHandler : sendOtpHandler}
              >
                {sendOtpLoading || verifyOtpLoading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text
                    style={[
                      styles.continueButtonText,
                      canSend || canSubmit
                        ? styles.continueTextEnabled
                        : styles.continueTextDisabled,
                    ]}
                  >
                    {otpSent ? "Login with OTP" : "Continue"}
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginNewUserContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.push("GettingStarted")}
                  style={{ paddingVertical: 10, paddingHorizontal: 20 }}
                >
                  <Text style={styles.loginNewUserContainerText}>
                    New to HappiMynd ?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.passwordTabContent}>
              <InputField
                title="User Name"
                placeHolder="Enter User Name"
                placeholderTextColor="#B3B3B3"
                borderColor="#D4D4D4"
                value={userName}
                onChangeText={(text) => setUserName(text)}
              />
              <View style={{ height: hp(1.5) }} />
              <InputField
                title="Password"
                placeHolder="Enter Password"
                placeholderTextColor="#B3B3B3"
                borderColor="#D4D4D4"
                iconColor="#999999"
                password
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <View style={{ height: hp(1.5) }} />

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.push("ForgotPassword")}
              >
                <Text style={styles.loginForgotText}>Forgot Password ?</Text>
              </TouchableOpacity>
              <View style={{ height: hp(2) }} />

              <View style={{ flex: 1 }} />

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.continueButton,
                  canPasswordLogin
                    ? styles.continueButtonEnabled
                    : styles.continueButtonDisabled,
                ]}
                disabled={!canPasswordLogin || loading}
                onPress={loginHandler}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text
                    style={[
                      styles.continueButtonText,
                      canPasswordLogin
                        ? styles.continueTextEnabled
                        : styles.continueTextDisabled,
                    ]}
                  >
                    Log In
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginNewUserContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.push("GettingStarted")}
                  style={{ paddingVertical: 10, paddingHorizontal: 20 }}
                >
                  <Text style={styles.loginNewUserContainerText}>
                    New to HappiMynd ?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loginHeadContainer: { width: wp(100), height: hp(40) },
  loginHeadMask: { width: wp(100), height: hp(40) },
  loginImagesContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    paddingTop: hp(8),
    paddingHorizontal: wp(8),
  },
  loginGirl: { width: wp(40), height: hp(20), marginTop: hp(5) },
  loginLogo: {
    width: wp(20),
    height: hp(9),
    alignSelf: "flex-start",
  },
  loginHeadTitle: { paddingHorizontal: 16, top: 4 },
  loginHeadTitleText: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsBold",
  },
  loginBodyContainer: {
    width: wp(100),
    paddingHorizontal: 16,
    paddingTop: hp(2),
    flex: 1,
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: hp(1.5),
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryText,
  },
  tabText: {
    fontSize: RFValue(14),
    fontFamily: "Poppins",
    color: "#999",
    textAlign: "center",
  },
  activeTabText: {
    color: colors.primaryText,
    fontFamily: "PoppinsSemiBold",
  },
  phoneTabContent: { paddingTop: hp(3), flex: 1, paddingBottom: hp(3) },
  passwordTabContent: { paddingTop: hp(3), flex: 1, paddingBottom: hp(3) },
  inputLabel: {
    fontSize: RFValue(13),
    fontFamily: "PoppinsMedium",
    color: "#191928",
    marginBottom: hp(1),
  },
  phoneInputBox: {
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
  phoneInput: {
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#191928",
    paddingVertical: 0,
    paddingLeft: 7,
    letterSpacing: 1,
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
  continueButton: {
    width: "100%",
    height: hp(5),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    marginTop: hp(2),
  },
  continueButtonDisabled: {
    backgroundColor: "#E6DFFF",
  },
  continueButtonEnabled: {
    backgroundColor: "#E6DFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 4,
  },
  continueButtonText: {
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(14),
  },
  continueTextDisabled: { color: "#A0A0A0" },
  continueTextEnabled: { color: "#000" },
  loginForgotText: {
    alignSelf: "flex-end",
    color: "#999999",
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(11),
  },
  loginNewUserContainer: {
    paddingBottom: hp(1),
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: hp(1.5),
  },
  loginNewUserContainerText: {
    fontFamily: "Poppins",
    fontSize: RFValue(13),
    color: "#895BF5",
  },
});

export default Login;
