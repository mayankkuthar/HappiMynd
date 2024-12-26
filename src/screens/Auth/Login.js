import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Components
import InputField from "../../components/input/InputField";
import Button from "../../components/buttons/Button";
import OutlineButton from "../../components/buttons/OutineButton";

// Constants
import { colors } from "../../assets/constants";

// Context
import { Hcontext } from "../../context/Hcontext";

const Login = (props) => {
  // Context Variables
  const { authDispatch, userLogin, snackDispatch, startAssessment } =
    useContext(Hcontext);

  // Prop Destucturing
  const { navigation } = props;

  // State Variables
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handles the user login
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

      console.log("The login response - ", userRes);

      if (userRes.status === "error") {
        setLoading(false);
        return snackDispatch({ type: "SHOW_SNACK", payload: userRes.message });
      }

      await AsyncStorage.setItem("USER", JSON.stringify(userRes));

      if (userRes) {
        authDispatch({ type: "LOGIN", payload: userRes });
      }
    } catch (err) {
      console.log("Some issue while login - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        {/* Header Section */}
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
        {/* Body Section */}
        <View style={styles.loginBodyContainer}>
          <View style={styles.loginBodySection1}>
            {/* <Text style={styles.loginBodySubText}>
              Please log into your account
            </Text> */}
          </View>
          <View style={styles.loginBodySection2}>
            <InputField
              title="Username"
              value={userName}
              onChangeText={(text) => setUserName(text)}
            />
            <View style={{ height: hp(1.5) }} />
            <InputField
              title="Password"
              password={true}
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
          </View>
          <View style={styles.loginBodySection3}>
            <View style={{ paddingBottom: hp(2) }}>
              <Button
                text="Log into my account"
                pressHandler={loginHandler}
                loading={loading}
              />
            </View>
            {/* <View>
              <OutlineButton
                text="Log in with HappiMynd Code"
                pressHandler={() => navigation.push("LoginWithCode")}
              />
            </View> */}
            <View style={styles.loginNewUserContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.push("GettingStarted")}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}
              >
                <Text style={styles.loginNewUserContainerText}>
                  New to HappiMynd ?
                </Text>
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
  loginHeadContainer: {
    width: wp(100),
    height: hp(40),
  },
  loginHeadMask: {
    width: wp(100),
    height: hp(40),
  },
  loginImagesContainer: {
    flexDirection: "row",
    flex: 1,
    // alignItems: "center",
    justifyContent: "space-between",
    paddingTop: hp(12),
    paddingHorizontal: wp(10),
    // backgroundColor: "yellow",
  },
  loginGirl: {
    width: wp(40),
    height: hp(20),
    // backgroundColor: "red",
  },
  loginLogo: {
    width: wp(20),
    height: hp(10),
    marginBottom: hp(12),
    alignSelf: "flex-end",
    // backgroundColor: "green",
  },
  loginHeadTitle: {
    paddingHorizontal: wp(10),
  },
  loginHeadTitleText: {
    fontSize: RFValue(33),
    // fontFamily: "PoppinsBold",
    fontWeight: "bold",
  },
  loginBodyContainer: {
    // backgroundColor: "lime",
    width: wp(100),
    height: hp(60),
    paddingHorizontal: wp(10),
  },
  loginBodySubText: {
    fontSize: RFValue(14),
    fontFamily: "Poppins",
  },
  loginBodySection1: {
    flex: 1,
    // backgroundColor: "yellow",
  },
  loginBodySection2: {
    flex: 3,
    // backgroundColor: "blue",
  },
  loginBodySection3: {
    flex: 3,
    // backgroundColor: "red",
  },
  loginFormText: {
    fontSize: RFValue(12),
    color: "#758080",
    fontFamily: "Poppins",
    paddingBottom: 4,
  },
  loginInput: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 6,
    backgroundColor: "#EFFEFE",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 6,
    height: hp(5),
  },
  loginForgotText: {
    alignSelf: "flex-end",
    color: colors.primaryText,
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(11),
  },
  loginNewUserContainer: {
    flex: 1,
    paddingBottom: hp(1),
    alignItems: "center",
    justifyContent: "flex-end",
  },
  loginNewUserContainerText: {
    fontFamily: "Poppins",
    fontSize: RFValue(12),
    color: "#000",
  },
});

export default Login;
