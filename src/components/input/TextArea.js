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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Constants
import { Hcontext } from "../../context/Hcontext";
import { colors } from "../../assets/constants";

const TextArea = (props) => {
  // Prop Destructuring
  const {
    title = "",
    placeHolder = "",
    onChangeText = () => {},
    value = "",
  } = props;
  return (
    <View style={{ width: "100%" }}>
      <Text style={styles.text}>{title}</Text>

      <TextInput
        style={styles.textArea}
        numberOfLines={10}
        multiline={true}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeHolder}
      />
    </View>
  );
  //   return (
  //     <TextInput
  //       style={styles.textArea}
  //       numberOfLines={10}
  //       multiline={true}
  //       onChange={onChange}
  //       value={value}
  //       placeholder={placeHolder}
  //     />
  //   );
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
  textArea: {
    backgroundColor: "#EFFEFE",
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: hp(1),
    height: hp(16),
    textAlignVertical: "top",
    paddingHorizontal: hp(1),
    paddingVertical: hp(1),
  },
});

export default TextArea;
