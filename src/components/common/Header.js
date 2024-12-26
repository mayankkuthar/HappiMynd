import React, { useEffect, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

// Context
import { Hcontext } from "../../context/Hcontext";

// Constatnts
import { colors } from "../../assets/constants";

const Header = (props) => {
  // Context Variables
  const { whiteLabelState } = useContext(Hcontext);

  // Prop Destructuring
  const {
    navigation,
    showNav = true,
    showLogo = true,
    showBack = false,
    showPoints = false,
    rewardPoints = 0,
  } = props;

  // Mounting
  useEffect(() => {}, []);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerBox}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            showBack ? navigation.pop() : navigation.openDrawer()
          }
        >
          {showBack ? (
            <Ionicons name="ios-chevron-back" size={hp(4)} color="black" />
          ) : showNav ? (
            <Feather name="align-left" size={hp(3)} color="black" />
          ) : null}
        </TouchableOpacity>
        {/* {console.log("check teh white label rss - ", whiteLabelState)} */}
        <Image
          source={
            whiteLabelState.logo
              ? { uri: whiteLabelState.logo }
              : require("../../assets/images/happimynd_logo.png")
          }
          style={{ ...styles.headerLogo, opacity: showLogo ? 1 : 0 }}
          resizeMode="contain"
        />
        <Text style={{ color: colors.backgroundLight, opacity: 0 }}></Text>
        {showPoints ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.push("Moods")}
            style={styles.pointsContainer}
          >
            <Text style={styles.pointsText}>YOUR POINTS</Text>
            <Text
              style={{
                ...styles.pointsText,
                color: colors.primaryText,
                fontSize: RFValue(12),
              }}
            >
              {rewardPoints}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    // backgroundColor: "red",
    width: wp(100),
    height: hp(14),
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerBox: {
    // backgroundColor: "yellow",
    width: wp(100),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLogo: {
    // backgroundColor: "green",
    width: wp(28),
    height: hp(7),
  },
  pointsContainer: {
    position: "absolute",
    right: wp(6),
    backgroundColor: "#A6E4E6",
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: hp(1),
    paddingVertical: hp(1),
  },
  pointsText: {
    fontSize: RFValue(8),
    fontFamily: "PoppinsMedium",
  },
});

export default Header;
