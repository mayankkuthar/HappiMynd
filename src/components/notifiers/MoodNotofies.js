import React, { useState, useEffect, useContext } from "react";
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
import { MaterialIcons } from "@expo/vector-icons";

// Context
import { Hcontext } from "../../context/Hcontext";
import { colors } from "../../assets/constants";

const MoodNotifies = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { selectedMood } = useContext(Hcontext);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setTimeout(() => {
        // checkCurrentPsycologist();
      }, 1000);
    });

    return unsubscribe;
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{ display: selectedMood ? "flex" : "none" }}
      onPress={() => {}}
    >
      <ImageBackground
        source={require("../../assets/images/session_background.png")}
        resizeMode="cover"
        style={styles.messageContainer}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.messageText}>
            Based on your mood we Recommend you{" "}
            {[2, 3, 4, 6, 9].includes(selectedMood?.id)
              ? "HappiBUDDY"
              : "HappiSELF"}
          </Text>

          <MaterialIcons name="mood" size={hp(3.8)} color="#749695" />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default MoodNotifies;

const styles = StyleSheet.create({
  messageContainer: {
    // backgroundColor: "red",
    backgroundColor: colors.background,
    height: hp(8),
    width: wp(90),
    alignSelf: "center",
    borderRadius: hp(4),
    // alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(6),
    marginBottom: hp(2),
  },
  messageText: {
    // backgroundColor: "yellow",
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    width: wp(65),
  },
  unreadContainer: {
    position: "absolute",
    backgroundColor: "red",
    top: -hp(1),
    right: -hp(1),
    height: hp(3),
    width: hp(3),
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: hp(1),
    // paddingVertical: hp(0.5),
    borderRadius: hp(100),
  },
});
