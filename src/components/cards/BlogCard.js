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

const BlogCard = (props) => {
  // Prop Destructuring
  const { navigation, data, setShowUpgradeModal = () => {} } = props;
  const { thumbnail = "", title = "", id = 0, type = "blog" } = data;

  //console.log("The related card prop - ", props?.data);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        data?.status === "paid" && !data?.is_subscribe
          ? setShowUpgradeModal(true)
          : null
      }
    >
      <ImageBackground
        // source={require("../../assets/images/blog1.png")}
        source={{ uri: thumbnail }}
        style={styles.blogImage}
        resizeMode="cover"
      >
        <View style={styles.blogBox}>
          <Text style={styles.blogText}>{title}</Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigation.push("Blog", {
                readBlog: type === "blog",
                infographics: type === "infographics",
                video: type === "video",
                image: type === "image",
                ...props,
              })
            }
            // onPress={() =>
            //   navigation.push("Blog", {
            //     readBlog: props?.data?.type === "blog",
            //     infographics: props?.data?.type === "infographics",
            //     video: props?.data?.type === "video",
            //     image: props?.data?.type === "image",
            //     ...props?.data,
            //   })
            // }
            style={styles.blogButton}
          >
            <Text style={styles.blogButtonText}>Read More</Text>
          </TouchableOpacity>
        </View>
        {/* Lock Container */}
        {data?.status === "paid" && !data?.is_subscribe ? (
          <View style={styles.lockContainer}>
            <Feather name="lock" size={hp(3)} color="white" />
          </View>
        ) : null}
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
    backgroundColor: "rgba(0,0,0,0.4)",
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

export default BlogCard;
