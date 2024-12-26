import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const CategoryButton = (props) => {
  // Prop Destructuring
  const {
    text = "Category",
    icon = require("../../assets/images/category_people.png"),
    iconSize = 3.5,
    pressHandler = () => {},
  } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        ...styles.container,
        opacity:
          text == "Join Community" ? 0 : text == "Extra Services" ? 0 : 1,
      }}
      disabled={text == "Join Community" || text == "Extra Services"}
      onPress={pressHandler}
    >
      <ImageBackground
        source={require("../../assets/images/category_background1.png")}
        style={styles.backImage}
      >
        <Image
          source={icon}
          style={{ width: hp(iconSize), height: hp(iconSize) }}
          resizeMode="contain"
        />
      </ImageBackground>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red",
    alignItems: "center",
  },
  backImage: {
    // backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "center",
    width: wp(20),
    height: hp(12),
  },
  text: {
    fontSize: RFValue(9),
    fontFamily: "Poppins",
  },
});

export default CategoryButton;
