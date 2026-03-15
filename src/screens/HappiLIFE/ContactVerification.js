import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
  BackHandler,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";
// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";
// Components
import Header from "../../components/common/Header";
import Button from "../../components/buttons/Button";
import PhoneInputField from "../../components/input/PhoneInputField";
import { CountryPicker } from "react-native-country-codes-picker";

const BulletPoint = (props) => {
  const { name = "" } = props;

  return (
    <View style={{ flexDirection: "row" }}>
      <FontAwesome name="check-circle" size={hp(2)} color="green" />
      <View style={{ width: wp(2) }} />
      <View style={{ width: wp(66) }}>
        <Text style={styles.pointText}>{name}</Text>
      </View>
    </View>
  );
};

const ContactVerification = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  const { params } = props?.route;

  // Context Variables
  const {
    snackDispatch,
    sendOTP,
    verifyOtp,
    getReport,
    screenTrafficAnalytics,
  } = useContext(Hcontext);

  // State variables
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailLoader, setEmailLoader] = useState(false);
  const [phoneLoader, setPhoneLoader] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPhone, setValidPhone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);

  useEffect(() => {
    if (phoneOtp) {
      validatePhoneOTP(phoneOtp);
    }
    screenTrafficAnalytics({
      screenName: "HappiLIFE Assesment Verification Screen",
    });
  }, [phoneOtp]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick,
      );
    };
  }, []);

  const handleBackButtonClick = () => {
    navigation.navigate("HomeScreen");
    return true;
  };

  const promptBox = () =>
    Alert.alert(
      "We would like to hear from you",
      "Fill in your contact details to avail FREE awarness summary",
      [
        {
          text: "Cancel",
          onPress: () =>
            navigation.push("Pricing", {
              selectedPlan: "HappiLIFE Screening",
            }),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => console.log("Ok Pressed"),
        },
      ],
    );

  const otpHandler = async (type = "", email = null, mobile = null) => {
    let joincode = countryCode.replace("+", "");
    let sendMobile = mobile;

    try {
      if (type === "email") {
        setEmailLoader(true);
      } else {
        setPhoneLoader(true);
      }
      const otpRes = await sendOTP({
        type,
        email,
        mobile: sendMobile,
        country_code: joincode,
      });
      if (otpRes.status === "success") {
        snackDispatch({ type: "SHOW_SNACK", payload: otpRes.message });
      }
    } catch (err) {
      console.log("Some issue while sending OTP - ", err);
    }
    setEmailLoader(false);
    setPhoneLoader(false);
  };

  const validateEmailOTP = async (otp) => {
    try {
      const otpRes = await verifyOtp({ email, mobile: "", otp });
      if (otpRes.status === "success") {
        setValidEmail(true);
      } else {
        setValidEmail(false);
      }
    } catch (err) {
      console.log("Some issue while validating OTP - ", err);
    }
  };

  const validatePhoneOTP = async (otp) => {
    try {
      let joincode = countryCode.replace("+", "");
      let sendMobile = phone;
      const otpRes = await verifyOtp({ email: "", mobile: sendMobile, otp });
      if (otpRes.status === "success") {
        setValidPhone(true);
      } else {
        setValidPhone(false);
      }
    } catch (err) {
      console.log("Some issue while validating OTP - ", err);
    }
  };

  const reportHandler = async () => {
    setLoading(true);
    try {
      if (!validPhone) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Please verify your contact number.",
        });
      }

      if (!agreeTerms) {
        setLoading(false);
        setTermsError(true);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Please agree to terms and conditions !",
        });
      }

      setTermsError(false);

      if (params?.isFrom == "Talk") {
        navigation.push("HappiTALKBook");
      } else if (params?.isFrom == "Guide") {
        navigation.push("MakeBooking", {
          module: "guide",
          type: "add",
          planId: "22",
          amount: "539",
        });
      } else if (params?.isFrom == "Voice") {
        navigation.push("Pricing", {
          selectedPlan: "HappiVOICE (Year)",
          isFrom: "Voice",
        });
      } else if (params?.isFrom == "HappiBot") {
        navigation.push("ResultScreen", {
          isFrom: "contact",
          cat_id: params?.category_Id,
          profile_id: params?.profile_id,
        });
      } else {
        navigation.navigate("HomeScreen");
      }
    } catch (err) {
      console.log("Some issue while fetching report - ", err);
    }
    setLoading(false);
  };

  const handleToggleTerms = () => {
    setAgreeTerms(!agreeTerms);
    if (termsError) setTermsError(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ height: hp(14) }} />

      <ScrollView style={{ paddingHorizontal: wp(10) }}>
        <View>
          <Text style={styles.title}>HappiMynd Verification</Text>
          <View style={{ height: hp(1) }} />
          <Text style={styles.subTitle}>
            Summary will be shared on your email-id
          </Text>
        </View>

        <View style={{ height: hp(2) }} />

        {/* Form Section */}
        <View>
          {/* Email (optional) */}
          <Text style={styles.label}>Enter email (optional)</Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TextInput
              keyboardType="email-address"
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter email address (optional)"
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={{ height: hp(2) }} />

          {/* Phone */}
          <Text style={styles.label}>Enter phone number</Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{
                ...styles.input,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity
                  onPress={() => setShow(true)}
                  style={{
                    width: 50,
                    height: 30,
                    padding: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                    backgroundColor: "lightgrey",
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(10),
                      fontFamily: "Poppins",
                      color: "black",
                    }}
                  >
                    {countryCode}
                  </Text>
                  <Image
                    source={require("../../assets/images/downArrow.png")}
                    style={{
                      height: 15,
                      width: 15,
                      marginLeft: 5,
                      tintColor: "grey",
                    }}
                  />
                </TouchableOpacity>
              </View>

              <CountryPicker
                show={show}
                initialState={"+91"}
                pickerButtonOnPress={(item) => {
                  setCountryCode(item.dial_code);
                  setShow(false);
                }}
                onBackdropPress={() => setShow(false)}
                style={{ modal: { height: 400 } }}
              />

              <View style={{ width: wp(2) }} />
              <TextInput
                keyboardType="number-pad"
                placeholder="Enter phone number"
                value={phone}
                onChangeText={(text) => setPhone(text)}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.otpButton}
              disabled={phoneLoader}
              onPress={() => otpHandler("mobile", null, phone)}
            >
              {phoneLoader ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.otpButtonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: hp(2) }} />

          {/* Phone OTP */}
          <Text style={styles.label}>Enter phone number OTP</Text>
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
              value={phoneOtp}
              onChangeText={(text) => setPhoneOtp(text)}
            />
            <View style={{ width: wp(2) }} />
            {phone ? (
              validPhone ? (
                <FontAwesome name="check-circle" size={hp(2.5)} color="green" />
              ) : (
                <MaterialIcons
                  name="report-problem"
                  size={hp(2.5)}
                  color="red"
                />
              )
            ) : null}
          </View>
        </View>

        <View style={{ height: hp(2) }} />

        {/* Bullet Points */}
        <View style={styles.pointsContainer}>
          <Text
            style={{
              ...styles.pointText,
              fontFamily: "PoppinsSemiBold",
            }}
          >
            Your information is secure with us. We need it for the following
            reasons:
          </Text>
          <View style={{ height: hp(1) }} />
          <BulletPoint name="Use email, in case you forget password." />
          <View style={{ height: hp(1) }} />
          <BulletPoint name="Use contact for fulfilling your service requests & updates." />
          <View style={{ height: hp(1) }} />
          <BulletPoint name="For sending you vouchers/ offers & informative content." />
        </View>

        <View style={{ height: hp(1.5) }} />

        {/* ── Improved Terms & Conditions ── */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.termsCard, termsError && styles.termsCardError]}
          onPress={handleToggleTerms}
        >
          {/* Custom Checkbox */}
          <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
            {agreeTerms && (
              <FontAwesome name="check" size={RFValue(10)} color="#fff" />
            )}
          </View>

          {/* Terms Text */}
          <Text style={styles.termsText}>
            By creating an account, you agree to our{" "}
            <Text
              style={styles.termsLink}
              onPress={(e) => {
                e.stopPropagation?.();
                Linking.openURL("https://happimynd.com/terms");
              }}
            >
              Terms & Conditions
            </Text>{" "}
            and acknowledge that Happimynd's{" "}
            <Text
              style={styles.termsLink}
              onPress={(e) => {
                e.stopPropagation?.();
                Linking.openURL("https://happimynd.com/privacy");
              }}
            >
              Privacy Policy
            </Text>{" "}
            applies to you.
          </Text>
        </TouchableOpacity>

        {/* Inline error message */}
        {termsError && (
          <Text style={styles.termsErrorText}>
            Please agree to the terms to continue.
          </Text>
        )}

        <View style={{ height: hp(2) }} />

        {/* Button Section */}
        <View>
          <Button
            text="Confirm"
            loading={loading}
            pressHandler={reportHandler}
          />
        </View>

        <View style={{ height: hp(8) }} />
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backContainer}
        activeOpacity={0.7}
        onPress={() => {
          if (params?.isFrom === "HappiBot") {
            navigation.goBack();
          } else {
            navigation.navigate("HomeScreen");
          }
        }}
      >
        <Ionicons name="ios-chevron-back" size={hp(4)} color="black" />
        {params?.isFrom !== "HappiBot" &&
          params?.isFrom !== "Talk" &&
          params?.isFrom !== "Guide" &&
          params?.isFrom !== "Voice" && (
            <Text style={{ marginTop: wp(2) }}>Skip</Text>
          )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  title: {
    fontSize: RFValue(20),
    textAlign: "center",
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
  },
  backContainer: {
    flexDirection: "row",
    position: "absolute",
    left: wp(6),
    top: hp(8),
  },
  subTitle: {
    fontSize: RFValue(12),
    textAlign: "center",
    fontFamily: "Poppins",
    color: colors.borderLight,
  },
  label: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    color: colors.borderLight,
    paddingBottom: hp(0.2),
  },
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
  pointsContainer: {
    backgroundColor: "#fff",
    borderRadius: hp(1),
    paddingHorizontal: hp(2),
    paddingVertical: hp(2),
  },
  pointText: {
    fontSize: RFValue(11),
    fontFamily: "Poppins",
    textAlign: "justify",
  },

  // ── Improved Terms Styles ──
  termsCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: hp(1.2),
    borderWidth: 0.5,
    borderColor: colors.borderDim,
    paddingHorizontal: hp(1.5),
    paddingVertical: hp(1.5),
  },
  termsCardError: {
    borderColor: "#e24b4a",
    borderWidth: 1,
  },
  checkbox: {
    width: hp(2.6),
    height: hp(2.6),
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(0.2),
    flexShrink: 0,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#1a9e7e",
    borderColor: "#1a9e7e",
  },
  termsText: {
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: colors.borderLight,
    lineHeight: RFValue(20),
    marginLeft: wp(3),
  },
  termsLink: {
    color: colors.primaryText,
    fontFamily: "PoppinsSemiBold",
    textDecorationLine: "underline",
  },
  termsErrorText: {
    fontSize: RFValue(11),
    fontFamily: "Poppins",
    color: "#e24b4a",
    marginTop: hp(0.5),
    marginLeft: hp(0.5),
  },
});

export default ContactVerification;
