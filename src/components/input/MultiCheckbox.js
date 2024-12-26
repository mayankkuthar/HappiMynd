import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import CheckBox from "react-native-check-box";

// Constants
import { colors } from "../../assets/constants";

const MultiCheckbox = (props) => {
  // Prop Destructuring
  const {
    id,
    title,
    selectedOptions = [],
    setSelectedOptions = () => {},
  } = props;

  // State Variables
  const [checked, setChecked] = useState(false);

  // Updatig Phase
  useEffect(() => {
    let selectedOne = [];
    if (checked) selectedOne = [...selectedOptions, id];
    else selectedOne = selectedOptions.filter((option) => option !== id);

    setSelectedOptions(selectedOne);
  }, [checked]);

  return (
    <CheckBox
      style={{ flex: 1, paddingRight: 10 }}
      onClick={() => setChecked((prevState) => !prevState)}
      isChecked={checked}
      rightText={title}
      unCheckedImage={<View style={styles.unCheckContainer}></View>}
      checkedImage={
        <View style={styles.checkContainer}>
          <Image
            source={require("../../assets/images/check.png")}
            style={styles.check}
            resizeMode="contain"
          />
        </View>
      }
      rightTextStyle={styles.text}
    />
  );
};

const styles = StyleSheet.create({
  unCheckContainer: {
    borderWidth: 2,
    borderColor: colors.borderLight,
    width: hp(2.5),
    height: hp(2.5),
  },
  checkContainer: {
    borderWidth: 2,
    borderColor: colors.borderLight,
    padding: 2,
  },
  check: {
    // backgroundColor: "green",
    width: hp(1.5),
    height: hp(1.5),
  },
  text: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
});

export default MultiCheckbox;
