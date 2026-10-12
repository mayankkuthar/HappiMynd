import React, {
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  Share,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

// ─── Main Screen ─────────────────────────────────────────────────────────────

const BlogVideo = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

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

  // YouTube thumbnail for the poster frame
  const thumbnailUri = useMemo(
    () => (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null),
    [videoId],
  );

  const [playing, setPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [liked, setLiked] = useState(false);

  const onReady = useCallback(() => setVideoReady(true), []);

  const handlePlay = useCallback(() => {
    if (videoId) setPlaying(true);
  }, [videoId]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `${title}\n${link || "Watch on HappiMynd"}`,
        title: title || "HappiMynd",
      });
    } catch (err) {
      console.error("share error:", err);
    }
  }, [title, link]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.pop()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color="#4B4854" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
      >
        {/* Article header */}
        <View style={styles.articleHeader}>
          <Text style={styles.heroTitle}>{title}</Text>
          <View style={styles.blogButton}>
            <Text style={styles.blogButtonText}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </View>
        </View>

        {/* Video player */}
        <View style={styles.playerWrapper}>
          {!playing || !videoId ? (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.playerTouchable}
              onPress={handlePlay}
            >
              <ImageBackground
                source={{ uri: thumbnailUri || link }}
                style={styles.playerImage}
                resizeMode="cover"
              >
                <View style={styles.playButton}>
                  <Ionicons name="play" size={30} color="#FFFFFF" />
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ) : (
            <View style={styles.playerVideo}>
              <YoutubePlayer
                webViewStyle={styles.webView}
                webViewProps={{ renderToHardwareTextureAndroid: true }}
                height={hp(29)}
                videoId={videoId}
                play={true}
                onReady={onReady}
              />
              {!videoReady && (
                <View style={styles.loaderOverlay}>
                  <ActivityIndicator size="small" color="#4B4854" />
                </View>
              )}
            </View>
          )}
        </View>

        {/* Video actions */}
        <View style={styles.videoActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Ionicons name="share-social-outline" size={23} color="#4B4854" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.actionButton}
            onPress={() => setLiked((prev) => !prev)}
          >
            <Ionicons
              name={liked ? "heart-sharp" : "heart-outline"}
              size={24}
              color={liked ? "#E04E39" : "#4B4854"}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Description */}
          <Text style={styles.descriptionHeading}>Description</Text>
          <Text style={styles.descriptionBody}>{summary}</Text>

          {/* Profile */}
          <Text style={styles.sectionLabel}>Profile</Text>
          <View style={styles.tagsContainer}>
            {profile
              ? profile
                  .split(/[,]+/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((item, index) => (
                    <View key={`profile-${index}`} style={styles.tagChip}>
                      <Text style={styles.tagChipText}>{item}</Text>
                    </View>
                  ))
              : null}
          </View>

          {/* Keywords */}
          <Text style={[styles.sectionLabel, styles.keywordsHeading]}>
            Keywords
          </Text>
          <View style={styles.tagsContainer}>
            {keywords
              ? keywords
                  .split(/[,]+/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((item, index) => (
                    <View key={`keywords-${index}`} style={styles.tagChip}>
                      <Text style={styles.tagChipText}>{item}</Text>
                    </View>
                  ))
              : null}
          </View>

          {/* Credit */}
          <Text style={[styles.sectionLabel, styles.creditHeading]}>Credit</Text>
          <Text style={styles.creditBody}>{credit}</Text>
        </View>

        <View style={{ height: hp(6) }} />
      </ScrollView>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F7FF",
    flex: 1,
  },
  header: {
    backgroundColor: "#F9F7FF",
  },
  backButton: {
    width: 22,
    height: 22,
    marginLeft: 16,
    marginTop: 22,
  },
  scrollContent: {
    paddingBottom: hp(4),
  },
  articleHeader: {
    paddingHorizontal: 15,
  },
  heroTitle: {
    marginTop: 14,
    color: "#111111",
    fontSize: RFValue(20),
    fontFamily: "Poppins",
    lineHeight: RFValue(28),
    maxWidth: 335,
  },
  blogButton: {
    marginTop: 21,
    width: 54,
    height: 29,
    backgroundColor: "#F9F7FF",
    borderColor: "#CFCBD5",
    borderWidth: 1,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  blogButtonText: {
    fontSize: RFValue(11),
    fontFamily: "PoppinsMedium",
    color: "#55515C",
  },
  playerWrapper: {
    marginTop: 21,
    marginHorizontal: 15,
    backgroundColor: "#DCEAF0",
    borderRadius: 20,
    overflow: "hidden",
  },
  playerTouchable: {
    width: "100%",
  },
  playerImage: {
    width: "100%",
    aspectRatio: 336 / 227,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 44,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  playerVideo: {
    width: "100%",
    height: hp(29),
    backgroundColor: "#DCEAF0",
  },
  webView: {
    opacity: 0.99,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DCEAF0",
  },
  videoActions: {
    height: 47,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  actionButton: {
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 15,
  },
  descriptionHeading: {
    marginTop: 12,
    marginBottom: 13,
    color: "#111111",
    fontSize: RFValue(14),
    fontFamily: "PoppinsSemiBold",
  },
  descriptionBody: {
    color: "#66646A",
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    lineHeight: 17,
    marginBottom: 27,
  },
  sectionLabel: {
    color: "#111111",
    fontSize: RFValue(14),
    fontFamily: "PoppinsSemiBold",
    marginBottom: 14,
  },
  keywordsHeading: {
    marginTop: 27,
  },
  creditHeading: {
    marginTop: 27,
    marginBottom: 14,
  },
  creditBody: {
    color: "#66646A",
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 27,
  },
  tagChip: {
    height: 29,
    backgroundColor: "#F9F7FF",
    borderColor: "#CFCBD5",
    borderWidth: 1,
    borderRadius: 7,
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
});

export default BlogVideo;