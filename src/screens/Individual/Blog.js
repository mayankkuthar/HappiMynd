import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import ImageView from "react-native-image-viewing";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import BlogCard from "../../components/cards/BlogCard";
import Button from "../../components/buttons/Button";
import Capsule from "../../components/common/Capsule";

const Blog = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  const {
    id = null,
    thumbnail = "",
    link = "",
    // title = "",
    // type = "",
    // summary = "",
    // keywords = "",
    // profile = "",
    // credit = "",
  } = props.route.params.data;

  // Context Variables
  const { happiLearnContent, snackDispatch, likePost, unlikePost } =
    useContext(Hcontext);

  // State Variables
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState("");
  const [profile, setProfile] = useState("");
  const [credit, setCredit] = useState("");
  const [liked, setLiked] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openImage, setOpenImage] = useState(false);

  // Mounting
  useEffect(() => {
    fetchContent(id);
  }, []);

  // Fetching the content by id
  const fetchContent = async (id) => {
    setLoading(true);
    try {
      const fetchedContent = await happiLearnContent({ id });
      console.log("cgehcking the happi content - ", fetchedContent);
      if (fetchedContent.status === "success") {
        const {
          title,
          type,
          summary,
          keywords,
          profile,
          credit,
          is_likes,
          likes_count,
        } = fetchedContent.data;
        setTitle(title);
        setType(type);
        setSummary(summary);
        setKeywords(keywords);
        setProfile(profile);
        setCredit(credit);
        setLiked(is_likes === "yes");
        setLikesCount(likes_count);
        setRelatedArticles(fetchedContent.suggested_content);
      }
    } catch (err) {
      console.log("Some issue while fetching content - ", err);
    }
    setLoading(false);
  };

  const likeHandler = async (id) => {
    setLoading(true);
    try {
      const likeRes = await likePost({ id });
      if (likeRes.status === "success") {
        setLiked((prevState) => !prevState);
        setLikesCount((prevState) => prevState + 1);
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
        setLikesCount((prevState) => prevState - 1);
      }
    } catch (err) {
      console.log("Some issue while un-liking post - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <ImageBackground
          // source={require("../../assets/images/blog1.png")}
          source={{ uri: thumbnail }}
          style={styles.heroBackground}
          resizeMode="cover"
        >
          {/* <View style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", flex: 1 }}> */}
          <ImageBackground
            source={require("../../assets/images/gradient.png")}
            style={{ flex: 1 }}
            resizeMode="cover"
          >
            {/* Sized Box */}
            <View style={{ height: hp(6) }} />

            {/* Back Icon */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.pop()}
                style={{ paddingLeft: hp(1.5) }}
              >
                <Ionicons name="ios-chevron-back" size={hp(4)} color="white" />
              </TouchableOpacity>
              {props.route &&
              props.route.params &&
              props.route.params.readBlog ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{ paddingRight: hp(2), alignItems: "center" }}
                  onPress={() => (liked ? unlikeHandler(id) : likeHandler(id))}
                >
                  <Ionicons
                    name={liked ? "heart-sharp" : "heart-outline"}
                    size={hp(3)}
                    color={liked ? "red" : "white"}
                  />
                  <Text style={styles.blogLikeText}>{likesCount}</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Sized Box */}
            <View style={{ height: hp(2) }} />

            {/* Hero Title */}
            <View style={{ width: wp(80), paddingHorizontal: hp(3) }}>
              <Text style={styles.heroTitle}>
                {title?.length > 48 ? title.substring(0, 48) + " ..." : title}
              </Text>

              {/* Sized Box */}
              <View style={{ height: hp(1) }} />

              <View style={styles.blogButton}>
                <Text style={styles.blogButtonText}>{type}</Text>
              </View>
            </View>
          </ImageBackground>
        </ImageBackground>
      </View>

      {/* Body Section */}
      <ScrollView style={styles.bodySection}>
        {/* Sized Box */}
        <View style={{ height: hp(3) }} />

        {/* Body Content */}
        <View style={styles.bodyContent}>
          <Text
            style={{
              ...styles.bodyContentText,
              fontFamily: "PoppinsSemiBold",
            }}
          >
            Description:
          </Text>
          <Text style={styles.bodyContentText}>{summary}</Text>
          {/* Sized Box */}
          <View style={{ height: hp(3) }} />
          <Text
            style={{
              ...styles.bodyContentText,
              fontFamily: "PoppinsSemiBold",
            }}
          >
            Profile:
          </Text>
          {/* Sized Box */}
          {console.log("profile =======",profile)}
          <View style={{ height: hp(1) }} />
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {profile.split(",").map((element, index) => (
              <>
                <Capsule title={element} />

                {/* Sized Box */}
                <View style={{ width: wp(2) }} />
              </>
            ))}
          </ScrollView>
          {/* Sized Box */}
          <View style={{ height: hp(3) }} />
          <Text
            style={{
              ...styles.bodyContentText,
              fontFamily: "PoppinsSemiBold",
            }}
          >
            Keywords:
          </Text>
          {/* Sized Box */}
          <View style={{ height: hp(1) }} />
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {keywords.split(",").map((element, index) => (
              <>
                <Capsule title={element} />
                {/* Sized Box */}
                <View style={{ width: wp(2) }} />
              </>
            ))}
          </ScrollView>
          {/* Sized Box */}
          <View style={{ height: hp(3) }} />
          <Text
            style={{
              ...styles.bodyContentText,
              fontFamily: "PoppinsSemiBold",
            }}
          >
            Credit:
          </Text>
          {/* Sized Box */}
          <View style={{ height: hp(1) }} />
          <Text style={styles.bodyContentText}>{credit}</Text>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2.5) }} />

        {/* Related Section */}
        {relatedArticles?.length ? (
          <View>
            <View style={{ paddingHorizontal: wp(10) }}>
              <Text
                style={{
                  ...styles.bodyContentText,
                  fontFamily: "PoppinsSemiBold",
                }}
              >
                Related Articles
              </Text>
            </View>
            <ScrollView horizontal={true} style={styles.relatedContainer}>
              {/* Sized Box */}
              <View style={{ width: wp(10) }} />

              {relatedArticles.map((article, index) => (
                <>
                  <BlogCard
                    key={index}
                    navigation={navigation}
                    data={article}
                  />
                  {/* Sized Box */}
                  <View style={{ width: wp(4) }} />
                </>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
      {props.route && props.route.params && props.route.params.readBlog ? (
        <>
          {/* Sized Box */}
          <View style={{ height: wp(5) }} />
          <View style={{ paddingHorizontal: wp(6) }}>
            <Button
              text="Read Blog"
              // pressHandler={() =>
              //   navigation.push("BlogRead", { ...props.route.params.data })
              // }
              pressHandler={() => {
                if (props?.route?.params?.data?.link) {
                  Linking.openURL(props?.route?.params?.data?.link);
                } else
                  snackDispatch({
                    type: "SHOW_SNACK",
                    payload: "No link attached",
                  });
              }}
            />
          </View>
        </>
      ) : null}
      {props.route && props.route.params && props.route.params.infographics ? (
        <>
          {/* Sized Box */}
          <View style={{ height: wp(5) }} />
          <View style={{ paddingHorizontal: wp(6) }}>
            <Button
              text="View Infographics"
              // pressHandler={() =>
              //   navigation.push("BlogInfoGraphics", {
              //     ...props.route.params.data,
              //   })
              // }
              pressHandler={() => setOpenImage(true)}
            />
          </View>
          <ImageView
            images={[{ uri: link }]}
            imageIndex={0}
            visible={openImage}
            onRequestClose={() => setOpenImage(false)}
            swipeToCloseEnabled={false}
            doubleTapToZoomEnabled
          />
        </>
      ) : null}
      {props.route && props.route.params && props.route.params.video ? (
        <>
          {/* Sized Box */}
          <View style={{ height: wp(5) }} />
          <View style={{ paddingHorizontal: wp(6) }}>
            <Button
              text="View Video"
              pressHandler={() =>
                navigation.push("BlogVideo", {
                  ...props.route.params.data,
                })
              }
            />
          </View>
        </>
      ) : null}
      {props.route && props.route.params && props.route.params.image ? (
        <>
          {/* Sized Box */}
          <View style={{ height: wp(5) }} />
          <View style={{ paddingHorizontal: wp(6) }}>
            <Button
              text="View Image"
              pressHandler={() =>
                navigation.push("BlogImage", {
                  ...props.route.params.data,
                })
              }
            />
          </View>
        </>
      ) : null}
      {/* Sized Box */}
      <View style={{ height: wp(22) }} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: hp(100),
    backgroundColor: colors.background,
  },
  heroSection: {
    // backgroundColor: "red",
  },
  heroBackground: {
    width: wp(100),
    height: hp(35),
    // paddingHorizontal: hp(3),
  },
  heroTitle: {
    fontSize: RFValue(22),
    fontFamily: "PoppinsMedium",
    color: "#fff",
  },
  blogButton: {
    backgroundColor: colors.primary,
    height: hp(3),
    width: wp(18),
    // paddingHorizontal: hp(2),
    borderRadius: hp(100),
    alignItems: "center",
    justifyContent: "center",
  },
  blogButtonText: {
    fontSize: RFValue(8),
    fontFamily: "PoppinsMedium",
    textAlign: "center",
    color: colors.primaryText,
  },
  bodySection: {
    backgroundColor: colors.background,
    // flex: 1,
    width: wp(100),
    height: hp(66),
    // borderTopLeftRadius: 60,
    // borderTopRightRadius: 60,
    // position: "absolute",
    // bottom: 0,
  },
  bodyContent: {
    // backgroundColor: "yellow",
    paddingHorizontal: wp(10),
  },
  bodyContentText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
  relatedContainer: {
    // backgroundColor: "green",
    paddingVertical: hp(2),
  },
  relatedAritcles: {
    height: hp(22),
    width: wp(80),
    borderRadius: 16,
    overflow: "hidden",
  },
  blogLikeText: {
    fontSize: RFValue(10),
    fontFamily: "PoppinsMedium",
    color: "#fff",
  },
});

export default Blog;
