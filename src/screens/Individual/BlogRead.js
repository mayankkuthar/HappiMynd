import React, { useState, useCallback, memo, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";

// Constants
import { colors } from "../../assets/constants";

// Components
import Capsule from "../../components/common/Capsule";

// Move outside component so it's never recreated
const BLOG_IMAGE = require("../../assets/images/blog1.png");

// ─── Header ──────────────────────────────────────────────────────────────────
// memo prevents re-render when parent (BlogRead) state changes
const Header = memo(({ navigation, likesCount }) => {
  const [liked, setLiked] = useState(false);

  const handleBack = useCallback(() => navigation.pop(), [navigation]);
  const handleLike = useCallback(() => setLiked((prev) => !prev), []);

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleBack}
        style={styles.backButton}
      >
        <Ionicons name="ios-chevron-back" size={hp(4)} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.likeButton}
        onPress={handleLike}
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

// ─── CapsuleRow ───────────────────────────────────────────────────────────────
// Isolated so its scroll state never re-renders the parent
const CapsuleRow = memo(({ items }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.capsuleScroll}
  >
    {items.map((item, index) => (
      // key on the outermost element — no Fragment wrapper needed
      <View key={`${item}-${index}`} style={styles.capsuleGap}>
        <Capsule title={item} />
      </View>
    ))}
  </ScrollView>
));

// ─── BlogRead ─────────────────────────────────────────────────────────────────
const BlogRead = ({ navigation, route }) => {
  const {
    title = "",
    summary = "",
    credit = "",
    likes_count = 0,
    type = "",
    profile = "",
    keywords = "",
  } = route.params;

  // Split once, memoized — avoids re-splitting on every render
  const profileItems = useMemo(
    () => profile.split(" ").filter(Boolean),
    [profile],
  );
  const keywordItems = useMemo(
    () => keywords.split(" ").filter(Boolean),
    [keywords],
  );

  return (
    <View style={styles.container}>
      <Header navigation={navigation} likesCount={likes_count} />

      <View style={styles.body}>
        <Text style={styles.heroTitle}>{title}</Text>
        <View style={styles.gapS} />

        <View style={styles.blogButton}>
          <Text style={styles.blogButtonText}>{type}</Text>
        </View>

        <View style={styles.gapM} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          // Improves scroll performance on Android
          removeClippedSubviews
        >
          <ImageBackground
            source={BLOG_IMAGE}
            style={styles.heroBackground}
            resizeMode="cover"
          />

          <View style={styles.gapM} />

          <Text style={styles.sectionLabel}>Description:</Text>
          <Text style={styles.bodyContentText}>{summary}</Text>

          <View style={styles.gapL} />
          <Text style={styles.sectionLabel}>Profile:</Text>
          <View style={styles.gapS} />
          <CapsuleRow items={profileItems} />

          <View style={styles.gapL} />
          <Text style={styles.sectionLabel}>Keywords:</Text>
          <View style={styles.gapS} />
          <CapsuleRow items={keywordItems} />

          <View style={styles.gapL} />
          <Text style={styles.sectionLabel}>Credit:</Text>
          <View style={styles.gapS} />
          <Text style={styles.bodyContentText}>{credit}</Text>
        </ScrollView>
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
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
  body: {
    paddingHorizontal: wp(10),
    flex: 1,
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
  heroBackground: {
    width: wp(80),
    height: hp(30),
    borderRadius: 10,
    overflow: "hidden",
  },
  bodyContentText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
  // Pre-defined label style replaces inline spread objects
  sectionLabel: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsSemiBold",
  },
  capsuleScroll: {
    flexGrow: 0,
  },
  capsuleGap: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: wp(2),
  },
  scrollContent: {
    paddingBottom: hp(10), // replaces the hp(40) spacer View
  },
  // Spacers as named styles instead of inline Views
  gapS: { height: hp(1) },
  gapM: { height: hp(2) },
  gapL: { height: hp(3) },
});

export default BlogRead;
