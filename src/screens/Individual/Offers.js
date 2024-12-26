import React from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";
import OfferCard from "../../components/cards/OfferCard";
import CourseCard from "../../components/cards/CourseCard";

const Offers = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <Header navigation={navigation} showLogo={false} />
      <View style={{ paddingHorizontal: wp(10) }}>
        <View>
          <Text style={styles.pageTitle}>Offers and Rewards</Text>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <View>
          <Image
            source={require("../../assets/images/points.png")}
            style={styles.pointsImage}
            resizeMode="cover"
          />
        </View>
      </View>
      {/* Sized Box */}
      <View style={{ height: hp(2) }} />
      <ScrollView style={{ paddingHorizontal: wp(10) }}>
        <View>
          <View>
            <Text style={styles.pageSubTitle}>Offers</Text>
          </View>
          {/* Sized Box */}
          <View style={{ height: hp(2) }} />
          <View>
            <OfferCard
              title="Offer"
              description="Assigned summary reading by expert emotional wellbeing expert"
              type="unlocked"
            />
            {/* Sized Box */}
            <View style={{ height: hp(2) }} />
            <OfferCard
              title="Offer"
              description="Assigned summary reading by expert emotional wellbeing expert"
              type="unlocked"
            />
            {/* Sized Box */}
            <View style={{ height: hp(2) }} />
            <OfferCard
              title="Offer"
              description="Assigned summary reading by expert emotional wellbeing expert"
              type="unlocked"
            />
            {/* Sized Box */}
            <View style={{ height: hp(2) }} />
          </View>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <View>
          <View>
            <Text style={styles.pageSubTitle}>Rewards</Text>
          </View>
          {/* Sized Box */}
          <View style={{ height: hp(2) }} />
          <View>
            <OfferCard
              title="Offer"
              description="Assigned summary reading by expert emotional wellbeing expert"
              type="unlocked"
            />
            {/* Sized Box */}
            <View style={{ height: hp(2) }} />
            <OfferCard
              title="Offer"
              description="Assigned summary reading by expert emotional wellbeing expert"
              type="unlocked"
            />
            {/* Sized Box */}
            <View style={{ height: hp(2) }} />
            <OfferCard
              title="Offer"
              description="Assigned summary reading by expert emotional wellbeing expert"
              type="unlocked"
            />
            {/* Sized Box */}
            <View style={{ height: hp(2) }} />
          </View>
        </View>
        {/* Sized Box */}
        <View style={{ height: hp(10) }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  pageTitle: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
  },
  pageSubTitle: {
    fontSize: RFValue(20),
    fontFamily: "PoppinsMedium",
    color: colors.primaryText,
  },
  pointsImage: {
    // backgroundColor: "green",
    width: wp(80),
    height: hp(10),
    borderRadius: 10,
  },
});

export default Offers;
