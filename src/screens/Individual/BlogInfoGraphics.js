import React, { useContext, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

// Constants
import { colors } from "../../assets/constants";

// Components
import Capsule from "../../components/common/Capsule";
import { Hcontext } from "../../context/Hcontext";

const Header = (props) => {
  // Prop Destructuring
  const {
    navigation,
    likesCount,
    isLiked,
    unlikeHandler,
    likeHandler,
    loading,
  } = props;

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.pop()}
        style={{ paddingLeft: hp(1.5) }}
      >
        <Ionicons name="ios-chevron-back" size={hp(4)} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{ paddingRight: hp(2), alignItems: "center" }}
        onPress={isLiked ? unlikeHandler : likeHandler}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Ionicons
              name={isLiked ? "heart-sharp" : "heart-outline"}
              size={hp(3)}
              color={isLiked ? "red" : "black"}
            />
            <Text style={styles.blogLikeText}>{likesCount}</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const BlogInfoGraphics = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  const {
    id = null,
    title = "",
    summary = "",
    credit = "",
    likes_count = 0,
    is_likes = "no",
  } = props.route.params;

  // Context Variables
  const { likePost, unlikePost } = useContext(Hcontext);

  // State Variables
  const [liked, setLiked] = useState(is_likes === "yes");
  const [likeCount, setLikeCount] = useState(likes_count);
  const [loading, setLoading] = useState(false);

  const likeHandler = async (id) => {
    setLoading(true);
    try {
      const likeRes = await likePost({ id });
      if (likeRes.status === "success") {
        setLiked((prevState) => !prevState);
        setLikeCount((prevState) => prevState + 1);
      }
    } catch (err) {
      console.log("Some issue while liking post - ", err);
    }
    setLoading(false);
  };

  const unlikeHandler = async (id) => {
    setLoading(true);
    try {
      const unlikeRes = await unlikePost({ id });
      if (unlikeRes.status === "success") {
        setLiked((prevState) => !prevState);
        setLikeCount((prevState) => prevState - 1);
      }
    } catch (err) {
      console.log("Some issue while un-liking post - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Header
        navigation={navigation}
        likesCount={likeCount}
        isLiked={liked}
        likeHandler={() => likeHandler(id)}
        unlikeHandler={() => unlikeHandler(id)}
        loading={loading}
      />

      <View style={{ paddingHorizontal: wp(10) }}>
        <Text style={styles.heroTitle}>{title}</Text>
        {/* Sized Box */}
        <View style={{ height: hp(1) }} />

        <View>
          <Text style={styles.bodyContentText}>by {credit}</Text>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={require("../../assets/images/blog1.png")}
            style={styles.heroBackground}
            resizeMode="cover"
          ></ImageBackground>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <View>
            <Text style={styles.bodyContentText}>{summary}</Text>
          </View>
          {/* Sized Box */}
          <View style={{ height: hp(35) }} />
        </ScrollView>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  headerContainer: {
    // backgroundColor: "yellow",
    width: wp(100),
    height: hp(12),
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingBottom: hp(2),
  },
  heroTitle: {
    fontSize: RFValue(22),
    fontFamily: "PoppinsMedium",
    color: colors.borderDark,
  },
  heroBackground: {
    width: wp(80),
    height: hp(30),
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  bodyContentText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
});

export default BlogInfoGraphics;
