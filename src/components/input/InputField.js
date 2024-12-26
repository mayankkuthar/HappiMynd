import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";

// Constants
import { colors } from "../../assets/constants";

const InputField = (props) => {
  // Prop Destructuring
  const {
    title,
    placeHolder,
    password = false,
    keyboardType,
    onChangeText,
    value = "",
    editable = true,
  } = props;

  // State variables
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={{ width: "100%" }}>
      <Text style={styles.text}>{title}</Text>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder={placeHolder}
          value={value}
          secureTextEntry={password ? !showPassword : false}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          editable={editable}
          autoCapitalize="none"
        />
        {password ? (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setShowPassword((prevState) => !prevState)}
          >
            {showPassword ? (
              <Feather name="eye" size={hp(2)} color="black" />
            ) : (
              <Feather name="eye-off" size={hp(2)} color="black" />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: RFValue(12),
    // color: "#758080",
    color: "#000",
    fontFamily: "Poppins",
    paddingBottom: 4,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 6,
    backgroundColor: "#EFFEFE",
    paddingHorizontal: hp(1.5),
    // paddingVertical: hp(0),
    marginBottom: 6,
    height: hp(5),
    fontSize: RFValue(10),
    fontFamily: "Poppins",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    // backgroundColor: "red",
    flex: 1,
    height: "100%",
    fontSize: RFValue(12),
  },
  iconContainer: {
    // backgroundColor: "yellow",
    // flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default InputField;
