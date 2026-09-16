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

const avatarImages = {
  male1: require("../../assets/images/male1.png"),
  male2: require("../../assets/images/male2.png"),
  male3: require("../../assets/images/male3.png"),
  male4: require("../../assets/images/male4.png"),
  male5: require("../../assets/images/male5.png"),
};

const getAvatarImage = (avatar) => {
  if (!avatar) return require("../../assets/images/user_avatar.png");
  const key = String(avatar).split(".")[0].toLowerCase();
  return avatarImages[key] || require("../../assets/images/user_avatar.png");
};

const CustomDrawer = (props) => {
  // Prop Destructuring
  const {} = props;

  // Context variables
  const { authState, whiteLabelState } = useContext(Hcontext);

  const user = authState?.user?.user;

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.imageSection}>
          <Image
            source={getAvatarImage(user?.avatar)}
            resizeMode="cover"
            style={styles.userImage}
          />
          <Text style={styles.userName}>
            {user ? user.username : ""}
          </Text>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        <DrawerItemList {...props}></DrawerItemList>
      </DrawerContentScrollView>

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
          Copyright © 2026 HappiMynd
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDE6FF",
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
    paddingBottom: hp(4),
  },
  poweredText: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
    color: colors.borderLight,
  },
});

export default CustomDrawer;
