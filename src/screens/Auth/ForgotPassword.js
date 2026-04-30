import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// COnstants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
import InputField from "../../components/input/InputField";
import Button from "../../components/buttons/Button";

const ForgotPassword = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { snackDispatch, forgotPassword } = useContext(Hcontext);

  // State variables
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true);
    try {
      if (!email && !mobile) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Please enter email or phone !",
        });
      }

      const passRes = await forgotPassword({ email, mobile });

      if (passRes.status === "success") {
        snackDispatch({ type: "SHOW_SNACK", payload: passRes.message });
        navigation.push("VerificationCode", { email, mobile });
      }
    } catch (err) {
      console.log("Some issue while forgot pass handler - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} showLogo={false} showBack={true} />
      <KeyboardAwareScrollView style={{ paddingHorizontal: wp(10) }}>
        <Text style={styles.pageTitle}>Forgot Password</Text>
        {/* Sized Box */}
        <View style={{ height: hp(4) }} />
        <InputField
          title="Enter Email Address"
          placeHolder="Enter Email Address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        {/* Sized Box */}
        <View style={{ height: hp(2) }} />
        <Text style={styles.choiceText}>OR</Text>
        {/* Sized Box */}
        <View style={{ height: hp(2) }} />
        <InputField
          title="Enter Phone Number"
          placeHolder="Enter Phone Number"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={(text) => setMobile(text)}
        />
      </KeyboardAwareScrollView>
      <View style={styles.buttonContainer}>
        <Button
          text="Send Verification Code"
          pressHandler={submitHandler}
          loading={loading}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E3FDFE",
    flex: 1,
  },
  pageTitle: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  choiceText: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    color: "#ABB6B6",
    textAlign: "center",
  },
  buttonContainer: {
    // backgroundColor: "red",
    width: wp(100),
    paddingHorizontal: wp(10),
    position: "absolute",
    bottom: hp(4),
  },
});

export default ForgotPassword;
