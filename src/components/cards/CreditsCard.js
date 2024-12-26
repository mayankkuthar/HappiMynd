import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";

const CreditsCard = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  const { id, psychologist, total_no_of_session, remaining_session } =
    props.data;

  return (
    <View style={styles.container}>
      {/* Profile Detail Section */}
      <View style={{ flexDirection: "row" }}>
        <Image
          style={styles.profileImage}
          source={{ uri: psychologist?.psy_profile }}
          //source={require("../../assets/images/credits_image.png")}
          resizeMode="contain"
        />
        <View style={styles.cardProfileDetails}>
          <View>
            <Text style={styles.profileName}>{psychologist.username}</Text>
            <Text style={styles.profileProfession}>Psychologist</Text>
          </View>
          <View>
            <Text style={styles.profileSpecializationText}>
              Specialization in:
            </Text>
            <Text style={styles.profileSpecialization}>
              {psychologist?.specialization.map(
                (specs, index) => specs.name + ", "
              )}
            </Text>
          </View>
        </View>
      </View>

      {/* Sized Box */}
      <View style={{ height: hp(2) }} />

      {/* Credits Detail Section */}
      <View style={styles.creditsDetailSection}>
        <View>
          <Text style={styles.creditsText}>Entitled Credits</Text>
          <Text style={styles.creditsValue}>{total_no_of_session}</Text>
        </View>
        <View>
          <Text style={styles.creditsText}>Balance Credits</Text>
          <Text style={styles.creditsValue}>{remaining_session}</Text>
        </View>
        <View>
          <Text style={styles.creditsText}>Used Credits</Text>
          <Text style={styles.creditsValue}>
            {total_no_of_session - remaining_session}
          </Text>
        </View>
      </View>

      {/* Sized Box */}
      <View style={{ height: hp(2) }} />

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          navigation.push("MakeBooking", {
            type: "add",
            bookingId: id,
            psyId: psychologist.id,
            planId: 0,
            amount: 0,
            session: 0,
          })
        }
        style={styles.bookButton}
      >
        <Text style={styles.bookButtonText}>Book a Slot</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: hp(2),
    paddingHorizontal: hp(2),
    borderRadius: 14,
  },
  profileImage: {
    // backgroundColor: "red",
    height: hp(10),
    width: hp(8),
  },
  cardProfileDetails: {
    paddingLeft: hp(2),
    justifyContent: "space-between",
  },
  profileName: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
  },
  profileProfession: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    color: colors.pageTitle,
  },
  profileSpecializationText: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
    color: colors.borderLight,
  },
  profileSpecialization: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
  },
  creditsDetailSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  creditsText: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
    color: colors.borderLight,
  },
  creditsValue: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    textAlign: "center",
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: hp(100),
    height: hp(5),
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
  },
});

export default CreditsCard;
