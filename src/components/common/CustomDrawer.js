import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Platform,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constats
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

const CustomDrawer = (props) => {
  // Prop Destructuring
  const {} = props;

  // Context variables
  const { authState, whiteLabelState } = useContext(Hcontext);

  return (
    <ImageBackground
      source={require("../../assets/images/drawer_background.png")}
      style={styles.contaier}
      resizeMode="cover"
    >
      <DrawerContentScrollView {...props}>
        <View style={styles.imageSection}>
          <Image
            source={require("../../assets/images/user_avatar.png")}
            resizeMode="cover"
            style={styles.userImage}
          />
          <Text style={styles.userName}>
            {authState?.user?.user ? authState?.user?.user.username : ""}
          </Text>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        <DrawerItemList {...props}></DrawerItemList>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        <View style={styles.poweredContainer}>
          {authState.userType ===
          "individual" ? null : whiteLabelState.footer ? (
            <Text style={styles.poweredText}>Powered by HappiMynd</Text>
          ) : null}
          <Text style={styles.poweredText}>
            Version {Platform.OS == "ios" ? "V.10.0" : "V.12.0"}
          </Text>

          {/* Sized Box */}
          <View style={{ height: hp(1) }} />

          <Text
            style={{
              ...styles.poweredText,
            }}
          >
            Copyright © 2023 HappiMynd
          </Text>
        </View>
      </DrawerContentScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  contaier: {
    // backgroundColor: "red",
    flex: 1,
  },
  imageSection: {
    // backgroundColor: "orange",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(6),
  },
  userImage: {
    // backgroundColor: "yellow",
    width: hp(7),
    height: hp(7),
  },
  userName: {
    fontSize: RFValue(16),
    fontFamily: "PoppinsSemiBold",
    paddingHorizontal: wp(2),
  },
  poweredContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  poweredText: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
    color: colors.borderLight,
  },
});

export default CustomDrawer;
