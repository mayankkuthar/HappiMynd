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

const PhoneInputField = (props) => {
  // Prop Destructuring
  const {
    title = "",
    placeHolder = "",
    keyboardType = "number-pad",
    onChangeText,
    value = "",
    editable = true,
  } = props;

  return (
    <View style={{ width: "100%" }}>
      <Text style={styles.text}>{title}</Text>
      <View style={styles.inputBox}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: RFValue(12), fontFamily: "Poppins" }}>
            +91
          </Text>
        </View>
        {/* Sized Box */}
        <View style={{ width: wp(2) }} />
        <TextInput
          style={styles.input}
          placeholder={placeHolder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          editable={editable}
          autoCapitalize="none"
        />
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

export default PhoneInputField;
