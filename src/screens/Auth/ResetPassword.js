import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";

// Context
import { Hcontext } from "../../context/Hcontext";

// Components
import InputField from "../../components/input/InputField";

const ResetPassword = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context variables
  const { snackDispatch, resetPassword } = useContext(Hcontext);

  // State variables
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const canSubmit = password.length > 0 && confirmPassword.length > 0;

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
        setPasswordMismatch(true);
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Password mismatch !",
        });
      }

      setPasswordMismatch(false);
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
      {/* Header */}
      <View style={styles.headerBlock}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.pop()}
          style={styles.backButton}
        >
          <Feather name="chevron-left" size={22} color="#55545E" />
        </TouchableOpacity>
        <Text style={styles.title}>Reset Password</Text>
      </View>

      {/* Form */}
      <View style={styles.formSection}>
        <InputField
          title="Enter New Password"
          placeHolder="Enter New Password"
          password
          borderColor="#D8D8DE"
          iconColor="#999999"
          titleSpacing={10}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <View style={{ height: hp(2) }} />
        <InputField
          title="Confirm New Password"
          placeHolder="Confirm New Password"
          password
          borderColor={passwordMismatch ? "#D40000" : "#D8D8DE"}
          iconColor="#999999"
          titleSpacing={10}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (passwordMismatch) setPasswordMismatch(false);
          }}
        />
        {passwordMismatch ? (
          <Text style={styles.mismatchText}>
            New password does not match. Enter new password again
          </Text>
        ) : null}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.submitButton,
            canSubmit ? styles.submitEnabled : styles.submitDisabled,
          ]}
          disabled={!canSubmit || loading}
          onPress={submitHandler}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#AAA7B3" />
          ) : (
            <Text
              style={[
                styles.submitText,
                canSubmit ? styles.submitTextEnabled : styles.submitTextDisabled,
              ]}
            >
              Confirm
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FF",
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 30,
  },
  headerBlock: {
    marginBottom: hp(3),
  },
  backButton: {
    marginTop: hp(2.5),
    marginBottom: hp(1.5),
    alignSelf: "flex-start",
  },
  title: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsMedium",
    color: "#9747FF",
    alignSelf: "flex-start",
  },
  formSection: {
    flex: 1,
  },
  mismatchText: {
    fontSize: RFValue(11),
    fontFamily: "Poppins",
    color: "#D40000",
    textAlign: "right",
    marginTop: hp(0.5),
  },
  footer: {
    justifyContent: "flex-end",
    marginBottom: hp(2),
  },
  submitButton: {
    width: "100%",
    height: hp(4.8),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  submitDisabled: {
    backgroundColor: "#E6DFFF",
  },
  submitEnabled: {
    backgroundColor: "#E6DFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 4,
  },
  submitText: {
    fontSize: RFValue(13),
    fontFamily: "PoppinsMedium",
  },
  submitTextDisabled: {
    color: "#AAA7B3",
  },
  submitTextEnabled: {
    color: "#000",
  },
});

export default ResetPassword;