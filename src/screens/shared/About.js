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

const paragraphs = [
  "HappiMynd brings together the science of human behavior and the power of technology to help people and organizations grow with clarity, capability, and connection - at scale.",
  "Growth that feels natural. Impact that lasts.",
];

const cards = [
  {
    title: "Growth desire without awareness",
    description:
      "People want to grow. Organizations invest in growth. Yet without understanding how we think, respond, and make decisions, growth becomes directionless. Awareness is what turns intention into meaningful progress - for individuals and teams alike.",
  },
  {
    title: "Performance without emotional intelligence",
    description:
      "We strive for better outcomes in careers, leadership and life, but inner capabilities are rarely developed with the same intent as technical skills. This creates progress without resilience and ambition without clarity.",
  },
];

const closing =
  "HappiMynd exists to bridge this gap by bringing science-backed insight, emotional intelligence and human awareness to help individuals and organizations grow consciously.";

const About = (props) => {
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
        <Text style={styles.title}>About HappiMynd</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>
          We're a People-First Company in a Tech-First World
        </Text>

        {/* Body Paragraphs */}
        {paragraphs.map((paragraph, index) => (
          <Text key={index} style={styles.body}>
            {paragraph}
          </Text>
        ))}

        {/* Cards */}
        {cards.map((card, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardBody}>{card.description}</Text>
          </View>
        ))}

        {/* Closing */}
        <Text style={styles.body}>{closing}</Text>
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
    paddingBottom: hp(12),
  },
  title: {
    fontSize: RFValue(26),
    fontFamily: "PoppinsSemiBold",
    color: "#111111",
    marginTop: hp(2.5),
    marginBottom: hp(1.2),
  },
  tagline: {
    fontSize: RFValue(14),
    fontFamily: "Poppins",
    color: "#606060",
    lineHeight: hp(2.8),
    marginBottom: hp(1.4),
  },
  body: {
    fontSize: RFValue(14),
    fontFamily: "Poppins",
    color: "#606060",
    lineHeight: hp(3),
    marginBottom: hp(1.4),
  },
  card: {
    backgroundColor: "#EDE6FF",
    borderColor: "#D3D0DD",
    borderWidth: 1,
    borderRadius: hp(2.6),
    paddingHorizontal: wp(5.7),
    paddingVertical: hp(2.2),
    marginBottom: hp(1.4),
    marginTop: hp(2.2),
  },
  cardTitle: {
    fontSize: RFValue(18),
    fontFamily: "PoppinsSemiBold",
    color: "#111111",
    lineHeight: hp(2.9),
    marginBottom: hp(0.8),
  },
  cardBody: {
    fontSize: RFValue(14),
    fontFamily: "Poppins",
    color: "#606060",
    lineHeight: hp(3),
    textAlign: "justify",
  },
});

export default About;