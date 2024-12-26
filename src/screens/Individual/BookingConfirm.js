import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Lottie from "lottie-react-native";

// Constants
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";
import Button from "../../components/buttons/Button";

const BookingConfirm = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  const  isFrom  = props?.route?.params?.isFrom;
  // console.log("is form getting---------",isFrom);

  return (
    <View style={styles.container}>
      {/* Sized Box */}
      <View style={{ height: hp(10) }} />
      <View style={styles.mainSection}>
        <Image
          source={require("../../assets/images/happimynd_logo.png")}
          resizeMode="contain"
          style={styles.pageLogo}
        />

        {/* Sized Box */}
        <View style={{ height: hp(6) }} />

        <Lottie
          // source={{
          //   uri: "https://assets9.lottiefiles.com/packages/lf20_s2lryxtd.json",
          // }}
          source={require("../../assets/images/lottie-success.json")}
          autoPlay
          loop
          style={{ height: hp(30), width: wp(90) }}
        />

        {/* Sized Box */}
        <View style={{ height: hp(6) }} />

        <Text style={styles.mainText}>
          Your booking request has been placed
        </Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <Text style={styles.subText}>
          When our{" "}
          <Text style={{ fontWeight: "bold", fontFamily: "PoppinsSemiBold" }}>
            {isFrom != undefined ? "counselling coach" : "psychologist"}
          </Text>{" "}
          confirms your booking, you will receive a notification.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          text="Confirm"
          pressHandler={() => {
            // navigation.replace("HappiTALKBook")
            navigation.replace("HomeScreen");
          }}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainSection: {
    // backgroundColor: "yellow",
    alignItems: "center",
  },
  pageLogo: {
    // backgroundColor: "red",
    width: wp(45),
    height: hp(10),
  },
  mainText: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsSemiBold",
  },
  subText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    textAlign: "center",
    width: wp(70),
  },
  buttonContainer: {
    position: "absolute",
    paddingHorizontal: wp(10),
    width: "100%",
    bottom: hp(4),
  },
});

export default BookingConfirm;
