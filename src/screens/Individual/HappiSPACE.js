import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";
import Button from "../../components/buttons/Button";

const HappiSPACE = (props) => {
  // Prop destructuring
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <Header showBack={true} navigation={navigation} />

      <ScrollView style={{ paddingHorizontal: wp(10) }}>
        {/* Sized Box */}
        <View style={{ height: hp(3) }} />

        <View>
          <Text style={styles.title}>HappiSPACE</Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Text style={styles.subTitle}>
            Holistic Package for Organisational Resilience
          </Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Image
            source={require("../../assets/images/happiSPACE.png")}
            resizeMode="contain"
            style={styles.banner}
          />

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <View style={styles.detailSection}>
            <Text style={styles.detail}>
              Our unique & comprehensive 5 stage online customised package for
              organisations helps empower employees to undertake and achieve
              emotional wellness goals and develop resilience against all odds.
              HappiSPACE is an anonymous, highly confidential, and end-to-end
              tech-enabled program. Our focus is on redefining emotional and
              mental wellness by creating awareness and offering tools to enable
              self-management and improvement. We also provide professional care
              and guidance by experienced therapists who can best support
              employees’ healing and emotional wellbeing journey. Globally,
              organisations are acknowledging the need to support their
              employees emotionally more than any other engagement program.
            </Text>
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Button
            text="Get HappiSPACE Now"
            pressHandler={() => navigation.push("Pricing")}
          />

          {/* Sized Box */}
          <View style={{ height: hp(4) }} />
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
  title: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
  },
  subTitle: {
    fontSize: RFValue(22),
    fontFamily: "PoppinsMedium",
  },
  banner: {
    // backgroundColor: "yellow",
    width: wp(80),
    height: hp(30),
  },
  detailSection: {
    backgroundColor: "#FAFFFF",
    paddingHorizontal: hp(2.5),
    paddingVertical: hp(1.5),
    borderRadius: 10,
  },
  detail: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    lineHeight: hp(3),
  },
});

export default HappiSPACE;
