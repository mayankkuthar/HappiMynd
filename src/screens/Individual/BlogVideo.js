import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

// Constants
import { colors } from "../../assets/constants";

// Components
import Capsule from "../../components/common/Capsule";

// ─── Utility ────────────────────────────────────────────────────────────────

const extractYoutubeId = (url) => {
  if (!url) return null;
  try {
    // Handles: youtu.be/ID, ?v=ID, &v=ID
    const match = url.match(
      /(?:youtu\.be\/|[?&]v=|\/embed\/|\/v\/)([a-zA-Z0-9_-]{11})/,
    );
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

// ─── Sub-components (defined outside to avoid re-creation on parent render) ──

const Header = React.memo(({ navigation, likesCount }) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = useCallback(() => setLiked((prev) => !prev), []);

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.pop()}
        style={styles.backButton}
      >
        <Ionicons name="ios-chevron-back" size={hp(4)} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.likeButton}
        onPress={toggleLike}
      >
        <Ionicons
          name={liked ? "heart-sharp" : "heart-outline"}
          size={hp(3)}
          color={liked ? "red" : "black"}
        />
        <Text style={styles.blogLikeText}>{likesCount}</Text>
      </TouchableOpacity>
    </View>
  );
});

// Stable renderItem for profile/keyword capsule FlatLists
const renderCapsule = ({ item }) => (
  <View style={styles.capsuleWrapper}>
    <Capsule title={item} />
  </View>
);

const TagRow = React.memo(({ label, raw }) => {
  // Split once, memoised
  const items = useMemo(() => raw?.split(" ").filter(Boolean) ?? [], [raw]);

  return (
    <>
      <Text style={styles.sectionLabel}>{label}:</Text>
      <View style={{ height: hp(1) }} />
      <FlatList
        data={items}
        renderItem={renderCapsule}
        keyExtractor={(item, index) => `${label}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={3}
        removeClippedSubviews
      />
      <View style={{ height: hp(3) }} />
    </>
  );
});

// ─── Main Screen ─────────────────────────────────────────────────────────────

const BlogVideo = ({ navigation, route }) => {
  const {
    title = "",
    summary = "",
    type = "",
    credit = "",
    likes_count = 0,
    profile = "",
    keywords = "",
    link = "",
  } = route.params;

  // Derive video ID once — no useEffect needed
  const videoId = useMemo(
    () => (link.includes("youtu") ? extractYoutubeId(link) : null),
    [link],
  );

  const [videoReady, setVideoReady] = useState(false);
  const onReady = useCallback(() => setVideoReady(true), []);

  return (
    <View style={styles.container}>
      <Header navigation={navigation} likesCount={likes_count} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
      >
        {/* Title */}
        <Text style={styles.heroTitle}>{title}</Text>
        <View style={{ height: hp(1) }} />

        {/* Type badge */}
        <View style={styles.blogButton}>
          <Text style={styles.blogButtonText}>{type}</Text>
        </View>
        <View style={{ height: hp(2) }} />

        {/* YouTube player */}
        {videoId ? (
          <View style={styles.playerWrapper}>
            <YoutubePlayer
              webViewStyle={styles.webView}
              webViewProps={{ renderToHardwareTextureAndroid: true }}
              height={hp(22)}
              videoId={videoId}
              play={false} // don't autoplay — saves bandwidth & feels faster
              onReady={onReady}
            />
            {!videoReady && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator size="small" color={colors.loaderColor} />
              </View>
            )}
          </View>
        ) : null}

        <View style={{ height: hp(2) }} />

        {/* Description */}
        <Text style={styles.sectionLabel}>Description:</Text>
        <Text style={styles.bodyContentText}>{summary}</Text>
        <View style={{ height: hp(3) }} />

        {/* Profile tags */}
        <TagRow label="Profile" raw={profile} />

        {/* Keyword tags */}
        <TagRow label="Keywords" raw={keywords} />

        {/* Credit */}
        <Text style={styles.sectionLabel}>Credit:</Text>
        <View style={{ height: hp(1) }} />
        <Text style={styles.bodyContentText}>{credit}</Text>

        <View style={{ height: hp(10) }} />
      </ScrollView>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(10),
  },
  headerContainer: {
    width: wp(100),
    height: hp(12),
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingBottom: hp(2),
  },
  backButton: {
    paddingLeft: hp(1.5),
  },
  likeButton: {
    paddingRight: hp(2),
    alignItems: "center",
  },
  blogLikeText: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
  },
  heroTitle: {
    fontSize: RFValue(22),
    fontFamily: "PoppinsMedium",
    color: colors.borderDark,
  },
  blogButton: {
    backgroundColor: colors.primary,
    height: hp(3),
    width: wp(14),
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
  playerWrapper: {
    width: wp(80),
    height: hp(22),
  },
  webView: {
    opacity: 0.99,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  sectionLabel: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsSemiBold",
  },
  bodyContentText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
  capsuleWrapper: {
    marginRight: wp(2),
  },
});

export default BlogVideo;
