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
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Context
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import InputField from "../../components/input/InputField";
import DropDown from "../../components/input/DropDown";
import Checkbox from "../../components/input/Checkbox";
import Button from "../../components/buttons/Button";

const RegisterWithCode = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { getSponsorList, snackDispatch, checkSponsorCode } =
    useContext(Hcontext);

  // State Variables
  const [sponsorList, setSponsorList] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState({});
  const [code, setCode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mounting
  useEffect(() => {
    gettingSponsorList();
  }, []);

  const gettingSponsorList = async () => {
    try {
      const sponsors = await getSponsorList();
      // const filteredData = sponsors.data.map((user) => user.name);
      setSponsorList(sponsors.data);
    } catch (err) {
      console.log("Some issue while getting sponsopred user list - ", err);
    }
  };

  const handleSubmit = async () => {
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
          });
      }
    } catch (err) {
      console.log(
        "Some issue while register with code (RegisterWithCode.js) - ",
        err
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
            title="Select Name of Sponsor"
            placeHolder="Select a Sponsor"
            data={sponsorList}
            setSelectedData={setSelectedSponsor}
            search="enabled"
          />
          <View style={{ height: hp(1.5) }} />
          <InputField
            title="HappiMynd code"
            placeHolder="Enter HappiMynd code"
            value={code}
            onChangeText={(text) => setCode(text)}
          />
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

          <View style={styles.buttonContainer}>
            <Button
              text="Continue"
              pressHandler={handleSubmit}
              loading={loading}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={{ paddingVertical: hp(2) }}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.accountText}>Already have a account</Text>
            </TouchableOpacity>
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
  },
  buttonContainer: {
    paddingVertical: hp(4),
  },
  accountText: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    color: colors.primaryText,
    textAlign: "center",
  },
});

export default RegisterWithCode;
