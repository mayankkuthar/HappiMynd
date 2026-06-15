import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

import InputField from "../../components/input/InputField";
import Button from "../../components/buttons/Button";
import SendPhoneOtp from "../../components/input/SendPhoneOtp";
import VerifyOtp from "../../components/input/VerifyOtp";
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
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [otpValid, setOtpValid] = useState(false);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      <KeyboardAwareScrollView>
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
              style={[styles.tab, activeTab === "phone" && styles.activeTab]}
              onPress={() => setActiveTab("phone")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "phone" && styles.activeTabText,
                ]}
              >
                Login with{"\n"}Phone
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "password" && styles.activeTab]}
              onPress={() => setActiveTab("password")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "password" && styles.activeTabText,
                ]}
              >
                Login with Password
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "phone" ? (
            <View style={styles.phoneTabContent}>
              <SendPhoneOtp
                value={mobile}
                setValue={setMobile}
                otpHandler={sendOtpHandler}
                loading={sendOtpLoading}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                cooldown={cooldown}
              />

              {otpSent ? (
                <>
                  <View style={{ height: hp(2) }} />
                  <VerifyOtp value={otp} setValue={setOtp} valid={otpValid} />
                  <View style={{ height: hp(2) }} />
                  <Button
                    text="Login with OTP"
                    pressHandler={loginWithOtpHandler}
                    loading={verifyOtpLoading}
                  />
                </>
              ) : null}

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
                title="Username"
                value={userName}
                onChangeText={(text) => setUserName(text)}
              />
              <View style={{ height: hp(1.5) }} />
              <InputField
                title="Password"
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

              <Button
                text="Log into my account"
                pressHandler={loginHandler}
                loading={loading}
              />

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
    paddingTop: hp(12),
    paddingHorizontal: wp(10),
  },
  loginGirl: { width: wp(40), height: hp(20) },
  loginLogo: {
    width: wp(20),
    height: hp(10),
    marginBottom: hp(12),
    alignSelf: "flex-end",
  },
  loginHeadTitle: { paddingHorizontal: wp(10) },
  loginHeadTitleText: { fontSize: RFValue(33), fontWeight: "bold" },
  loginBodyContainer: {
    width: wp(100),
    paddingHorizontal: wp(10),
    paddingTop: hp(2),
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
  tabText: { fontSize: RFValue(13), fontFamily: "Poppins", color: "#999" },
  activeTabText: {
    color: colors.primaryText,
    fontFamily: "PoppinsSemiBold",
  },
  phoneTabContent: { paddingTop: hp(3) },
  passwordTabContent: { paddingTop: hp(3) },
  loginForgotText: {
    alignSelf: "flex-end",
    color: colors.primaryText,
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(11),
  },
  loginNewUserContainer: {
    paddingBottom: hp(1),
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: hp(3),
  },
  loginNewUserContainerText: {
    fontFamily: "Poppins",
    fontSize: RFValue(12),
    color: "#000",
  },
});

export default Login;
