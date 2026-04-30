import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
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

const ResetPassword = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context variables
  const { snackDispatch, resetPassword } = useContext(Hcontext);

  // State variables
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Mounting
  useEffect(() => {
    console.log("Reset password mounting - ", props.route.params);
  }, []);

  const submitHandler = async () => {
    setLoading(true);
    try {
      // Validations
      if (!password || !confirmPassword) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Please enter both values !",
        });
      }

      if (password !== confirmPassword) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Password mismatch !",
        });
      }

      const { email, mobile } = props.route.params;
      const passRes = await resetPassword({
        email,
        mobile,
        password,
        confirmPassword,
      });

      if (passRes.status === "success") {
        snackDispatch({ type: "SHOW_SNACK", payload: passRes.message });
        navigation.navigate("Login");
      }
    } catch (err) {
      console.log("Some issue while resetting password - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} showLogo={false} showBack={true} />
      <KeyboardAwareScrollView style={{ paddingHorizontal: wp(10) }}>
        <Text style={styles.pageTitle}>Change Password</Text>
        {/* Sized Box */}
        <View style={{ height: hp(4) }} />
        <InputField
          title="Enter New Password"
          placeHolder="Enter New Password"
          password={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {/* Sized Box */}
        <View style={{ height: hp(2) }} />
        <InputField
          title="Confirm New Password"
          placeHolder="Confirm New Password"
          password={true}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
      </KeyboardAwareScrollView>
      <View style={styles.buttonContainer}>
        <Button text="Confirm" loading={loading} pressHandler={submitHandler} />
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

export default ResetPassword;
