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
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CountryPicker } from "react-native-country-codes-picker";

// Components
import InputField from "../../components/input/InputField";
import DropDown from "../../components/input/DropDown";
import RadioButton from "../../components/buttons/RadioButton";
import SendPhoneOtp from "../../components/input/SendPhoneOtp";
import SendEmailOtp from "../../components/input/SendEmailOtp";
import VerifyOtp from "../../components/input/VerifyOtp";
import ParentOtp from "../../components/common/ParentOtp";
import AgeRestrictionModal from "../../components/Modals/AgeRestrictionModal";

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
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState(route?.params?.mobile || "");
  const [countryCode, setCountryCode] = useState(route?.params?.country_code || "+91");
  const [countryCodeIso, setCountryCodeIso] = useState("IN");
  const [showCountry, setShowCountry] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);

  const ageValid = !age || Number(age) > 18 || otpVerified;
  const canSubmit =
    !!nickName &&
    !!selectedProfileType?.id &&
    !!userName &&
    !!password &&
    !!confirmPassword &&
    ageValid;

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

      if (age && Number(age) <= 12) {
        setLoading(false);
        setShowAgeModal(true);
        return;
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
        country_code: countryCode,
        mobile: phone || null,
        happimyndCode: route?.params?.happimyndCode
          ? route.params.happimyndCode
          : null,
        signupType: route?.params?.signupType
          ? route.params.signupType
          : "individual",
        language: 1,
        refferalCode: refferalCode || null,
        mobile_verified_token: route?.params?.mobile_verified_token || null,
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
            title={
              <Text style={styles.label}>
                Nick Name <Text style={styles.required}>*</Text>
              </Text>
            }
            placeHolder="Enter Nick Name"
            borderColor="#D8D8DE"
            titleSpacing={10}
            value={nickName}
            onChangeText={(text) => setNickName(text)}
          />
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
            onChangeText={(text) => setUserName(text)}
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
            onChangeText={(text) => setAge(text)}
          />
          <View style={{ height: hp(1.5) }} />

          {showParentField && (
            <>
              <ParentOtp
                otpVerified={otpVerified}
                setOtpVerified={setOtpVerified}
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
            <View style={{ width: wp(3) }} />
            <Text
              style={[
                styles.radioText,
                { color: gender === "M" ? "#191928" : "#88878D" },
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
            <View style={{ width: wp(3) }} />
            <Text
              style={[
                styles.radioText,
                { color: gender === "F" ? "#191928" : "#88878D" },
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
            <View style={{ width: wp(3) }} />
            <Text
              style={[
                styles.radioText,
                { color: gender === "O" ? "#191928" : "#88878D" },
              ]}
            >
              Other
            </Text>
          </View>
          <View style={{ height: hp(1.5) }} />

          <Text style={styles.label}>Mobile Number</Text>
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
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
              style={styles.phoneInput}
            />
          </View>
          <View style={{ height: hp(1.5) }} />
          <InputField
            title={
              <Text style={styles.label}>
                Password <Text style={styles.required}>*</Text>
              </Text>
            }
            placeHolder="Enter Password"
            password={true}
            borderColor="#D8D8DE"
            titleSpacing={10}
            iconColor="#999999"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <View style={{ height: hp(1.5) }} />
          <InputField
            title={
              <Text style={styles.label}>
                Confirm Password <Text style={styles.required}>*</Text>
              </Text>
            }
            placeHolder="Re Enter Password"
            password={true}
            borderColor="#D8D8DE"
            titleSpacing={10}
            iconColor="#999999"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
          <View style={{ height: hp(1.5) }} />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.continueButton,
                canSubmit
                  ? styles.continueButtonEnabled
                  : styles.continueButtonDisabled,
              ]}
              disabled={!canSubmit || loading}
              onPress={registerHandler}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#A0A0A0" />
              ) : (
                <Text
                  style={[
                    styles.continueButtonText,
                    canSubmit
                      ? styles.continueTextEnabled
                      : styles.continueTextDisabled,
                  ]}
                >
                  Register
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.accountContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.accountText}>Already have an account?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Spacing */}
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
    marginTop: -hp(4),
    paddingBottom: hp(4),
  },
  radioText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
  label: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#191928",
  },
  required: {
    color: "red",
  },
  genderLabel: {
    marginBottom: hp(1),
  },
  genderRow: {
    flexDirection: "row",
    alignItems: "center",
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
  buttonContainer: {
    paddingTop: hp(4),
  },
  continueButton: {
    width: "100%",
    height: hp(5),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
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
    letterSpacing: 1,
  },
  continueTextDisabled: { color: "#A0A0A0" },
  continueTextEnabled: { color: "#000" },
  accountContainer: {
    paddingTop: hp(2),
    alignItems: "center",
  },
  accountText: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    color: "#895BF5",
    textAlign: "center",
  },
});

export default Register;
