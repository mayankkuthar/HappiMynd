import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";

const rows = [
  ["Create Your Account", "500"],
  ["Complete Your Profile", "200"],
  ["Log Today's Mood", "50"],
  ["Complete Self Check", "1000"],
  ["Attend A SOLV Session", "1000"],
  ["Subscribe To Growth Plan", "500"],
  ["Refer A Friend", "50"],
  ["Friend Completes SELFCHECK", "500"],
  ["HappiTALK Session", "100"],
  ["Maintain A 7-Day Streak", "500"],
];

const informationCards = [
  {
    id: "how-to-earn",
    title: "How To Earn HappiPOINTS",
    paragraphs: [
      "You can earn Points by completing eligible activities within the app, including:",
    ],
    bullets: [
      "Creating your account",
      "Completing your profile",
      "Completing the SelfCheck assessment",
      "Logging your daily mood",
      "Taking Quizzard quizzes",
      "Exploring the Games Library",
      "Attending SOLV or Talk sessions",
      "Subscribing to eligible services",
      "Maintaining activity streaks",
      "Referring friends who successfully join and complete qualifying activities",
    ],
    footer: "Point values may vary depending on the activity.",
  },
  {
    id: "policy",
    title: "HappiPoints Policy",
    subsections: [
      {
        title: "What are HappiPoints?",
        paragraphs: [
          "Points are reward points you earn by engaging with HappiMynd. Every meaningful action, whether it's completing your SelfCheck, attending a session, logging your mood, or referring a friend, helps you earn points that can be redeemed for exciting rewards and exclusive benefits.",
        ],
      },
    ],
  },
  {
    id: "redeeming",
    title: "Redeeming Rewards",
    paragraphs: ["Points can be redeemed for exclusive rewards, including:"],
    bullets: [
      "Growth Plus access",
      "Complimentary sessions",
      "Discounts on subscription plans",
      "Premium services",
    ],
    footer: "Rewards become available once the required point milestone is reached.",
  },
  {
    id: "referral",
    title: "Referral Rewards",
    paragraphs: [
      "Invite your friends to join HappiMynd using your referral link or code.",
      "Referral rewards are credited only after your friend successfully registers and completes the required qualifying activity (such as the SelfCheck assessment).",
      "Referral benefits are subject to verification.",
    ],
    subsections: [
      {
        title: "Important Guidelines",
        bullets: [
          "Points have no cash value and cannot be exchanged for money.",
          "Rewards are non-transferable unless explicitly marked as giftable.",
          "HappiMynd reserves the right to modify point values, reward eligibility, or the rewards catalogue at any time.",
          "Fraudulent, duplicate, or suspicious activity may result in removal of points or account suspension.",
          "Certain rewards may have redemption limits or expiry periods, which will be displayed before redemption.",
          "Redeemed rewards cannot be reversed once successfully claimed.",
        ],
      },
      {
        title: "Need Help?",
        paragraphs: [
          "If you have questions about your Points or reward eligibility, please contact the HappiMynd Support team through the Help Centre within the app.",
        ],
      },
    ],
  },
];

const BulletList = ({ items }) => (
  <View>
    {items.map((item, index) => (
      <View key={index} style={styles.bulletRow}>
        <Text style={styles.bulletDot}>{"\u2022"}</Text>
        <Text style={styles.bulletText}>{item}</Text>
      </View>
    ))}
  </View>
);

const HappiPointsScreen = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  const insets = useSafeAreaInsets();

  const renderContent = (card) => (
    <View key={card.id}>
      {card.paragraphs
        ? card.paragraphs.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))
        : null}

      {card.bullets ? (
        <View style={styles.bulletGroup}>
          <BulletList items={card.bullets} />
        </View>
      ) : null}

      {card.subsections
        ? card.subsections.map((subsection, index) => (
            <View key={index}>
              <Text style={styles.subsectionTitle}>{subsection.title}</Text>
              {subsection.paragraphs
                ? subsection.paragraphs.map((paragraph, pIndex) => (
                    <Text key={pIndex} style={styles.paragraph}>
                      {paragraph}
                    </Text>
                  ))
                : null}
              {subsection.bullets ? (
                <View style={styles.bulletGroup}>
                  <BulletList items={subsection.bullets} />
                </View>
              ) : null}
            </View>
          ))
        : null}

      {card.footer ? <Text style={styles.footer}>{card.footer}</Text> : null}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: "#F8F7FF" }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + hp(1.2) }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.openDrawer()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="menu" size={hp(3.2)} color="#45434C" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Text style={styles.heroTitle}>HappiPOINTS</Text>
        <Text style={styles.heroDescription}>
          Every step you take towards understanding yourself earns Points.
          Complete activities, build healthy habits, and unlock exciting
          rewards along the way.
        </Text>

        {/* Earning Section */}
        <Text style={styles.earningTitle}>Ways To Earn HappiPOINTS</Text>
        <Text style={styles.earningDescription}>
          Complete simple actions, stay consistent, and watch your Points grow.
        </Text>

        {/* Table */}
        <View style={styles.tableCard}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeaderText, styles.actionCell]}>
              Action
            </Text>
            <Text
              style={[styles.tableCell, styles.tableHeaderText, styles.rewardCell]}
            >
              Reward
            </Text>
          </View>

          <View style={styles.divider} />

          {rows.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.actionCell]} numberOfLines={2}>
                {item[0]}
              </Text>
              <Text style={[styles.tableCell, styles.rewardCell]}>{item[1]}</Text>
            </View>
          ))}
        </View>

        {/* Information Cards */}
        {informationCards.map((card) => (
          <View key={card.id} style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>{card.title}</Text>
            {renderContent(card)}
          </View>
        ))}

        {/* Bottom Spacer */}
        <View style={{ height: insets.bottom + hp(4) }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 17,
    paddingBottom: hp(0.5),
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 17,
    paddingTop: hp(1.5),
  },
  heroTitle: {
    fontSize: RFValue(26),
    fontFamily: "PoppinsSemiBold",
    color: "#111111",
    textAlign: "left",
    marginBottom: hp(0.8),
  },
  heroDescription: {
    fontSize: RFValue(14),
    fontFamily: "Poppins",
    color: "#646268",
    lineHeight: hp(2.9),
    marginBottom: hp(2.6),
  },
  earningTitle: {
    fontSize: RFValue(20),
    fontFamily: "PoppinsSemiBold",
    color: "#111111",
    textAlign: "left",
    marginBottom: hp(1),
  },
  earningDescription: {
    fontSize: RFValue(14),
    fontFamily: "Poppins",
    color: "#646268",
    lineHeight: hp(2.9),
    marginBottom: hp(2),
  },
  tableCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E6E2EB",
    borderWidth: 1,
    borderRadius: 27,
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    marginBottom: hp(2.5),
    shadowColor: "#D8D2E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  tableRow: {
    minHeight: hp(4.2),
    flexDirection: "row",
    alignItems: "center",
  },
  tableCell: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    color: "#646268",
  },
  tableHeaderText: {
    fontFamily: "PoppinsSemiBold",
    color: "#111111",
  },
  actionCell: {
    width: "72%",
    paddingRight: wp(2),
  },
  rewardCell: {
    width: "28%",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#E6E2EB",
    marginVertical: hp(0.5),
  },
  infoCard: {
    backgroundColor: "#E9E0FF",
    borderColor: "#E9E0FF",
    borderWidth: 1,
    borderRadius: 27,
    paddingHorizontal: wp(5.5),
    paddingVertical: hp(2.4),
    marginBottom: hp(2.5),
    shadowColor: "#D8D2E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  infoCardTitle: {
    fontSize: RFValue(18),
    fontFamily: "PoppinsSemiBold",
    color: "#111111",
    textAlign: "left",
    marginBottom: hp(1.2),
  },
  subsectionTitle: {
    fontSize: RFValue(15),
    fontFamily: "PoppinsSemiBold",
    color: "#111111",
    textAlign: "left",
    marginTop: hp(1.6),
    marginBottom: hp(0.6),
  },
  paragraph: {
    fontSize: RFValue(13.5),
    fontFamily: "Poppins",
    color: "#646268",
    lineHeight: hp(2.7),
    marginBottom: hp(0.8),
  },
  bulletGroup: {
    marginBottom: hp(0.5),
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(0.5),
  },
  bulletDot: {
    fontSize: RFValue(13.5),
    fontFamily: "Poppins",
    color: "#646268",
    lineHeight: hp(2.7),
    marginRight: wp(2.5),
  },
  bulletText: {
    flex: 1,
    fontSize: RFValue(13.5),
    fontFamily: "Poppins",
    color: "#646268",
    lineHeight: hp(2.7),
  },
  footer: {
    fontSize: RFValue(12.5),
    fontFamily: "Poppins",
    color: "#646268",
    lineHeight: hp(2.5),
    marginTop: hp(1.2),
  },
});

export default HappiPointsScreen;