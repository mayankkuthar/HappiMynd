import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constatnts
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";
import SocialMedia from "../../components/common/SocialMedia";

const policyContentData = [
  {
    id: 1,
    title: "",
    description: `HappiMynd is a unique Online platform on Mental Well-being that aims at engaging & empowering people, involving them in protecting their mental well being as a part of their overall well-being, based on positive aspects of psychology, spreading awareness and help potential users to self-identify mental health issues before they become life-altering and offer them research & evidence-based professional interventions that reduce the likelihood of the concern turning into a full-blown disorder.

HappiMynd offers a unique 5 Stage Support System including Awareness, Prevention, Early Detection, Self Management & Therapeutic Treatment of Mental Wellbeing related issues.
            
We invite you to take the first step of your journey towards holistic wellness with HappiMynd.
      `,
  },
];

const PolicyContent = (props) => {
  //Prop Destructuring
  const { title, description } = props;

  return (
    <View>
      <Text style={styles.PolicyTitle}>{title}</Text>

      {/* Sized Box */}
      <View style={{ height: hp(1) }} />

      <Text style={styles.PolicyDescription}>{description}</Text>
    </View>
  );
};

const About = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView
        style={{ paddingHorizontal: wp(6) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Sized Box */}
        <View style={{ height: hp(3) }} />

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>About Us</Text>
        </View>

        {/* Body Section */}
        <View>
          {policyContentData.map((data) => (
            <View key={data.id}>
              <PolicyContent
                title={data.title}
                description={data.description}
              />
              {/* Sized Box */}
              <View style={{ height: hp(4) }} />
            </View>
          ))}

          {/* Social Links */}
          <SocialMedia />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  titleSection: {
    // backgroundColor: "red",
  },
  title: {
    fontSize: RFValue(26),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  PolicyTitle: {
    fontSize: RFValue(22),
    fontFamily: "PoppinsMedium",
  },
  PolicyDescription: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: colors.borderDark,
    lineHeight: hp(3),
    textAlign: "justify",
  },
});

export default About;
