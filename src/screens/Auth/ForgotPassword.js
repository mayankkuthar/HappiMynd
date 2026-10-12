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

const ForgotPassword = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { snackDispatch, forgotPassword } = useContext(Hcontext);

  // State variables
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = email.length > 0 || mobile.length > 0;

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
      {/* Header */}
      <View style={styles.headerBlock}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.pop()}
          style={styles.backButton}
        >
          <Feather name="chevron-left" size={22} color="#55545E" />
        </TouchableOpacity>
        <Text style={styles.title}>Forgot Password</Text>
      </View>

      {/* Form */}
      <View style={styles.formSection}>
        <InputField
          title="Email Address"
          placeHolder="Enter Email Address"
          borderColor="#D8D8DE"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <View style={{ height: hp(2) }} />

        <View style={styles.separatorRow}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>Or</Text>
          <View style={styles.separatorLine} />
        </View>

        <View style={{ height: hp(2) }} />
        <InputField
          title="Phone Number"
          placeHolder="Enter Phone Number"
          keyboardType="phone-pad"
          borderColor="#D8D8DE"
          value={mobile}
          onChangeText={(text) => setMobile(text)}
        />
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
              Send Verification Code
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
  separatorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E1E0E6",
  },
  separatorText: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    color: "#88878D",
    marginHorizontal: wp(3),
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

export default ForgotPassword;