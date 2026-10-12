import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons, Feather } from "@expo/vector-icons";

// Context
import { Hcontext } from "../../context/Hcontext";

const waysToEarn = [
  ["Create Your Account", 500],
  ["Complete Your Profile", 200],
  ["Log Today's Mood", 50],
  ["Complete Self Check", 1000],
  ["Attend A SOLV Session", 1000],
  ["Subscribe To Growth Plan", 500],
  ["Refer A Friend", 50],
  ["Friend Completes SELFCHECK", 500],
  ["HappiTALK Session", 100],
  ["Maintain A 7-Day Streak", 500],
];

const offers = [
  {
    id: "growth-plus",
    threshold: 2500,
    title: "On Achieving 2500 Points Get Growth Plus (Worth ₹399)",
    description:
      "Use it yourself or gift it to someone who could benefit from their own growth journey.",
    shareEnabled: true,
  },
  {
    id: "happitalk-session",
    threshold: 5000,
    title: "On Achieving 5000 Points Get Complimentary HappiTalk Session",
    description:
      "Use it yourself or gift it to someone who could benefit from their own growth journey.",
    shareEnabled: false,
  },
];

const RewardRow = ({ action, reward }) => (
  <View style={styles.tableRow}>
    <Text style={styles.tableRowAction}>{action}</Text>
    <Text style={styles.tableRowReward}>{reward}</Text>
  </View>
);

const RewardsScreen = (props) => {
  const { navigation } = props;
  const insets = useSafeAreaInsets();

  // Context Variables
  const { totalRewardPoints, rewardList, snackDispatch } = useContext(Hcontext);

  // State Variables
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showRedeemHelp, setShowRedeemHelp] = useState(false);
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [extraOffers, setExtraOffers] = useState([]);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    setLoading(true);
    try {
      const res = await totalRewardPoints();
      if (res && res.status === "success") {
        setPoints(Number(res.total_reward_points) || 0);
      }
    } catch (err) {
      console.log("Some issue while fetching reward points (RewardsScreen) - ", err);
    }
    setLoading(false);
  };

  // Next reward threshold above current points
  const sortedThresholds = offers
    .map((offer) => offer.threshold)
    .sort((a, b) => a - b);
  const nextThreshold = sortedThresholds.find((threshold) => threshold > points);
  const progressText = nextThreshold
    ? `You're now only ${nextThreshold - points} points away from unlocking your next reward.`
    : "Congratulations! You have unlocked all rewards.";

  const loadMoreOffers = async () => {
    if (showAllOffers) {
      setShowAllOffers(false);
      return;
    }
    try {
      const rewardsRes = await rewardList?.();
      if (rewardsRes && rewardsRes.status === "success") {
        const list = (rewardsRes.list || []).filter((entry) => entry.id !== 7);
        setExtraOffers(list.slice(0, 4));
      }
    } catch (err) {
      console.log("Some issue while loading more offers (RewardsScreen) - ", err);
    }
    setShowAllOffers(true);
  };

  const shareOffer = async (title) => {
    try {
      await Share.share({
        message: `HappiPoints: ${title}. Earn points on HappiMynd and redeem exciting rewards!`,
      });
    } catch (err) {
      console.log("Some issue while sharing offer (RewardsScreen) - ", err);
    }
  };

  const handleRedeem = () => {
    snackDispatch?.({ type: "SHOW_SNACK", payload: "Redemption coming soon." });
  };

  return (
    <View style={[styles.screen, { backgroundColor: "#F8F7FF" }]}>
      <View style={[styles.header, { paddingTop: insets.top + hp(1) }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={22} color="#4B4854" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="#9747FF" />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Points Summary */}
          <View style={styles.pointsCard}>
            <Text style={styles.pointsTitle}>YOUR POINTS</Text>
            <Text style={styles.pointsValue}>{points}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowRedeemHelp(!showRedeemHelp)}
            >
              <Text style={styles.redeemHelp}>How To Redeem?</Text>
            </TouchableOpacity>
          </View>

          {showRedeemHelp ? (
            <View style={styles.redeemHelpCard}>
              <Text style={styles.redeemHelpText}>
                Keep completing activities to reach the threshold of each reward.
                Once you cross a threshold, tap "Redeem Now" on that reward card to
                claim it.
              </Text>
            </View>
          ) : null}

          {/* SizedBox */}
          <View style={{ height: hp(2) }} />

          {/* Progress */}
          <Text style={styles.progressText}>{progressText}</Text>

          {/* SizedBox */}
          <View style={{ height: hp(1.5) }} />

          {/* See More (top) */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowMoreInfo(!showMoreInfo)}
            style={styles.seeMoreTopContainer}
          >
            <Text style={styles.seeMoreText}>See More</Text>
          </TouchableOpacity>

          {showMoreInfo ? (
            <View style={styles.waysCard}>
              <Text style={styles.waysTitle}>Ways To Earn HappiPOINTS</Text>
              {waysToEarn.map((item, index) => (
                <View key={index}>
                  <RewardRow action={item[0]} reward={item[1]} />
                </View>
              ))}
            </View>
          ) : null}

          {/* SizedBox */}
          <View style={{ height: hp(3) }} />

          {/* Offers */}
          <Text style={styles.offerHeading}>Redemption Offers</Text>

          {/* SizedBox */}
          <View style={{ height: hp(1.5) }} />

          {offers.map((offer) => {
            const enabled = points >= offer.threshold;
            return (
              <View key={offer.id} style={styles.offerCard}>
                <Text style={styles.offerTitle}>{offer.title}</Text>

                {/* SizedBox */}
                <View style={{ height: hp(1) }} />

                <Text style={styles.offerDescription}>{offer.description}</Text>

                {/* SizedBox */}
                <View style={{ height: hp(1.7) }} />

                <View style={styles.offerBottomRow}>
                  {offer.shareEnabled ? (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => shareOffer(offer.title)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.shareButton}
                    >
                      <Image
                        source={require("../../assets/images/share.png")}
                        style={styles.shareImage}
                      />
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={!enabled}
                    onPress={handleRedeem}
                    style={[
                      styles.redeemButton,
                      !enabled ? styles.redeemButtonDisabled : null,
                      enabled ? styles.redeemButtonEnabled : null,
                    ]}
                  >
                    <Text
                      style={[
                        styles.redeemButtonText,
                        enabled ? styles.redeemButtonTextEnabled : null,
                      ]}
                    >
                      Redeem Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          {showAllOffers && extraOffers.length
            ? extraOffers.map((entry) => (
                <View key={entry.id} style={styles.offerCard}>
                  <Text style={styles.offerTitle}>{entry.action_performed}</Text>
                  <View style={{ height: hp(1) }} />
                  <Text style={styles.offerDescription}>
                    Earn {entry.points_to_be_given} HappiPOINTS by completing this
                    activity.
                  </Text>
                </View>
              ))
            : null}

          {/* SizedBox */}
          <View style={{ height: hp(2) }} />

          {/* See More (bottom) */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={loadMoreOffers}
            style={styles.seeMoreBottomContainer}
          >
            <Text style={styles.seeMoreText}>
              {showAllOffers ? "Show Less" : "See More"}
            </Text>
          </TouchableOpacity>

          {/* SizedBox */}
          <View style={{ height: insets.bottom + hp(3) }} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(1),
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(5),
    paddingTop: hp(1),
  },
  pointsCard: {
    backgroundColor: "#E9E0FF",
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    paddingVertical: hp(3.5),
  },
  pointsTitle: {
    color: "#111111",
    fontSize: RFValue(14),
    fontFamily: "Poppins",
    textAlign: "center",
  },
  pointsValue: {
    color: "#000000",
    fontSize: RFValue(40),
    fontFamily: "PoppinsBold",
    textAlign: "center",
    marginTop: hp(0.5),
  },
  redeemHelp: {
    color: "#3F3C47",
    fontSize: RFValue(13),
    fontFamily: "PoppinsMedium",
    textAlign: "center",
    marginTop: hp(0.5),
    textDecorationLine: "underline",
  },
  redeemHelpCard: {
    backgroundColor: "#F0E9FF",
    borderRadius: 16,
    marginTop: hp(1.5),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
  },
  redeemHelpText: {
    color: "#3F3C47",
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    lineHeight: hp(2.4),
  },
  progressText: {
    color: "#111111",
    fontSize: RFValue(14),
    fontFamily: "Poppins",
    textAlign: "left",
    lineHeight: hp(2.8),
  },
  seeMoreTopContainer: {
    alignItems: "center",
  },
  seeMoreText: {
    color: "#9747FF",
    fontSize: RFValue(13),
    fontFamily: "PoppinsMedium",
    textAlign: "center",
  },
  waysCard: {
    backgroundColor: "#EEF2FF",
    borderRadius: 20,
    marginTop: hp(1),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
  },
  waysTitle: {
    color: "#111111",
    fontSize: RFValue(13),
    fontFamily: "PoppinsSemiBold",
    marginBottom: hp(1),
  },
  tableRow: {
    minHeight: hp(3),
    flexDirection: "row",
    alignItems: "center",
  },
  tableRowAction: {
    flex: 1,
    color: "#3F3C47",
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
  tableRowReward: {
    color: "#3F3C47",
    fontSize: RFValue(12),
    fontFamily: "PoppinsSemiBold",
    width: wp(12),
    textAlign: "right",
  },
  offerHeading: {
    color: "#9747FF",
    fontSize: RFValue(16),
    fontFamily: "Poppins",
    textAlign: "left",
  },
  offerCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E6E2EB",
    borderWidth: 1,
    borderRadius: 28,
    paddingHorizontal: wp(4.5),
    paddingVertical: hp(2),
    marginBottom: hp(1.5),
  },
  offerBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  shareButton: {
    marginRight: wp(3),
  },
  shareImage: {
    width: hp(2.8),
    height: hp(2.8),
    resizeMode: "contain",
  },
  offerTitle: {
    color: "#111111",
    fontSize: RFValue(14),
    fontFamily: "PoppinsSemiBold",
    lineHeight: hp(2.8),
  },
  offerDescription: {
    color: "#57535F",
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    lineHeight: hp(2.4),
  },
  redeemButton: {
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E0D5FF",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: wp(8),
    paddingVertical: hp(1.2),
  },
  redeemButtonDisabled: {
    opacity: 1,
  },
  redeemButtonEnabled: {
    backgroundColor: "#E9E0FF",
    borderColor: "#E9E0FF",
  },
  redeemButtonText: {
    color: "#B5B1BA",
    fontSize: RFValue(13),
    fontFamily: "PoppinsMedium",
  },
  redeemButtonTextEnabled: {
    color: "#3F3C47",
  },
  seeMoreBottomContainer: {
    alignItems: "center",
    paddingVertical: hp(1),
  },
});

export default RewardsScreen;