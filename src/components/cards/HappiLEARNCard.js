import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

const HappiLEARNCard = (props) => {
  // Prop Destructuring
  const { navigation, readBlog } = props;
  const {
    id = null,
    title = "",
    type = "",
    credit = "",
    image = require("../../assets/images/happiLEARN_blog1.png"),
    screen,
    params,
    thumbnail = "",
    likes_count = 0,
    link = "",
    is_likes = "no",
  } = props.data;

  //console.log("che c on the props - ", props);

  // Context Variables
  const { likePost, unlikePost } = useContext(Hcontext);

  // State Variables
  const [liked, setLiked] = useState(is_likes === "yes");
  const [likeCount, setLikeCount] = useState(likes_count);
  const [loading, setLoading] = useState(false);

  const likeHandler = async (id) => {
    setLoading(true);
    try {
      if (id) {
        const likeRes = await likePost({ id });
        if (likeRes.status === "success") {
          setLiked((prevState) => !prevState);
          setLikeCount((prevState) => prevState + 1);
        }
      }
    } catch (err) {
      console.log("Some issue while liking post - ", err);
    }
    setLoading(false);
  };

  const unlikeHandler = async (id) => {
    setLoading(true);
    try {
      if (id) {
        const unlikeRes = await unlikePost({ id });
        if (unlikeRes.status === "success") {
          setLiked((prevState) => !prevState);
          setLikeCount((prevState) => prevState - 1);
        }
      }
    } catch (err) {
      console.log("Some issue while un-liking post - ", err);
    }
    setLoading(false);
  };

  return (
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
    >
      <ImageBackground
        // source={image}
        source={{ uri: thumbnail }}
        style={styles.blogImageContainer}
        resizeMode="cover"
      >
        {/* Upper Section */}
        <View style={styles.upperSectionContainer}>
          <View style={styles.blogButton}>
            <Text style={styles.blogButtonText}>{type}</Text>
          </View>
          <TouchableOpacity
            disabled={loading}
            activeOpacity={0.7}
            onPress={() => (liked ? unlikeHandler(id) : likeHandler(id))}
            style={{ alignItems: "center" }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons
                  name={liked ? "heart-sharp" : "heart-outline"}
                  size={hp(3)}
                  color={liked ? "red" : "white"}
                />
                <Text style={styles.heartCount}>{likeCount}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        {/* LowerSection */}
        <View style={styles.lowerSectionContainer}>
          <Text style={styles.authorText}>by {credit}</Text>
          <Text style={styles.titleText}>
            {title?.length > 48 ? title.substring(0, 48) + " ..." : title}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  blogImageContainer: {
    // backgroundColor: "red",
    width: wp(80),
    height: hp(28),
    borderRadius: 10,
    overflow: "hidden",
    paddingHorizontal: hp(2),
    paddingVertical: hp(2),
  },
  upperSectionContainer: {
    // backgroundColor: "red",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lowerSectionContainer: {
    // backgroundColor: "blue",
    flex: 1,
  },
  blogButton: {
    backgroundColor: colors.primary,
    height: hp(4),
    paddingHorizontal: hp(2),
    borderRadius: hp(100),
    alignItems: "center",
    justifyContent: "center",
  },
  blogButtonText: {
    fontSize: RFValue(10),
    fontFamily: "PoppinsMedium",
    textAlign: "center",
    color: colors.primaryText,
  },
  heartCount: {
    // color: "#fff",
    color: "#fff",
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(12),
  },
  authorText: {
    fontSize: RFValue(10),
    fontFamily: "PoppinsMedium",
    // color: "#fff",
    color: "#fff",
  },
  titleText: {
    // backgroundColor: "yellow",
    fontSize: RFValue(14),
    fontFamily: "PoppinsBold",
    // color: "#fff",
    color: "#fff",
    width: wp(50),
  },
});

export default HappiLEARNCard;
