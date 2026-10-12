import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
import InputField from "../../components/input/InputField";
import Button from "../../components/buttons/Button";

const ChangePassword = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { snackDispatch, changePassword } = useContext(Hcontext);

  // State variables
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitHandler = async () => {
    setLoading(true);
    try {
      // Validations
      if (!oldPassword || !newPassword || !confirmPassword) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "All fields are required !",
        });
      }

      if (newPassword !== confirmPassword) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Password mismatch !",
        });
      }

      const passChangeRes = await changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });

      console.log("The updated passowrd res - ", passChangeRes);

      if (passChangeRes.status === "success") {
        snackDispatch({ type: "SHOW_SNACK", payload: passChangeRes.message });
        navigation.goBack();
      }
    } catch (err) {
      console.log("Some issue while changing password - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} showLogo={false} showBack={true} />

      {/* Body Section */}
      <KeyboardAwareScrollView
        style={{
          paddingHorizontal: wp(10),
        }}
      >
        <View style={{ height: hp(70) }}>
          <Text style={styles.pageTitle}>Change password</Text>

          {/* Sized Box */}
          <View style={{ height: hp(4) }} />

          <View>
            <InputField
              title="Old Password"
              placeHolder="Enter Old Password"
              password
              borderColor="#D4D4D4"
              iconColor="#999999"
              value={oldPassword}
              onChangeText={(text) => setOldPassword(text)}
            />
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.push("ForgotPassword")}>
              <Text style={styles.forgotText}>Forgot Password ?</Text>
            </TouchableOpacity>
            {/* Sized Box */}
            <View style={{ height: hp(2) }} />
            <InputField
              title="Enter New Password"
              placeHolder="Enter New Password"
              password
              borderColor="#D4D4D4"
              iconColor="#999999"
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
            />
            {/* Sized Box */}
            <View style={{ height: hp(2) }} />
            <InputField
              title="Confirm New Password"
              placeHolder="Re-Enter New Password"
              password
              borderColor="#D4D4D4"
              iconColor="#999999"
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            text="Save Changes"
            loading={loading}
            pressHandler={submitHandler}
            containerStyle={styles.saveButton}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  pageTitle: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  forgotText: {
    alignSelf: "flex-end",
    color: "#999999",
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(11),
  },
  buttonContainer: {
    // backgroundColor: "green",
    // position: "absolute",
    width: wp(80),
    alignSelf: "center",
    bottom: hp(3),
  },
  saveButton: {
    backgroundColor: "#E6DFFF",
    height: hp(5.5),
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default ChangePassword;
