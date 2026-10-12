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
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Button from "../../components/buttons/Button";

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
  <View style={{ paddingHorizontal: 15 }}>
    {/* Description */}
    <SkeletonBlock height={14} width="40%" style={{ marginBottom: hp(1) }} />
    <SkeletonBlock height={12} style={{ marginBottom: hp(0.6) }} />
    <SkeletonBlock height={12} style={{ marginBottom: hp(0.6) }} />
    <SkeletonBlock height={12} width="75%" style={{ marginBottom: hp(3) }} />

    {/* Profile */}
    <SkeletonBlock height={14} width="25%" style={{ marginBottom: hp(1) }} />
    <View style={{ flexDirection: "row", marginBottom: hp(3) }}>
      <SkeletonBlock height={29} width={70} style={{ borderRadius: 7 }} />
      <View style={{ width: 10 }} />
      <SkeletonBlock height={29} width={90} style={{ borderRadius: 7 }} />
      <View style={{ width: 10 }} />
      <SkeletonBlock height={29} width={60} style={{ borderRadius: 7 }} />
    </View>

    {/* Keywords */}
    <SkeletonBlock height={14} width="30%" style={{ marginBottom: hp(1) }} />
    <View style={{ flexDirection: "row", marginBottom: hp(3) }}>
      <SkeletonBlock height={29} width={70} style={{ borderRadius: 7 }} />
      <View style={{ width: 10 }} />
      <SkeletonBlock height={29} width={90} style={{ borderRadius: 7 }} />
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
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {items.map((element, index) => (
        <View key={`${element}-${index}`} style={styles.tagChip}>
          <Text style={styles.tagChipText}>{element}</Text>
        </View>
      ))}
    </View>
  );
});

const RelatedArticles = React.memo(({ articles, navigation }) => {
  if (!articles?.length) return null;

  return (
    <View style={styles.relatedSection}>
      <Text style={[styles.bodyHeading, { marginBottom: 14 }]}>
        Related Articles
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {articles.map((article, index) => {
          const locked = article?.status === "paid" && !article?.is_subscribe;

          return (
            <TouchableOpacity
              key={article.id ?? index}
              activeOpacity={0.8}
              style={styles.relatedItem}
              onPress={() => {
                if (locked) return;
                navigation.push("Blog", {
                  data: article,
                  readBlog: article?.type === "blog",
                  infographics: article?.type === "infographics",
                  video: article?.type === "video",
                  image: article?.type === "image",
                });
              }}
            >
              <ImageBackground
                source={{ uri: article?.thumbnail }}
                style={styles.relatedCard}
                resizeMode="cover"
              >
                <View style={styles.relatedOverlay} />
                <View style={styles.relatedCardContent}>
                  <Text style={styles.relatedTitle} numberOfLines={2}>
                    {article?.title}
                  </Text>
                </View>
                <View style={styles.readMoreButton}>
                  <Text style={styles.readMoreButtonText}>Read More</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────

const Blog = (props) => {
  const { navigation } = props;
  const insets = useSafeAreaInsets();
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
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.pop()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color="#4B4854" />
        </TouchableOpacity>

        {readBlog ? (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.likeButton}
            onPress={handleLikeToggle}
          >
            <Ionicons
              name={liked ? "heart-sharp" : "heart-outline"}
              size={20}
              color={liked ? "#E04E39" : "#4B4854"}
            />
            <Text style={styles.blogLikeText}>{likesCount}</Text>
          </TouchableOpacity>
        ) : null}
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <ImageBackground
          source={{ uri: thumbnail }}
          style={styles.heroBackground}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            {displayTitle ? (
              <Text style={styles.heroTitle}>{displayTitle}</Text>
            ) : (
              <SkeletonBlock
                height={22}
                width="90%"
                style={{ marginBottom: hp(1), backgroundColor: "#ffffff55" }}
              />
            )}
            <View style={{ height: hp(1) }} />
            {content.type ? (
              <View style={styles.categoryButton}>
                <Text style={styles.categoryButtonText}>{content.type}</Text>
              </View>
            ) : (
              <SkeletonBlock
                height={34}
                width={48}
                style={{
                  borderRadius: 7,
                  backgroundColor: "#ffffff55",
                }}
              />
            )}
          </View>
        </ImageBackground>
      </View>

      {/* Body Section */}
      <ScrollView style={styles.bodySection} removeClippedSubviews>
        <View style={{ height: hp(3) }} />

        {loading ? (
          <SkeletonBody />
        ) : (
          <View style={styles.bodyContent}>
            <Text style={styles.bodyHeading}>Description</Text>
            <Text style={styles.descriptionText}>{content.summary}</Text>

            <Text style={styles.bodyHeading}>Profile</Text>
            <CapsuleRow rawString={content.profile} />

            <Text style={styles.bodyHeading}>Keywords</Text>
            <CapsuleRow rawString={content.keywords} />

            <Text style={styles.bodyHeading}>Credit</Text>
            <Text style={styles.descriptionText}>{content.credit}</Text>
          </View>
        )}

        <RelatedArticles articles={relatedArticles} navigation={navigation} />

        {/* CTA Buttons */}
        <View style={styles.ctaWrap}>
          {readBlog && (
            <Button text="Read Blog" pressHandler={handleReadBlog} containerStyle={styles.ctaButton} textStyle={styles.ctaButtonText} />
          )}

          {infographics && (
            <>
              <Button
                text="View Infographics"
                pressHandler={() => setOpenImage(true)}
                containerStyle={styles.ctaButton}
                textStyle={styles.ctaButtonText}
              />
              <View style={{ height: 10 }} />
            </>
          )}

          {video && (
            <Button
              text="View Video"
              pressHandler={() => navigation.push("BlogVideo", { ...data })}
              containerStyle={styles.ctaButton}
              textStyle={styles.ctaButtonText}
            />
          )}

          {showImage && (
            <Button
              text="View Image"
              pressHandler={() => navigation.push("BlogImage", { ...data })}
              containerStyle={styles.ctaButton}
              textStyle={styles.ctaButtonText}
            />
          )}
        </View>
      </ScrollView>

      <ImageView
        images={[{ uri: link }]}
        imageIndex={0}
        visible={openImage}
        onRequestClose={() => setOpenImage(false)}
        swipeToCloseEnabled={false}
        doubleTapToZoomEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F7FE",
  },
  header: {
    backgroundColor: "#F9F7FE",
  },
  headerRow: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 17,
  },
  backButton: {
    height: 20,
    justifyContent: "center",
  },
  likeButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    backgroundColor: "#C97BD8",
  },
  heroBackground: {
    width: "100%",
    height: hp(24),
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  heroContent: {
    position: "absolute",
    left: 34,
    right: 25,
    bottom: 37,
    justifyContent: "flex-end",
  },
  heroTitle: {
    fontSize: RFValue(20),
    fontFamily: "PoppinsSemiBold",
    color: "#FFFFFF",
    fontWeight: "600",
    lineHeight: 30,
    maxWidth: 315,
  },
  categoryButton: {
    minWidth: 48,
    height: 34,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    alignSelf: "flex-start",
  },
  categoryButtonText: {
    fontSize: RFValue(11),
    fontFamily: "PoppinsMedium",
    color: "#FFFFFF",
  },
  bodySection: {
    flex: 1,
    backgroundColor: "#F9F7FE",
  },
  bodyContent: {
    paddingHorizontal: 15,
  },
  bodyHeading: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsSemiBold",
    color: "#111111",
    fontWeight: "600",
    marginTop: 27,
    marginBottom: 14,
  },
  descriptionText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#66646A",
    lineHeight: 18,
  },
  tagChip: {
    height: 29,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#CFCBD5",
    backgroundColor: "#F9F7FE",
    paddingHorizontal: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginBottom: 10,
  },
  tagChipText: {
    fontSize: RFValue(11),
    fontFamily: "PoppinsMedium",
    color: "#55515C",
  },
  relatedSection: {
    marginTop: 40,
    paddingHorizontal: 15,
  },
  relatedItem: {
    width: 237,
    height: 130,
    borderRadius: 19,
    overflow: "hidden",
    marginRight: 20,
  },
  relatedCard: {
    width: "100%",
    height: "100%",
  },
  relatedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.52)",
  },
  relatedCardContent: {
    paddingHorizontal: 29,
    paddingTop: 16,
  },
  relatedTitle: {
    fontSize: RFValue(13),
    fontFamily: "PoppinsSemiBold",
    color: "#FFFFFF",
    fontWeight: "600",
    lineHeight: 25,
  },
  readMoreButton: {
    position: "absolute",
    left: 29,
    bottom: 12,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    backgroundColor: "rgba(255,255,255,0.20)",
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  readMoreButtonText: {
    fontSize: RFValue(9),
    fontFamily: "PoppinsMedium",
    color: "#FFFFFF",
  },
  ctaWrap: {
    paddingHorizontal: 15,
    marginTop: 22,
    marginBottom: 27,
  },
  ctaButton: {
    backgroundColor: "#E5DFFD",
    borderRadius: 20,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A9A2B5",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 3,
  },
  ctaButtonText: {
    color: "#111111",
  },
  blogLikeText: {
    fontSize: RFValue(10),
    fontFamily: "PoppinsMedium",
    color: "#4B4854",
  },
});

export default Blog;