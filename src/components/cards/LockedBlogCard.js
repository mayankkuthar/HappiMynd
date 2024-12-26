import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";

// Constatnts
import { colors } from "../../assets/constants";

const LockedBlogCard = (props) => {
  // Prop Destructuring
  const { navigation, showUpgradeModal, setShowUpgradeModal, data } = props;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setShowUpgradeModal(true)}
    >
      <ImageBackground
        // source={require("../../assets/images/happiLEARN_blog2.png")}
        source={{ uri: data?.thumbnail }}
        style={styles.blogImage}
        resizeMode="cover"
      >
        <View style={styles.blogBox}>
          <Text style={styles.blogText}>{data?.title}</Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.push("Blog")}
            style={styles.blogButton}
          >
            <Text style={styles.blogButtonText}>Read More</Text>
          </TouchableOpacity>
        </View>

        {/* Lock Container */}
        <View style={styles.lockContainer}>
          <Feather name="lock" size={hp(3)} color="white" />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  blogImage: {
    // backgroundColor: "red",
    width: wp(80),
    height: hp(20),
    borderRadius: 20,
    overflow: "hidden",
    marginRight: wp(3),
  },
  blogBox: {
    // backgroundColor: "rgba(0,0,0,0.4)",
    // opacity: 0.2,
    flex: 1,
    justifyContent: "center",
    paddingLeft: hp(2),
  },
  blogText: {
    fontSize: RFValue(13),
    fontFamily: "PoppinsBold",
    color: "#fff",
  },
  blogButton: {
    borderWidth: 2,
    borderRadius: 50,
    borderColor: "#fff",
    width: wp(30),
    paddingHorizontal: hp(2),
    paddingVertical: hp(1),
  },
  blogButtonText: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    color: "#fff",
    textAlign: "center",
  },
  lockContainer: {
    backgroundColor: "rgba(0,0,0,0.6)",
    position: "absolute",
    width: "100%",
    height: "100%",
    paddingHorizontal: hp(2),
    paddingVertical: hp(2),
    alignItems: "flex-end",
  },
});

export default LockedBlogCard;
