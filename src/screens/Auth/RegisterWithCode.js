import React, { useState, useContext, useEffect } from "react";
import useIsMounted from "../../hooks/useIsMounted";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Context
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import InputField from "../../components/input/InputField";
import DropDown from "../../components/input/DropDown";
import Checkbox from "../../components/input/Checkbox";

const RegisterWithCode = (props) => {
  // Prop Destructuring
  const { navigation, route } = props;

  // Context Variables
  const { getSponsorList, snackDispatch, checkSponsorCode } =
    useContext(Hcontext);

  // State Variables
  const [sponsorList, setSponsorList] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState({});
  const [code, setCode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = !!selectedSponsor?.id && code.length > 0 && agreeTerms;

  // Mount guard — prevents setState on unmounted component
  const isMounted = useIsMounted();

  // Mounting
  useEffect(() => {
    gettingSponsorList();
  }, []);

  const gettingSponsorList = async () => {
    try {
      const sponsors = await getSponsorList();
      if (!isMounted.current) return;
      // const filteredData = sponsors.data.map((user) => user.name);
      setSponsorList(sponsors.data);
    } catch (err) {
      console.log("Some issue while getting sponsopred user list - ", err);
    }
  };

  const handleSubmit = async () => {
    if (!isMounted.current) return;
    setLoading(true);
    try {
      if (!selectedSponsor || !code) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Please enter all fields.",
        });
      }

      if (!agreeTerms) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Please accept the terms.",
        });
      }

      const codeRes = await checkSponsorCode({
        id: selectedSponsor.id,
        code,
      });

      if (codeRes) {
        snackDispatch({ type: "SHOW_SNACK", payload: codeRes.message });

        if (codeRes.status === "success")
          navigation.navigate("Register", {
            happimyndCode: code,
            signupType: "organization",
            ...(route?.params?.mobile_verified_token ? {
              mobile_verified_token: route.params.mobile_verified_token,
              mobile: route.params.mobile,
              country_code: route.params.country_code,
            } : {}),
          });
      }
    } catch (err) {
      console.log(
        "Some issue while register with code (RegisterWithCode.js) - ",
        err,
      );
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
          <DropDown
            title={
              <Text style={styles.label}>
                Select Name of Sponsor <Text style={styles.required}>*</Text>
              </Text>
            }
            placeHolder="Name of Sponsor"
            data={sponsorList}
            setSelectedData={setSelectedSponsor}
            search="enabled"
            containerStyle={styles.dropDownBox}
            containerTextStyle={styles.dropDownText}
            dropDownContainerStyle={styles.dropDownList}
            selectedRowStyle={styles.dropDownSelectedRow}
            searchInputStyle={styles.dropDownSearchInput}
          />
          <View style={{ height: hp(2) }} />
          <InputField
            title={
              <Text style={styles.label}>
                HappiMynd Code <Text style={styles.required}>*</Text>
              </Text>
            }
            placeHolder="Enter HappiMynd Code"
            borderColor="#D8D8DE"
            titleSpacing={10}
            value={code}
            onChangeText={(text) => setCode(text)}
          />
          <View style={{ height: hp(2) }} />

          <View style={styles.termsRow}>
            <View style={styles.checkboxWrapper}>
              <Checkbox
                checked={agreeTerms}
                setChecked={setAgreeTerms}
              />
            </View>
            <Text style={styles.termsText}>
              By creating an account, you agree to our terms & conditions.
            </Text>
          </View>

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
              onPress={handleSubmit}
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
                  Create Account
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
    paddingTop: hp(1),
    paddingBottom: hp(4),
  },
  label: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#191928",
  },
  required: {
    color: "red",
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
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
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

export default RegisterWithCode;
