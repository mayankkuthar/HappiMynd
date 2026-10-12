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

const VerificationCode = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { snackDispatch, verifyOtp, forgotPassword } = useContext(Hcontext);

  // State Variables
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = otp.length > 0;

  const submitHandler = async () => {
    setLoading(true);
    try {
      if (!otp) {
        setLoading(false);
        return snackDispatch({
          type: "SHOW_SNACK",
          payload: "Please enter OTP !",
        });
      }

      const { email, mobile } = props.route.params;
      const otpRes = await verifyOtp({ email, mobile, otp });

      snackDispatch({ type: "SHOW_SNACK", payload: otpRes.message });

      if (otpRes.status === "success") {
        navigation.push("ResetPassword", { email, mobile });
      }
    } catch (err) {
      console.log("Some issue while Verify Code - ", err);
    }
    setLoading(false);
  };

  const resendCodeHandler = async () => {
    setLoading(true);
    try {
      const { email, mobile } = props.route.params;

      const otpRes = await forgotPassword({ email, mobile });

      snackDispatch({ type: "SHOW_SNACK", payload: otpRes.message });
    } catch (err) {
      console.log("Some issue while resending code - ", err);
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
        <Text style={styles.title}>Verification Code</Text>
      </View>

      {/* Form */}
      <View style={styles.formSection}>
        <InputField
          title="Enter the Verification Code"
          placeHolder="Enter the Verification Code"
          keyboardType="numeric"
          borderColor="#D8D8DE"
          titleSpacing={10}
          value={otp}
          onChangeText={(text) => setOtp(text)}
        />
        <View style={{ height: hp(0.3) }} />
        <View style={styles.resendRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={resendCodeHandler}
          >
            <Text style={styles.resendButtonText}>Resend Code</Text>
          </TouchableOpacity>
        </View>
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
              Continue
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
  resendRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: hp(0.5),
  },
  resendButtonText: {
    fontSize: RFValue(11),
    fontFamily: "Poppins",
    color: "#999999",
    textAlign: "center",
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

export default VerificationCode;