import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect } from "@react-navigation/native";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
import Button from "../../components/buttons/Button";
import ComingSoon from "../../components/Modals/ComingSoon";
import WaveButton from "../../components/buttons/WaveButton";

// const METHOD_DATA = [
//   {
//     supportedMethods: ["apple-pay"],
//     data: {
//       merchantIdentifier: "merchant.apple.test",
//       supportedNetworks: ["visa", "mastercard", "amex"],
//       countryCode: "US",
//       currencyCode: "USD",
//     },
//   },
// ];

// const DETAILS = {
//   id: "basic-example",
//   displayItems: [
//     {
//       label: "Movie Ticket",
//       amount: { currency: "USD", value: "15.00" },
//     },
//     {
//       label: "Grocery",
//       amount: { currency: "USD", value: "5.00" },
//     },
//   ],
//   shippingOptions: [
//     {
//       id: "economy",
//       label: "Economy Shipping",
//       amount: { currency: "USD", value: "0.00" },
//       detail: "Arrives in 3-5 days", // `detail` is specific to React Native Payments
//     },
//   ],
//   total: {
//     label: "Enappd Store",
//     amount: { currency: "USD", value: "20.00" },
//   },
// };
// const OPTIONS = {
//   requestPayerName: true,
//   requestPayerPhone: true,
//   requestPayerEmail: true,
//   requestShipping: true,
// };
// const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS, OPTIONS);

// paymentRequest.addEventListener("shippingaddresschange", (e) => {
//   const updatedDetails = getUpdatedDetailsForShippingAddress(
//     paymentRequest.shippingAddress
//   );

//   e.updateWith(updatedDetails);
// });

// paymentRequest.addEventListener("shippingoptionchange", (e) => {
//   const updatedDetails = getUpdatedDetailsForShippingOption(
//     paymentRequest.shippingOption
//   );

//   e.updateWith(updatedDetails);
// });

// check = () => {
//   paymentRequest.canMakePayments().then((canMakePayment) => {
//     if (canMakePayment) {
//       Alert.alert("Apple Pay", "Apple Pay is available in this device");
//     }
//   });
// };

// pay = () => {
//   paymentRequest.canMakePayments().then((canMakePayment) => {
//     if (canMakePayment) {
//       console.log("Can Make Payment");
//       paymentRequest.show().then((paymentResponse) => {
//         // Your payment processing code goes here

//         paymentResponse.complete("success");
//       });
//     } else {
//       console.log("Cant Make Payment");
//     }
//   });
// };

const HappiGUIDE = (props) => {
  // Prop destructuring
  const { navigation } = props;

  // Context Varaibles
  const { authState, happiGUIDESession, getUserProfile } = useContext(Hcontext);

  // State Variables
  const [showModal, setShowModal] = useState(false);
  const [session, setSessions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // // Hits when focus hits
  // useFocusEffect(
  //   useCallback(() => {
  //     fetchHappiGuideSession();

  //     return () => {};
  //   }, [])
  // );

  // Mounting
  useEffect(() => {
    fetchHappiGuideSession();
    fetchUserProfile(authState?.user?.access_token);
  }, []);

  // Fetching the HappiGUIDE session for user
  const fetchHappiGuideSession = async () => {
    setLoading(true);
    try {
      const res = await happiGUIDESession();
      console.log("Check the guide res - ", res);
      if (res.status === "success") {
        setSessions(res.list);
      }
    } catch (err) {
      console.log(
        "Some issue while fetching HappiGUIDE session (GuideBooking.js) - ",
        err
      );
    }
    setLoading(false);
  };

  const fetchUserProfile = async (token) => {
    try {
      setLoadingButton(true);
      const userProfile = await getUserProfile({ token });

      console.log("checking in the user profile - ", userProfile);

      if (userProfile.status === "success") {
        if (userProfile.data.verify_user) {
          if (userProfile.data.verify_user.email_verify) {
            setIsEmailVerified(true);
          }
          if (userProfile.data.verify_user.mobile_verify) {
            setIsPhoneVerified(true);
          }
        }
      }
      setLoadingButton(false);
    } catch (err) {
      setLoadingButton(false);
      console.log("Some issue while fetching user profile - ", err);
    }
  };

  return (
    <View style={styles.container}>
      <Header showBack={true} navigation={navigation} />

      <ScrollView style={{ paddingHorizontal: wp(10) }}>
        {/* Sized Box */}
        <View style={{ height: hp(3) }} />

        <View>
          <Text style={styles.title}>HappiGUIDE</Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Text style={styles.subTitle}>
            Summary Illustration by Emotional Wellbeing Expert
          </Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Image
            source={require("../../assets/images/report_hero.png")}
            resizeMode="contain"
            style={{ ...styles.banner }}
          />

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <View style={styles.detailSection}>
            <Text style={styles.detail}>
              On completing your HappiLIFE awareness, as the next logical step,
              our professional expert will offer a thorough explanation and
              clear interpretation of your awareness summary. Make the most out
              of your awareness summary by gaining a deeper understanding of the
              different facets of your personality. This enables you to identify
              strengths and weaknesses while helping you pinpoint areas of
              management and improvement. The summary reading session takes you
              one step closer to knowing yourself and keeping a check on your
              mental and emotional wellbeing to achieve happiness and a truly
              enhanced quality of life.
            </Text>
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          {!session?.id ? (
            <Button
              text="Get HappiGUIDE Now"
              loading={loadingButton}
              pressHandler={() => {
                if (authState.user) {
                  if (isEmailVerified && isPhoneVerified) {
                    navigation.push("MakeBooking", {
                      module: "guide",
                      type: "add",
                      // psyId: 10,
                      planId: "22",
                      amount: "539",
                      // session: 1,
                    });
                  } else {
                    navigation.navigate("ContactVerification", {
                      isFrom: "Guide",
                    });
                  }
                } else {
                  navigation.push("WelcomeScreen");
                }
              }}
            />
          ) : loading ? (
            <ActivityIndicator size="small" color={colors.loaderColor} />
          ) : null}

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />
          {session?.id ? (
            <>
              <Text style={styles.choiceText}>View Your Bookings</Text>

              {/* Sized Box */}
              <View style={{ height: hp(2) }} />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <WaveButton
                  text="Guide Booking"
                  width={80}
                  pressHandler={() =>
                    navigation.navigate("GuideBookings", {
                      session,
                      fetchHappiGuideSession,
                      loading,
                    })
                  }
                />
              </View>
            </>
          ) : null}

          {/* Sized Box */}
          <View style={{ height: hp(4) }} />
        </View>
      </ScrollView>
      <ComingSoon showModal={showModal} setShowModal={setShowModal} />
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
    textAlign: "justify",
  },
  choiceText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: colors.borderLight,
    textAlign: "center",
  },
});

export default HappiGUIDE;
