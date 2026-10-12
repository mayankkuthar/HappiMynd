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
import DropDown from "../../components/input/DropDown";
import Checkbox from "../../components/input/Checkbox";
import RadioButton from "../../components/buttons/RadioButton";
import ParentOtp from "../../components/common/ParentOtp";
import AgeRestrictionModal from "../../components/Modals/AgeRestrictionModal";
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

const PhoneRegistration = (props) => {
  const {
    sendLoginOTP,
    verifyLoginOTP,
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
  const [countryCodeIso, setCountryCodeIso] = useState("IN");
  const [showCountry, setShowCountry] = useState(false);
  const [mobile, setMobile] = useState(route?.params?.mobile || "");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(mobileVerifiedToken ? true : false);
  const [otpVerified, setOtpVerified] = useState(mobileVerifiedToken ? true : false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [otpValid, setOtpValid] = useState(false);
  const [verifiedToken, setVerifiedToken] = useState(mobileVerifiedToken || null);

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
  const [showParentField, setShowParentField] = useState(false);
  const [parentVerified, setParentVerified] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);

  useEffect(() => {
    if (age >= 10 && age <= 18) setShowParentField(true);
    else setShowParentField(false);
  }, [age]);

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
    const res = await sendLoginOTP({ type: "mobile", mobile, country_code: countryCode.replace("+", "") });
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
    const res = await verifyLoginOTP({ mobile, otp, country_code: countryCode.replace("+", "") });
    if (res?.access_token) {
      await AsyncStorage.setItem("USER", JSON.stringify(res));
      authDispatch({ type: "LOGIN", payload: res });
    } else if (res?.mobile_verified_token) {
      setOtpVerified(true);
      setStep(3);
      setVerifiedToken(res.mobile_verified_token);
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
    if (age && Number(age) <= 12) {
      setRegisterLoading(false);
      setShowAgeModal(true);
      return;
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
      mobile_verified_token: verifiedToken,
    };

    const res = await userSignup(dataToSend);
    if (res?.access_token) {
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
                  onChangeText={(text) =>
                    setMobile(text.replace(/[^0-9]/g, ""))
                  }
                  style={styles.phoneInput}
                />
              </View>

              <View style={{ height: hp(4) }} />

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.continueButton,
                  mobile.length === 10
                    ? styles.continueButtonEnabled
                    : styles.continueButtonDisabled,
                ]}
                disabled={mobile.length < 10 || sendOtpLoading}
                onPress={sendOtpHandler}
              >
                {sendOtpLoading ? (
                  <ActivityIndicator size="small" color="#A0A0A0" />
                ) : (
                  <Text
                    style={[
                      styles.continueButtonText,
                      mobile.length === 10
                        ? styles.continueTextEnabled
                        : styles.continueTextDisabled,
                    ]}
                  >
                    Send OTP
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
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

              <View style={{ height: hp(2.5) }} />

              <Text style={styles.inputLabel}>Enter OTP</Text>
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
                    ? `Resend OTP in ${String(Math.floor(cooldown / 60)).padStart(
                        2,
                        "0"
                      )}:${String(cooldown % 60).padStart(2, "0")}`
                    : "Resend OTP"}
                </Text>
              </View>

              <View style={{ height: hp(4) }} />

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.continueButton,
                  otp.length >= 4
                    ? styles.continueButtonEnabled
                    : styles.continueButtonDisabled,
                ]}
                disabled={otp.length < 4 || verifyOtpLoading}
                onPress={verifyOtpHandler}
              >
                {verifyOtpLoading ? (
                  <ActivityIndicator size="small" color="#A0A0A0" />
                ) : (
                  <Text
                    style={[
                      styles.continueButtonText,
                      otp.length >= 4
                        ? styles.continueTextEnabled
                        : styles.continueTextDisabled,
                    ]}
                  >
                    Verify OTP
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.phoneDisplay}>
                Phone: {countryCode} {mobile}
              </Text>
              <View style={{ height: hp(2) }} />

              <InputField
                title={
                  <Text style={styles.label}>
                    Nick Name <Text style={styles.required}>*</Text>
                  </Text>
                }
                placeHolder="Enter Nick Name"
                borderColor="#D8D8DE"
                titleSpacing={10}
                value={nickName}
                onChangeText={setNickName}
              />
              <View style={{ height: hp(1.5) }} />

              <DropDown
                title={
                  <Text style={styles.label}>
                    Profile Type <Text style={styles.required}>*</Text>
                  </Text>
                }
                placeHolder="Select Profile Type"
                data={profileType}
                setSelectedData={setSelectedProfileType}
                containerStyle={styles.dropDownBox}
                containerTextStyle={styles.dropDownText}
                dropDownContainerStyle={styles.dropDownList}
                selectedRowStyle={styles.dropDownSelectedRow}
                searchInputStyle={styles.dropDownSearchInput}
              />
              <View style={{ height: hp(1.5) }} />

              <InputField
                title={
                  <Text style={styles.label}>
                    Age <Text style={styles.required}>*</Text>
                  </Text>
                }
                placeHolder="Enter Your Age"
                keyboardType="numeric"
                borderColor="#D8D8DE"
                titleSpacing={10}
                value={age}
                onBlur={() => {
                  if (age && Number(age) <= 12) setShowAgeModal(true);
                }}
                onChangeText={setAge}
              />
              <View style={{ height: hp(1.5) }} />

              {showParentField && (
                <>
                  <ParentOtp
                    otpVerified={parentVerified}
                    setOtpVerified={setParentVerified}
                  />
                  <View style={{ height: hp(1.5) }} />
                </>
              )}

              <Text style={[styles.label, styles.genderLabel]}>
                Gender <Text style={styles.required}>*</Text>
              </Text>
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
              <View style={{ height: hp(1.5) }} />

              <InputField
                title={
                  <Text style={styles.label}>
                    User Name <Text style={styles.required}>*</Text>
                  </Text>
                }
                placeHolder="Enter User Name"
                borderColor="#D8D8DE"
                titleSpacing={10}
                value={userName}
                onChangeText={setUserName}
              />
              <View style={{ height: hp(1.5) }} />

              <InputField
                title={
                  <Text style={styles.label}>
                    Password <Text style={styles.required}>*</Text>
                  </Text>
                }
                placeHolder="Enter Password"
                password
                borderColor="#D8D8DE"
                titleSpacing={10}
                iconColor="#999999"
                value={password}
                onChangeText={setPassword}
              />
              <View style={{ height: hp(1.5) }} />

              <InputField
                title={
                  <Text style={styles.label}>
                    Confirm Password <Text style={styles.required}>*</Text>
                  </Text>
                }
                placeHolder="Re Enter Password"
                password
                borderColor="#D8D8DE"
                titleSpacing={10}
                iconColor="#999999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <View style={{ height: hp(1.5) }} />

              <View style={styles.termsRow}>
                <View style={styles.checkboxWrapper}>
                  <Checkbox checked={agreeTerms} setChecked={setAgreeTerms} />
                </View>
                <Text style={styles.termsText}>
                  By creating an account, you agree to our terms & conditions.
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.continueButton, styles.continueButtonEnabled]}
                  disabled={registerLoading}
                  onPress={registerHandler}
                >
                  {registerLoading ? (
                    <ActivityIndicator size="small" color="#A0A0A0" />
                  ) : (
                    <Text
                      style={[
                        styles.continueButtonText,
                        styles.continueTextEnabled,
                      ]}
                    >
                      Create Account
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <View style={{ height: hp(6) }} />
      </KeyboardAwareScrollView>

      {showAgeModal && (
        <AgeRestrictionModal
          showModal={showAgeModal}
          setShowModal={setShowAgeModal}
        />
      )}
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
  label: {
    fontSize: RFValue(12),
    color: "#000",
    fontFamily: "Poppins",
    paddingBottom: 4,
  },
  required: {
    color: "#E53935",
  },
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
  genderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
  },
  genderText: { fontSize: RFValue(12), fontFamily: "Poppins", color: "#758080" },
  genderSelected: { color: colors.primaryText },
  genderLabel: {
    marginBottom: hp(1),
  },
  dropDownBox: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderWidth: 1,
    borderColor: "#D8D8DE",
    borderRadius: 6,
    height: hp(6.5),
  },
  dropDownText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#88878D",
    textAlign: "left",
  },
  dropDownList: {
    backgroundColor: "#F3EDFF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D8D8DE",
  },
  dropDownSelectedRow: {
    backgroundColor: "#E0D3FF",
  },
  dropDownSearchInput: {
    backgroundColor: "#E0D3FF",
  },
  buttonContainer: {
    paddingTop: hp(4),
  },
  termsRow: { flexDirection: "row", alignItems: "flex-start" },
  checkboxWrapper: {
    width: hp(4),
    paddingTop: hp(0.3),
  },
  termsText: {
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#88878D",
    marginLeft: wp(1),
  },
});

export default PhoneRegistration;
