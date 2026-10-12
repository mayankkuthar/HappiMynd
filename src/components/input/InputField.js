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
    onBlur,
    placeholderTextColor = "#B3B3B3",
    borderColor = colors.borderLight,
    iconColor = "black",
    titleSpacing = 4,
  } = props;

  // State variables
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={{ width: "100%" }}>
      <Text style={[styles.text, { paddingBottom: titleSpacing }]}>{title}</Text>
      <View style={[styles.inputBox, { borderColor }]}>
        <TextInput
          style={styles.input}
          placeholder={placeHolder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          secureTextEntry={password ? !showPassword : false}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          editable={editable}
          onBlur={onBlur}
          autoCapitalize="none"
        />
        {password ? (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setShowPassword((prevState) => !prevState)}
          >
            {showPassword ? (
              <Feather name="eye" size={hp(2)} color={iconColor} />
            ) : (
              <Feather name="eye-off" size={hp(2)} color={iconColor} />
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
    backgroundColor: "#FFFFFF",
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
