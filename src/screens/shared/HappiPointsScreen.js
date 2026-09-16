import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";

const rewards = [
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

const RewardRow = ({ action, reward }) => {
  return (
    <View style={styles.tableRow}>
      <Text style={styles.tableRowText} numberOfLines={2}>
        {action}
      </Text>
      <Text style={styles.tableRewardText}>{reward}</Text>
    </View>
  );
};

const HappiPointsScreen = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>HappiPOINTS</Text>

        {/* Intro Description */}
        <Text style={styles.introDescription}>
          Every step you take towards understanding yourself earns Points.
          Complete activities, build healthy habits, and unlock exciting
          rewards along the way.
        </Text>

        {/* Ways To Earn Section */}
        <Text style={styles.sectionTitle}>Ways To Earn HappiPOINTS</Text>
        <Text style={styles.sectionDescription}>
          Complete simple actions, stay consistent, and watch your Points grow.
        </Text>

        {/* Rewards Card */}
        <View style={styles.rewardsCard}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Action</Text>
            <View style={styles.rewardColumn}>
              <Text style={styles.tableHeaderText}>Reward</Text>
            </View>
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(1) }} />

          {rewards.map((item, index) => (
            <View key={index}>
              <RewardRow action={item[0]} reward={item[1]} />
              {/* Sized Box */}
              <View style={{ height: hp(0.8) }} />
            </View>
          ))}
        </View>

        {/* How To Earn Section */}
        <View style={styles.howToEarnCard}>
          <Text style={styles.howToEarnTitle}>How To Earn HappiPOINTS</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: wp(4.2),
  },
  scrollContent: {
    paddingBottom: hp(6),
  },
  title: {
    fontSize: RFValue(26),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
    marginTop: hp(3.3),
    marginBottom: hp(1.9),
  },
  introDescription: {
    fontSize: RFValue(14),
    fontFamily: "Poppins",
    color: colors.borderLight,
    lineHeight: hp(3),
    marginBottom: hp(3.3),
  },
  sectionTitle: {
    fontSize: RFValue(20),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
    marginBottom: hp(2.2),
  },
  sectionDescription: {
    fontSize: RFValue(14),
    fontFamily: "Poppins",
    color: colors.borderLight,
    lineHeight: hp(3),
    marginBottom: hp(2.6),
  },
  rewardsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: hp(2.75),
    paddingHorizontal: wp(8.7),
    paddingTop: hp(3.6),
    paddingBottom: hp(3.4),
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  tableHeaderText: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
    flex: 1,
  },
  rewardColumn: {
    width: wp(15),
    alignItems: "flex-end",
  },
  tableRow: {
    minHeight: hp(4.4),
    flexDirection: "row",
    alignItems: "center",
  },
  tableRowText: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    color: colors.borderLight,
    flex: 1,
  },
  tableRewardText: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    color: colors.borderLight,
    width: wp(15),
    textAlign: "right",
  },
  howToEarnCard: {
    backgroundColor: "#EEE6FF",
    borderRadius: hp(2.75),
    marginTop: hp(2.8),
    paddingHorizontal: wp(5.7),
    paddingTop: hp(3.3),
    paddingBottom: hp(3.4),
  },
  howToEarnTitle: {
    fontSize: RFValue(18),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
  },
});

export default HappiPointsScreen;