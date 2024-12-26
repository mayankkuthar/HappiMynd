import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constatnts
import { colors } from "../../assets/constants";

const PricingCard = (props) => {
  // Prop Destructuring
  const { navigation = null } = props;
  const {
    name = "",
    description = "",
    originalPrice = "",
    discountedPrice = "",
    discountPercent = "",
    mobile_plans = [],
    is_subscribed = 0,
  } = props.data;


  // console.log('PricingCardpROPS____ ', is_subscribed)

  const {
    addBundleHandler = () => {},
    totalAmount = 0,
    setTotalAmount,
    // addedBundles = "",
    addedBundles ,
    removeBundleHandler = () => {},
    setAddedBundles,
    setBundlesInfo,
    highlighted = false,
  } = props;


  const addClickHandlerAndroid = () => {
    // console.log("addClickHandlerAndroid----->",mobile_plans[0]);
    if (addedBundles.includes(mobile_plans[0]?.id)) {
      removeBundleHandler(mobile_plans[0]?.id);
      if (totalAmount === 0) {
        // setBundlesInfo([]);
        // setAddedBundles([]);
      } else {
        // console.log("remove----->");
        let total = totalAmount - mobile_plans[0]?.mobile_offers[0].price;
        if (total < 0) {
          setTotalAmount(0);
        } else {
          setTotalAmount(
            (prevState) => prevState - mobile_plans[0]?.mobile_offers[0].price
          );
        }
      }
    } else {
      addBundleHandler({
        id: mobile_plans[0]?.id,
        name,
        price: mobile_plans[0]?.mobile_offers[0].price,
      });
      if (is_subscribed !== 2) {
        // If the product is "Avail for free" than we donot need to add price
        setTotalAmount(
          (prevState) => prevState + mobile_plans[0]?.mobile_offers[0].price
        );
      }
    }
  };

  const addClickHandlerIos = () => {
    console.log("addClickHandlerIos____",addedBundles )
    if (addedBundles.length) {
      // For IOS adding one product at a time
      setAddedBundles([]);
      setBundlesInfo([]);
      setTotalAmount(0);

      addBundleHandler({
        id: props.data.id,
        productId: props.data.productId,
        name,
        price: mobile_plans[0]?.price,
      });
      if (is_subscribed !== 2) {
        // If the product is "Avail for free" than we donot need to add price
        setTotalAmount(
          (prevState) => prevState + Number(mobile_plans[0].price)
        );
      }
    }
    else if (addedBundles.includes(props.data.id)) {
      removeBundleHandler(props.data.id);
      setTotalAmount(0); // After removing set total to zero else it will go o negative values
      setBundlesInfo([]);
      setAddedBundles([]);
    } else {
      console.log("props_",props.data.id )

      addBundleHandler({
        id: props.data.id,
        productId: props.data.productId,
        name,
        price: mobile_plans[0]?.price,
      });
      if (is_subscribed !== 2) {
        // If the product is "Avail for free" than we donot need to add price
        setTotalAmount(
          (prevState) => prevState + Number(mobile_plans[0].price)
        );
      }
    }
  };

  return (
    <View
      style={{
        ...styles.container,
        borderWidth: highlighted ? 1.5 : 0,
        borderColor: colors.primaryText,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.cardTitle}>
          {name.includes("HappiLIFE Screening")
            ? "HappiLIFE Awareness Tool"
            : name === "HappiLIFE Summary Reading"
            ? "HappiLEARN"
            : name.length >= 20
            ? name.substring(0, 20) + "..."
            : name}
        </Text>
        {Platform.OS === "android" ? (
          <Text style={styles.offPricing}>
            {mobile_plans[0]?.mobile_offers[0]?.discount}% OFF
          </Text>
        ) : null}
      </View>

      {/* Sized Box */}
      <View style={{ height: hp(1) }} />
      <Text style={styles.cardDescription}>
        {name === "HappiLIFE Screening"
          ? "Globally validated 10 Parameter Awareness Summary."
          : name === "HappiLIFE Summary Reading"
          ? "Enrich yourself with a 24*7 access to 5000+ minutes of curated, well researched self-help content that includes video, audio, blogs and more."
          : name === "HappiVOICE (Year)"
          ? "Keep a watch on your emotional health stats everyday, through a 30 secs voice recording. Try today !!"
          :name === "HappiVOICE (Month)"
          ? "Keep a watch on your emotional health stats everyday, through a 30 secs voice recording. Try today !!"
          : name === "HappiBUDDY"
          ? "We aim to provide a non-judgemental, anonymous, virtual space that connects you to a professional expert buddy anytime, anywhere."
          : description}
      </Text>

      {/* Sized Box */}
      <View style={{ height: hp(1) }} />

      <Text style={styles.cardSubDes}>
        {/* {name.includes("HappiLIFE") ? "Single Report Fees." : "One Time Pay"} */}
        {name === "HappiLIFE Screening"
          ? "Single Report Fees"
          : name === "HappiGUIDE"
          ? "One Session Fees"
          : name === "HappiTALK"
          ? "Starting from per session"
          : name === "HappiVOICE (Month)" 
          ? "Monthly Subscription"
          : "Annual Subscription"}
      </Text>

      {/* Sized Box */}
      <View style={{ height: hp(1) }} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          {/* Original Price */}
          <Text
            style={{
              ...styles.cutPrice,
              textDecorationLine:
                Platform.OS === "android" ? "line-through" : "none",
            }}
          >
            {/* {console.log("check price - ", 
            // props
            )} */}
            {Platform.OS === "android"
              ? name === "HappiTALK"
                ? null
                : `Rs. ${mobile_plans[0]?.price}`
              : mobile_plans[0]?.localizedPrice}
          </Text>
          {/* Sized Box */}
          <View style={{ width: hp(1) }} />
          {/* Discounted Price */}
          {Platform.OS === "android" ? (
            <Text style={styles.actualPrice}>
              Rs.
              {name === "HappiTALK"
                ? "1215"
                : mobile_plans[0]?.mobile_offers[0]?.price}
            </Text>
          ) : null}
        </View>

        {name.includes("HappiTALK") || name.includes("HappiGUIDE") ? (
          <TouchableOpacity
            disabled={is_subscribed == 1}
            activeOpacity={0.7}
            style={{
              ...styles.cardButton,
              backgroundColor: is_subscribed ? "#fff" : colors.primary,
            }}
            onPress={() => {
              if (name.includes("HappiTALK")) navigation.replace("BookingList");
              if (name.includes("HappiGUIDE")) {
                navigation.replace("MakeBooking", {
                  module: "guide",
                  type: "add",
                  // psyId: 10,
                  planId: "22",
                  amount: "539",
                  // session: 1,
                });
              }
            }}
          >
            <Text
              style={{
                ...styles.cardButtonText,
                color: is_subscribed ? colors.pageTitle : colors.borderBlack,
              }}
            >
              {is_subscribed == 1 // 1 === Subscribed
                ? "Subscribed"
                : "Book"}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={is_subscribed == 1}
            activeOpacity={0.7}
            style={{
              ...styles.cardButton,
              backgroundColor: is_subscribed ? "#fff" : colors.primary,
            }}
            onPress={() =>
              Platform.OS === "android"
                ? addClickHandlerAndroid()
                : addClickHandlerIos()
            }
          >
            <Text
              style={{
                ...styles.cardButtonText,
                color: is_subscribed ? colors.pageTitle : colors.borderBlack,
              }}
            >
              {is_subscribed == 1 // 1 === Subscribed
                ? "Subscribed"
                : addedBundles.includes(
                    Platform.OS === "android"
                      ? mobile_plans[0]?.id
                      : props.data.id
                  )
                ? "Remove"
                : is_subscribed == 2 // 2 == Avail for free
                ? "Avail for free"
                : "Add"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: wp(79),
    // height: hp(20),
    borderRadius: 8,
    paddingHorizontal: hp(2),
    paddingVertical: hp(2),
  },
  cardTitle: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsSemiBold",
  },
  offPricing: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: colors.primaryText,
  },
  cardDescription: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
    textAlign: "justify",
  },
  cardSubDes: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
  },
  cardButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: hp(1),
    paddingHorizontal: hp(2),
    borderRadius: hp(10),
  },
  cardButtonText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: colors.pageTitle,
  },
  cutPrice: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsMedium",
    color: colors.borderLight,
    textDecorationLine: "line-through",
  },
  actualPrice: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsMedium",
    color: colors.pageTitle,
  },
});

export default PricingCard;
