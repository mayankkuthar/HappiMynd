import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
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
              value={oldPassword}
              onChangeText={(text) => setOldPassword(text)}
            />
            {/* Sized Box */}
            <View style={{ height: hp(2) }} />
            <InputField
              title="Enter New Password"
              placeHolder="Enter New Password"
              password
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
            />
            {/* Sized Box */}
            <View style={{ height: hp(2) }} />
            <InputField
              title="Confirm New Password"
              placeHolder="Re-Enter New Password"
              password
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
  buttonContainer: {
    // backgroundColor: "green",
    // position: "absolute",
    width: wp(80),
    alignSelf: "center",
    bottom: hp(3),
  },
});

export default ChangePassword;
