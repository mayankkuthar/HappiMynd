import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Collapsible from "react-native-collapsible";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

// Constants
import { colors } from "../../assets/constants";

const BookingCard = (props) => {
  // Prop Destructuring
  const {
    navigation,
    user,
    userDetail = { user_from: "individual", total_sesssions: 0 },
  } = props;

  // State Variables
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [languages, setLanguages] = useState("");
  const [specializations, setSpecializations] = useState("");

  // Mounting
  useEffect(() => {
    // Formatting the languages || spectializations
    let psyLanguages = "";
    let psySpecializations = "";
    user?.language.forEach((lang) => {
      psyLanguages += lang.name + ", ";
    });
    user?.specialization.forEach((spec) => {
      psySpecializations += spec.name + ", ";
    });
    setLanguages(psyLanguages.substring(0, psyLanguages.length - 2));
    setSpecializations(
      psySpecializations.substring(0, psySpecializations.length - 2)
    );
  }, []);

  console.log("checking the psy user here - ", props?.user);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setIsCollapsed((prevState) => !prevState)}
      style={styles.container}
    >
      {/* Profile Detail Section */}
      <View style={{ flexDirection: "row" }}>
        <Image
          style={styles.profileImage}
          // source={require("../../assets/images/credits_image.png")}
          source={{ uri: user?.psy_profile }}
          resizeMode="contain"
        />
        <View style={styles.cardProfileDetails}>
          <View>
            <Text style={styles.profileName}>
              {user?.first_name} {user?.last_name}
            </Text>
            <Text style={styles.profileProfession}>Psychologist</Text>
          </View>
          <View>
            <Text style={styles.profileSpecializationText}>{languages}</Text>
            {/* <Text style={styles.profileSpecialization}>Ratings 4/5</Text> */}
          </View>
        </View>
      </View>

      {/* Sized Box */}
      <View style={{ height: hp(2) }} />

      {/* Price Detail Section */}
      {isCollapsed ? (
        <View style={styles.creditsDetailSection}>
          <View>
            {userDetail?.user_from === "individual" ? (
              <Text style={styles.profilePriceTitle}>Starting from</Text>
            ) : (
              <Text style={styles.profilePriceTitle}>Paid by organisation</Text>
            )}
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              {userDetail?.user_from === "individual" ? (
                <>
                  <Text style={styles.profilePrice}>
                    ₹
                    {user?.mobile_expert_level?.mobile_plan[2]?.mobile_offers[0]
                      ?.price /
                      user?.mobile_expert_level?.mobile_plan[2]?.mobile_duration
                        .frequency}
                  </Text>
                  {/* Sized Box */}
                  <View style={{ width: wp(0.8) }} />
                  <Text
                    style={{
                      ...styles.profilePrice,
                      color: colors.borderLight,
                      fontSize: RFValue(8),
                      marginBottom: hp(0.1),
                    }}
                  >
                    Per Session
                  </Text>
                </>
              ) : (
                <Text
                  style={{
                    ...styles.profilePrice,
                    color: colors.borderLight,
                    fontSize: RFValue(8),
                    marginBottom: hp(0.1),
                  }}
                >
                  {userDetail?.total_sesssions} sessions
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (userDetail?.user_from === "individual") {
                setIsCollapsed((prevState) => !prevState);
              } else {
                navigation.push("MakeBooking", {
                  type: "add",
                  planId: 1996, // Hardcoded planId to specify it is an org user
                  psyId: user.id,
                  amount: 0,
                  session: userDetail?.total_sesssions,
                });
              }
            }}
            style={styles.bookButton}
          >
            <Text style={styles.bookButtonText}>
              {userDetail?.user_from === "individual" ? "Book a Slot" : "Book"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Collapsed Section */}
      <Collapsible collapsed={isCollapsed}>
        <Text style={styles.specializationText}>Specialization in:</Text>
        <Text style={{ ...styles.specialization, fontSize: RFValue(11) }}>
          {specializations}
        </Text>

        {/* Sized Box */}
        <View style={{ height: hp(1) }} />

        <View style={{ flexDirection: "row" }}>
          <Feather name="calendar" size={hp(2)} color={colors.pageTitle} />
          {/* Sized Box */}
          <View style={{ width: wp(2) }} />
          <Text style={styles.specialization}>{user?.slot1?.days}</Text>
        </View>
        {/* Sized Box */}
        <View style={{ height: hp(1) }} />

        <View style={{ flexDirection: "row" }}>
          <AntDesign
            name="clockcircleo"
            size={hp(2)}
            color={colors.pageTitle}
          />
          {/* Sized Box */}
          <View style={{ width: wp(2) }} />
          <Text style={styles.specialization}>{user?.slot1?.time}</Text>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(1) }} />

        <Text style={{ ...styles.specialization, textAlign: "auto" }}>
          {user?.summary}
        </Text>

        {user?.mobile_expert_level?.mobile_plan.map((plan) => (
          <>
            {/* Sized Box */}
            <View style={{ height: hp(2) }} />

            <View style={styles.creditsDetailSection}>
              <View>
                <Text style={styles.sessionPriceTitle}>
                  Rs.{plan?.mobile_offers[0].price}
                </Text>
                <Text style={styles.sessionPrice}>
                  <Text style={{ textDecorationLine: "line-through" }}>
                    {plan?.price}
                  </Text>{" "}
                  for {plan?.mobile_duration?.frequency} session
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  navigation.push("MakeBooking", {
                    type: "add",
                    planId: plan.id,
                    psyId: user.id,
                    amount: plan?.mobile_offers[0].price,
                    session: plan?.mobile_duration?.frequency,
                  })
                }
                style={styles.bookButton}
              >
                <Text style={styles.bookButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </>
        ))}
      </Collapsible>
    </TouchableOpacity>
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
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: hp(100),
    width: wp(30),
    height: hp(5),
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
  },
  profilePriceTitle: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
  },
  profilePrice: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    color: colors.pageTitle,
  },
  specializationText: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    color: colors.borderLight,
  },
  specialization: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
  sessionPriceTitle: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsMedium",
    color: colors.pageTitle,
  },
  sessionPrice: {
    fontSize: RFValue(10),
    fontFamily: "PoppinsMedium",
    color: colors.borderLight,
  },
});

export default BookingCard;
