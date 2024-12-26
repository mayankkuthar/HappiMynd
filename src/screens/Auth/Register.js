import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Linking,
  TextInput,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Components
import InputField from "../../components/input/InputField";
import DropDown from "../../components/input/DropDown";
import Checkbox from "../../components/input/Checkbox";
import Button from "../../components/buttons/Button";
import RadioButton from "../../components/buttons/RadioButton";
import SendPhoneOtp from "../../components/input/SendPhoneOtp";
import SendEmailOtp from "../../components/input/SendEmailOtp";
import VerifyOtp from "../../components/input/VerifyOtp";
import ParentOtp from "../../components/common/ParentOtp";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

const Register = (props) => {
  // Context Variables
  const {
    getProfileList,
    snackDispatch,
    authDispatch,
    userSignup,
    sendNotification,
    guardianVerification,
    verifyGuardianOtp,
  } = useContext(Hcontext);

  // Prop Destructuring
  const { navigation, route } = props;

  // State Variables
  const [nickName, setNickName] = useState("");
  const [profileType, setProfileType] = useState([]);
  const [selectedProfileType, setSelectedProfileType] = useState({});
  const [age, setAge] = useState(null);
  const [showParentField, setShowParentField] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [gender, setGender] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [refferalCode, setRefferalCode] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mounting
  useEffect(() => {
    fetchProfileList();
    console.log("The signup type - ", route.params);
  }, []);

  // Updating Phase
  useEffect(() => {
    if (age >= 10 && age <= 18) setShowParentField(true);
    else setShowParentField(false);
  }, [age]);

  const fetchProfileList = async () => {
    try {
      const profileList = await getProfileList();

      setProfileType(profileList.data);
    } catch (err) {
      console.log("Some issue while fetching profile list - ", err);
    }
  };

  const registerHandler = async () => {
    setLoading(true);
    try {
      // Form submit validations
      if (
        !nickName ||
        !selectedProfileType ||
        !userName ||
        !password ||
        !confirmPassword
      ) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Please enter all fields !",
        });
      }

      if (age && age < 10) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Age should be above 10 years !",
        });
      }

      if (password !== confirmPassword) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Password mismatch !",
        });
      }
      if (password.length < 6) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "The password must be at least 6 characters.",
        });
      }

      if (!agreeTerms) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Please agree to terms and conditions !",
        });
      }

      let genderText = "";
      if (gender === "M") {
        genderText = "male";
      } else if (gender === "F") {
        genderText = "female";
      } else if (gender === "O") {
        genderText = "other";
      }

      const dataToSend = {
        nickName,
        selectedProfileType: selectedProfileType.id,
        age: Number(age),
        gender: genderText,
        userName,
        password,
        confirmPassword,
        happimyndCode: route?.params?.happimyndCode
          ? route.params.happimyndCode
          : null,
        signupType: route?.params?.signupType
          ? route.params.signupType
          : "individual",
        language: 1, // Hardcoded to hindi but need to replace
        refferalCode: refferalCode || null,
      };

      console.log("The signup user data to send - ", dataToSend);

      const userRes = await userSignup(dataToSend);

      console.log("Check the user to be sent - ", userRes);
      // snackDispatch({ type: "SHOW_SNACK", payload: userRes.message });

      await AsyncStorage.setItem("USER", JSON.stringify(userRes));

      await sendNotification({
        message:
          "Self awareness is now trending! Want to boast your strengths and become a stronger you? Take the HappiLIFE screening now!",
      });

      if (userRes) {
        authDispatch({ type: "SIGNUP", payload: userRes });
      }
    } catch (err) {
      console.log("Some issue while registering - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        {/* Top Section */}
        <ImageBackground
          source={require("../../assets/images/register_background.png")}
          style={styles.registerBackground}
          resizeMode="cover"
        >
          <ImageBackground
            source={require("../../assets/images/register_mask.png")}
            style={styles.registerMask}
            resizeMode="cover"
          >
            <View style={styles.backgroundImageSection}>
              <Image
                source={require("../../assets/images/register_boy.png")}
                style={styles.registerBoy}
                resizeMode="contain"
              />
              <Image
                source={require("../../assets/images/happimynd_logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.backgroundTextSection}>
              <Text style={styles.title}>Be Happi!!</Text>
              <Text style={styles.subTitle}>Create an account to continue</Text>
            </View>
          </ImageBackground>
        </ImageBackground>
        {/* Form Section */}
        <View style={styles.formContainer}>
          <InputField
            title="Create Nick Name"
            placeHolder="Enter Nick Name"
            value={nickName}
            onChangeText={(text) => setNickName(text)}
          />
          <View style={{ height: hp(1.5) }} />
          <DropDown
            title="Profile Type"
            placeHolder="Available in 10 profiles"
            data={profileType}
            setSelectedData={setSelectedProfileType}
          />
          <View style={{ height: hp(1.5) }} />

          <InputField
            title="Age (optional)"
            placeHolder="Enter Your Age"
            keyboardType="numeric"
            value={age}
            onChangeText={(text) => setAge(text)}
          />
          <View style={{ height: hp(1.5) }} />

          {showParentField && (
            <ParentOtp
              otpVerified={otpVerified}
              setOtpVerified={setOtpVerified}
            />
          )}

          <View style={{ height: hp(1.5) }} />
          <Text style={styles.formText}>Gender (optional)</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: 20,
            }}
          >
            <RadioButton
              size={14}
              innerColor={colors.primaryText}
              outerColor={colors.primaryText}
              isSelected={gender === "M"}
              onPress={() => setGender("M")}
            />
            <View style={{ width: wp(3) }} />
            <Text
              style={{
                ...styles.formText,
                paddingBottom: 0,
                color: gender === "M" ? colors.primaryText : "#758080",
              }}
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
            <View style={{ width: wp(3) }} />
            <Text
              style={{
                ...styles.formText,
                paddingBottom: 0,
                color: gender === "F" ? colors.primaryText : "#758080",
              }}
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
            <View style={{ width: wp(3) }} />
            <Text
              style={{
                ...styles.formText,
                paddingBottom: 0,
                color: gender === "O" ? colors.primaryText : "#758080",
              }}
            >
              Other
            </Text>
          </View>
          <InputField
            title="Username"
            placeHolder="Enter Username"
            value={userName}
            onChangeText={(text) => setUserName(text)}
          />
          <View style={{ height: hp(1.5) }} />
          <InputField
            title="Password"
            placeHolder="Enter Password"
            password={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <View style={{ height: hp(1.5) }} />
          <InputField
            title="Confirm Password"
            placeHolder="Re Enter Password"
            password={true}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
          <View style={{ height: hp(1.5) }} />
          {/* <InputField
            title="Refferal Code (optional)"
            placeHolder="Enter refferal code"
            value={refferalCode}
            onChangeText={(text) => setRefferalCode(text)}
          />
          <View style={{ height: hp(1.5) }} /> */}

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
          <View style={{ height: hp(3) }} />

          <Button
            // text="Start HappiLIFE Awareness"
            text="Register"
            pressHandler={registerHandler}
            loading={loading}
            disabled={!age ? false : age <= 18 ? !otpVerified : false}
          />
          <View style={styles.accountContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.accountText}>Already have an account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacing */}
        <View style={{ height: hp(6) }} />
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  registerBackground: {
    height: hp(50),
    width: wp(100),
  },
  registerMask: {
    height: hp(50),
    width: wp(100),
  },
  registerBoy: {
    // backgroundColor: "green",
    width: wp(40),
    height: hp(30),
    alignSelf: "flex-start",
  },
  logo: {
    // backgroundColor: "red",
    width: wp(20),
    height: hp(10),
  },
  backgroundImageSection: {
    height: hp(25),
    width: wp(100),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(10),
    // backgroundColor: "yellow",
  },
  backgroundTextSection: {
    // backgroundColor: "lime",
    paddingHorizontal: wp(10),
    paddingTop: hp(2),
    height: hp(25),
    width: wp(100),
  },
  title: {
    fontSize: RFValue(30),
    fontFamily: "PoppinsBold",
  },
  subTitle: {
    fontSize: RFValue(14),
    fontFamily: "Poppins",
  },
  formContainer: {
    paddingHorizontal: wp(10),
  },
  accountContainer: {
    // backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(3),
  },
  accountText: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    color: colors.primaryText,
  },
  formText: {
    fontSize: RFValue(12),
    color: "#758080",
    fontFamily: "Poppins",
    paddingBottom: 4,
  },
});

export default Register;
