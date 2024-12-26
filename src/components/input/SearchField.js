import React from "react";
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
import { AntDesign } from "@expo/vector-icons";

// Constants
import { colors } from "../../assets/constants";

const SearchField = (props) => {
  // Prop Destructuring
  const {
    placeHolder = "",
    value = "",
    onChangeText = () => {},
    onSubmitEditing = () => {},
  } = props;

  return (
    <View style={styles.inputBox}>
      <View style={styles.iconContainer}>
        <AntDesign name="search1" size={hp(2)} color={colors.borderLight} />
      </View>

      {/* Sized Box */}
      <View style={{ width: wp(2) }} />

      <TextInput
        value={value}
        numberOfLines={1}
        style={styles.input}
        placeholder={placeHolder}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderDim,
    borderRadius: 6,
    backgroundColor: "#fff",
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

export default SearchField;
