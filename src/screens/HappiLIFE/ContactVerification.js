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
  Image
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
import Checkbox from "../../components/input/Checkbox";



const BulletPoint = (props) => {
  // Prop Destructuring
  const { name = "" } = props;


  return (
    <View style={{ flexDirection: "row" }}>
      <FontAwesome name="check-circle" size={hp(2)} color="green" />

      {/* Sized Box */}
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
  const [countryCode, setCountryCode] = useState('+91');
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    if (emailOtp) {
      validateEmailOTP(emailOtp);
    }
    if (phoneOtp) {
      validatePhoneOTP(phoneOtp);
    }
    screenTrafficAnalytics({
      screenName: "HappiLIFE Assesment Verification Screen",
    });
  }, [emailOtp, phoneOtp]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
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
      ]
    );

  const otpHandler = async (type = "", email = null, mobile = null) => {
    let joincode = countryCode.replace("+", "");
    let sendMobile = mobile
    console.log("checkdata________ ", joincode, type, email, mobile);

    try {
      if (type === "email") {
        setEmailLoader(true);
      } else {
        setPhoneLoader(true);
      }
      const otpRes = await sendOTP({ type, email, mobile: sendMobile, country_code: joincode });
      console.log("The OTP Res - ", otpRes);
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
      let sendMobile = phone
      const otpRes = await verifyOtp({ email: "", mobile: sendMobile, otp });
      console.log("chec the email otp or the res - ", otpRes);
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
      if (!validEmail || !validPhone) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Please update your email and contact number.",
        });
      }

      if (!agreeTerms) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Please agree to terms and conditions !",
        });
      }

      if (params?.isFrom == "Talk") {
        navigation.push("HappiTALKBook");
      }

      else if (params?.isFrom == "Guide") {
        navigation.push("MakeBooking", {
          module: "guide",
          type: "add",
          // psyId: 10,
          planId: "22",
          amount: "539",
          // session: 1,
        });
      }

      else if (params?.isFrom == "Voice") {
        navigation.push("Pricing", {
          selectedPlan: "HappiVOICE (Year)",
          isFrom: "Voice"
        });
      }

      else if (params?.isFrom == "HappiBot") {
        navigation.push("ResultScreen", { isFrom: "contact", cat_id: params?.category_Id, profile_id: params?.profile_id })
      }
      else {
        //navigation.push("Pricing", {selectedPlan: "HappiLIFE Screening",});
        navigation.navigate("HomeScreen");
      }

      // return navigation.navigate("HomeScreen");

      // const reportRes = await getReport();
      // console.log("Cheking the report res - ", reportRes);
      // if (reportRes.status === "success") {
      //   setLoading(false);
      //   Linking.openURL(reportRes.url);
      //   navigation.navigate("HomeScreen");
      //   // downloadReport(reportRes.url);
      // }
    }
    catch (err) {
      console.log("Some issue while fetching report - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* <Header showBack={true} navigation={navigation} showLogo={false} /> */}

      <View style={{ height: hp(14) }} />

      <ScrollView style={{ paddingHorizontal: wp(10) }}>
        <View>
          <Text style={styles.title}>HappiLIFE Awareness Tool</Text>

          {/* Sized Box */}
          <View style={{ height: hp(1) }} />

          <Text style={styles.subTitle}>
            Summary will be shared on your email-id
          </Text>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        {/* Form Section */}
        <View>
          <Text style={styles.label}>Enter email</Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TextInput
              keyboardType="email-address"
              style={styles.input}
              placeholder="Enter email address"
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.otpButton}
              onPress={() => otpHandler("email", email, null)}
              disabled={emailLoader}
            >
              {emailLoader ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.otpButtonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Text style={styles.label}>Enter email OTP</Text>
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
              placeholder="Enter email OTP"
              value={emailOtp}
              onChangeText={(text) => setEmailOtp(text)}
            />
            <View style={{ width: wp(2) }} />
            {email ? (
              validEmail ? (
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

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

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
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* <Text style={{ fontSize: RFValue(10), fontFamily: "Poppins" }}>
                  +91
                </Text> */}
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
                    backgroundColor: 'lightgrey'
                  }}
                >

                  <Text style={{ fontSize: RFValue(10), fontFamily: "Poppins", color: 'black' }}>
                    {countryCode}
                  </Text>
                  <Image
                    source={require('../../assets/images/downArrow.png')}
                    style={{ height: 15, width: 15, marginLeft: 5, tintColor: 'grey' }}
                  />
                </TouchableOpacity>
              </View>


              <CountryPicker
                show={show}
                initialState={'+91'}
                pickerButtonOnPress={(item) => {
                  setCountryCode(item.dial_code);
                  setShow(false);
                }}
                onBackdropPress={() => setShow(false)}
                style={{
                  modal: {
                    height: 400,
                  },
                }}
              />


              {/* Sized Box */}
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

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

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

        {/* Sized Box */}
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
          {/* <BulletPoint name="Use email in case I forget my password." /> */}
          <BulletPoint name="Use email, in case you forget password." />
          {/* Sized Box */}
          <View style={{ height: hp(1) }} />
          {/* <BulletPoint name="Subscribe to blogs/articles/newsletter or any other subscription from HappiMynd for my updation." /> */}
          <BulletPoint name="Use contact for fulfilling your service requests & updates." />
          {/* Sized Box */}
          <View style={{ height: hp(1) }} />
          {/* <BulletPoint name="Send HappiMynd gift voucher/discount coupons on my mail-id." /> */}
          <BulletPoint name="For sending you vouchers/ offers & informative content." />
          {/* Sized Box */}
          {/* <View style={{ height: hp(1) }} />
          <BulletPoint name="Report will be provided for FREE if you verify both email and phone number." /> */}
        </View>

        <View style={{ height: hp(1.5) }} />

        <View style={{ flexDirection: "row" }}>
          <View>
            <Checkbox
              // title="By creating an account, you agree to our terms & conditions"
              checked={agreeTerms}
              setChecked={setAgreeTerms}
            />
          </View>
          <View>
            <Text>
              By creating an account, you agree to our{" "}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => Linking.openURL("https://happimynd.com/terms")}
              >
                <Text style={{ textDecorationLine: "underline" }}>
                  Terms & Conditions
                </Text>
              </TouchableOpacity>
              {" "}and acknowledge that Happimynd's{" "}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => Linking.openURL("https://happimynd.com/privacy")}
              >
                <Text style={{ textDecorationLine: "underline" }}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
              {" "}applies to you.
            </Text>
          </View>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        {/* Button Section */}
        <View>
          <Button
            text="Confirm"
            loading={loading}
            pressHandler={reportHandler}
          />

          {/* Sized Box */}
          <View style={{ height: hp(1) }} />

          {/* <TouchableOpacity
            activeOpacity={0.7}
            style={styles.laterButton}
            onPress={promptBox}
          >
            <Text style={styles.laterButtonText}>Maybe Later</Text>
          </TouchableOpacity> */}
        </View>

        {/* Sized Box */}
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
            <Text>Skip</Text>
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
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
  },
  backContainer: {
    flexDirection: "row",
    position: "absolute",
    left: wp(6),
    top: hp(8),
    // backgroundColor: "red",
  },
  subTitle: {
    fontSize: RFValue(12),
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
  laterButton: {
    // backgroundColor: "red",
    paddingVertical: hp(1.5),
  },
  laterButtonText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: colors.primaryText,
    textAlign: "center",
  },
});

export default ContactVerification;
