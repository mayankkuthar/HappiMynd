import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Linking,
  Animated,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import ImageView from "react-native-image-viewing";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import BlogCard from "../../components/cards/BlogCard";
import Button from "../../components/buttons/Button";
import Capsule from "../../components/common/Capsule";

// ─── Skeleton Block ───────────────────────────────────────────────────────────

const SkeletonBlock = ({ width = "100%", height = 14, style }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: "#ddd",
          borderRadius: 6,
          opacity,
        },
        style,
      ]}
    />
  );
};

// ─── Skeleton Body ────────────────────────────────────────────────────────────

const SkeletonBody = () => (
  <View style={{ paddingHorizontal: wp(10) }}>
    {/* Description */}
    <SkeletonBlock height={14} width="40%" style={{ marginBottom: hp(1) }} />
    <SkeletonBlock height={12} style={{ marginBottom: hp(0.6) }} />
    <SkeletonBlock height={12} style={{ marginBottom: hp(0.6) }} />
    <SkeletonBlock height={12} width="75%" style={{ marginBottom: hp(3) }} />

    {/* Profile */}
    <SkeletonBlock height={14} width="25%" style={{ marginBottom: hp(1) }} />
    <View style={{ flexDirection: "row", gap: wp(2), marginBottom: hp(3) }}>
      <SkeletonBlock height={30} width={wp(22)} style={{ borderRadius: 20 }} />
      <SkeletonBlock height={30} width={wp(28)} style={{ borderRadius: 20 }} />
      <SkeletonBlock height={30} width={wp(18)} style={{ borderRadius: 20 }} />
    </View>

    {/* Keywords */}
    <SkeletonBlock height={14} width="30%" style={{ marginBottom: hp(1) }} />
    <View style={{ flexDirection: "row", gap: wp(2), marginBottom: hp(3) }}>
      <SkeletonBlock height={30} width={wp(20)} style={{ borderRadius: 20 }} />
      <SkeletonBlock height={30} width={wp(25)} style={{ borderRadius: 20 }} />
      <SkeletonBlock height={30} width={wp(15)} style={{ borderRadius: 20 }} />
    </View>

    {/* Credit */}
    <SkeletonBlock height={14} width="20%" style={{ marginBottom: hp(1) }} />
    <SkeletonBlock height={12} width="60%" />
  </View>
);

// ─── Extracted static sub-components ─────────────────────────────────────────

const CapsuleRow = React.memo(({ rawString }) => {
  const items = useMemo(
    () =>
      typeof rawString === "string" && rawString.trim()
        ? rawString
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    [rawString],
  );

  if (!items.length) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {items.map((element, index) => (
        <View key={`${element}-${index}`} style={{ flexDirection: "row" }}>
          <Capsule title={element} />
          <View style={{ width: wp(2) }} />
        </View>
      ))}
    </ScrollView>
  );
});

const RelatedArticles = React.memo(({ articles, navigation }) => {
  if (!articles?.length) return null;

  return (
    <View>
      <View style={{ paddingHorizontal: wp(10) }}>
        <Text
          style={[styles.bodyContentText, { fontFamily: "PoppinsSemiBold" }]}
        >
          Related Articles
        </Text>
      </View>
      <ScrollView horizontal style={styles.relatedContainer}>
        <View style={{ width: wp(10) }} />
        {articles.map((article, index) => (
          <View key={article.id ?? index} style={{ flexDirection: "row" }}>
            <BlogCard navigation={navigation} data={article} />
            <View style={{ width: wp(4) }} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────

const Blog = (props) => {
  const { navigation } = props;
  const routeParams = props.route?.params ?? {};
  const {
    data = {},
    readBlog,
    infographics,
    video,
    image: showImage,
  } = routeParams;
  const { id = null, thumbnail = "", link = "" } = data;

  const { happiLearnContent, snackDispatch, likePost, unlikePost } =
    useContext(Hcontext);

  const [content, setContent] = useState({
    title: "",
    type: "",
    summary: "",
    keywords: "",
    profile: "",
    credit: "",
  });
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openImage, setOpenImage] = useState(false);

  // Fetch on mount — cleanup flag prevents setState on unmounted component
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await happiLearnContent({ id });
        if (cancelled) return;
        if (res?.status === "success") {
          const {
            title,
            type,
            summary,
            keywords,
            profile,
            credit,
            is_likes,
            likes_count,
          } = res.data;
          setContent({ title, type, summary, keywords, profile, credit });
          setLiked(is_likes === "yes");
          setLikesCount(likes_count ?? 0);
          setRelatedArticles(res.suggested_content ?? []);
        }
      } catch (err) {
        console.error("fetchContent error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]); // happiLearnContent is a stable context fn — intentionally omitted

  const likeHandler = useCallback(async () => {
    if (loading) return;
    setLiked(true);
    setLikesCount((c) => c + 1);
    try {
      const res = await likePost({ id });
      if (res?.status !== "success") {
        setLiked(false);
        setLikesCount((c) => c - 1);
      }
    } catch (err) {
      setLiked(false);
      setLikesCount((c) => c - 1);
      console.error("likePost error:", err);
    }
  }, [id, loading, likePost]);

  const unlikeHandler = useCallback(async () => {
    if (loading) return;
    setLiked(false);
    setLikesCount((c) => c - 1);
    try {
      const res = await unlikePost({ id });
      if (res?.status !== "success") {
        setLiked(true);
        setLikesCount((c) => c + 1);
      }
    } catch (err) {
      setLiked(true);
      setLikesCount((c) => c + 1);
      console.error("unlikePost error:", err);
    }
  }, [id, loading, unlikePost]);

  const handleLikeToggle = useCallback(() => {
    liked ? unlikeHandler() : likeHandler();
  }, [liked, likeHandler, unlikeHandler]);

  const handleReadBlog = useCallback(() => {
    if (link) {
      Linking.openURL(link);
    } else {
      snackDispatch({ type: "SHOW_SNACK", payload: "No link attached" });
    }
  }, [link, snackDispatch]);

  // Uses route data.title immediately as fallback — no empty flash on hero
  const displayTitle = useMemo(() => {
    const title = content.title || data?.title || "";
    return title.length > 48 ? title.substring(0, 48) + " ..." : title;
  }, [content.title, data?.title]);

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <ImageBackground
          source={{ uri: thumbnail }}
          style={styles.heroBackground}
          resizeMode="cover"
        >
          <ImageBackground
            source={require("../../assets/images/gradient.png")}
            style={{ flex: 1 }}
            resizeMode="cover"
          >
            <View style={{ height: hp(6) }} />

            {/* Back + Like row */}
            <View style={styles.heroNav}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.pop()}
                style={{ paddingLeft: hp(1.5) }}
              >
                <Ionicons name="ios-chevron-back" size={hp(4)} color="white" />
              </TouchableOpacity>

              {readBlog ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{ paddingRight: hp(2), alignItems: "center" }}
                  onPress={handleLikeToggle}
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

            <View style={{ height: hp(2) }} />

            {/* Hero title + type badge */}
            <View style={{ width: wp(80), paddingHorizontal: hp(3) }}>
              {displayTitle ? (
                <Text style={styles.heroTitle}>{displayTitle}</Text>
              ) : (
                // Skeleton for title in case route data has no title either
                <SkeletonBlock
                  height={22}
                  width="90%"
                  style={{ marginBottom: hp(1), backgroundColor: "#ffffff55" }}
                />
              )}
              <View style={{ height: hp(1) }} />
              {content.type ? (
                <View style={styles.blogButton}>
                  <Text style={styles.blogButtonText}>{content.type}</Text>
                </View>
              ) : (
                <SkeletonBlock
                  height={hp(3)}
                  width={wp(18)}
                  style={{
                    borderRadius: hp(100),
                    backgroundColor: "#ffffff55",
                  }}
                />
              )}
            </View>
          </ImageBackground>
        </ImageBackground>
      </View>

      {/* Body Section */}
      <ScrollView style={styles.bodySection} removeClippedSubviews>
        <View style={{ height: hp(3) }} />

        {loading ? (
          <SkeletonBody />
        ) : (
          <View style={styles.bodyContent}>
            <Text
              style={[
                styles.bodyContentText,
                { fontFamily: "PoppinsSemiBold" },
              ]}
            >
              Description:
            </Text>
            <Text style={styles.bodyContentText}>{content.summary}</Text>

            <View style={{ height: hp(3) }} />
            <Text
              style={[
                styles.bodyContentText,
                { fontFamily: "PoppinsSemiBold" },
              ]}
            >
              Profile:
            </Text>
            <View style={{ height: hp(1) }} />
            <CapsuleRow rawString={content.profile} />

            <View style={{ height: hp(3) }} />
            <Text
              style={[
                styles.bodyContentText,
                { fontFamily: "PoppinsSemiBold" },
              ]}
            >
              Keywords:
            </Text>
            <View style={{ height: hp(1) }} />
            <CapsuleRow rawString={content.keywords} />

            <View style={{ height: hp(3) }} />
            <Text
              style={[
                styles.bodyContentText,
                { fontFamily: "PoppinsSemiBold" },
              ]}
            >
              Credit:
            </Text>
            <View style={{ height: hp(1) }} />
            <Text style={styles.bodyContentText}>{content.credit}</Text>
          </View>
        )}

        <View style={{ height: hp(2.5) }} />
        <RelatedArticles articles={relatedArticles} navigation={navigation} />
      </ScrollView>

      {/* CTA Buttons */}
      {readBlog && (
        <>
          <View style={{ height: wp(5) }} />
          <View style={{ paddingHorizontal: wp(6) }}>
            <Button text="Read Blog" pressHandler={handleReadBlog} />
          </View>
        </>
      )}

      {infographics && (
        <>
          <View style={{ height: wp(5) }} />
          <View style={{ paddingHorizontal: wp(6) }}>
            <Button
              text="View Infographics"
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
      )}

      {video && (
        <>
          <View style={{ height: wp(5) }} />
          <View style={{ paddingHorizontal: wp(6) }}>
            <Button
              text="View Video"
              pressHandler={() => navigation.push("BlogVideo", { ...data })}
            />
          </View>
        </>
      )}

      {showImage && (
        <>
          <View style={{ height: wp(5) }} />
          <View style={{ paddingHorizontal: wp(6) }}>
            <Button
              text="View Image"
              pressHandler={() => navigation.push("BlogImage", { ...data })}
            />
          </View>
        </>
      )}

      <View style={{ height: wp(22) }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(100),
    backgroundColor: colors.background,
  },
  heroSection: {},
  heroBackground: {
    width: wp(100),
    height: hp(35),
  },
  heroNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    width: wp(100),
    height: hp(66),
  },
  bodyContent: {
    paddingHorizontal: wp(10),
  },
  bodyContentText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
  relatedContainer: {
    paddingVertical: hp(2),
  },
  blogLikeText: {
    fontSize: RFValue(10),
    fontFamily: "PoppinsMedium",
    color: "#fff",
  },
});

export default Blog;
