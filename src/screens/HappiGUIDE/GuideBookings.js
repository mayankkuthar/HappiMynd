import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Collapsible from "react-native-collapsible";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import moment from "moment";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// COmponents
import Header from "../../components/common/Header";
import { CardStatus } from "../HappiTALK/ManageBookings";

export const BookingCard = (props) => {
  // Prop Destructuring
  const { navigation, getUserBookings = () => {} } = props;
  const {
    date = "",
    time = "",
    psychologist_detail = {},
    id = "",
    is_end = "",
  } = props.data;

  // Context Variables
  const { cancelBooking, snackDispatch } = useContext(Hcontext);

  // State Variables
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showConfidentialModal, setShowConfidentialModal] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Mounting
  useEffect(() => {
    bookingStatusHandler();
  }, [props.data]);

  const bookingStatusHandler = () => {
    // Setting the status for the session
    console.log(props.data);

    if (is_end == 1) {
      setStatus("COMPLETED");
    } else {
      setStatus("PENDING");
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setIsCollapsed((prevState) => !prevState)}
      style={styles.cardContainer}
    >
      {/* <ConfidentialModal
        showModal={showConfidentialModal}
        setShowModal={setShowConfidentialModal}
        pressHandler={() => setShowConfidentialModal(false)}
      /> */}
      <CardStatus status={status} />
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{ uri: psychologist_detail?.psy_profile }}
          resizeMode="cover"
          style={styles.cardImage}
        />
        <View style={styles.cardMiddleContainer}>
          <View>
            <Text style={styles.cardName}>{psychologist_detail?.username}</Text>
            {/* <CardStatus status={status} /> */}
          </View>
          {/* SIzed Box */}
          <View style={{ height: hp(1) }} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <AntDesign
                name="clockcircle"
                size={hp(1.5)}
                color={colors.pageTitle}
              />
              {/* SIzed Box */}
              <View style={{ width: hp(0.5) }} />
              <Text style={styles.cardDetails}>{time}</Text>
            </View>
            {/* SIzed Box */}
            <View style={{ width: hp(1.5) }} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Entypo name="calendar" size={hp(1.5)} color={colors.pageTitle} />
              {/* SIzed Box */}
              <View style={{ width: hp(0.5) }} />
              <Text style={styles.cardDetails}>{date}</Text>
            </View>
          </View>
        </View>
        <View style={styles.cardEndContainer}>
          <TouchableOpacity
            // style={{ backgroundColor: "red" }}
            activeOpacity={0.7}
            onPress={() => setIsCollapsed((prevState) => !prevState)}
          >
            <Entypo
              name={isCollapsed ? "chevron-down" : "chevron-up"}
              size={hp(2.5)}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Collapsible collapsed={isCollapsed}>
        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {status === "COMPLETED" ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                navigation.push("Feedback", {
                  sessionId: id,
                  module: "guide",
                  showBack: true,
                });
              }}
              style={{
                ...styles.cardButton,
                width: "100%",
              }}
            >
              <Text style={styles.cardButtonText}>Give Feedback</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={0.7}
                // onPress={() => setShowConfidentialModal(true)}
                onPress={() => {
                  // console.log(
                  //   "start",
                  //   moment(
                  //     `${date} ${time.split("-")[0].trim()}`,
                  //     "YYYY-MM-DD hh:mm a"
                  //   )
                  // );

                  // console.log(
                  //   "end",
                  //   moment(
                  //     `${date} ${time.split("-")[1].trim()}`,
                  //     "YYYY-MM-DD hh:mm a"
                  //   )
                  // );

                  var valid = true;
                  try {
                    valid = moment().isBetween(
                      moment(
                        `${date} ${time.split("-")[0].trim()}`,
                        "YYYY-MM-DD hh:mm a"
                      ),
                      moment(
                        `${date} ${time.split("-")[1].trim()}`,
                        "YYYY-MM-DD hh:mm a"
                      )
                    );
                    console.log("valid166", valid);
                  } catch (error) {
                    console.log("185", error);
                  }

                  if (valid) {
                    navigation.push("VideoCall", {
                      sessionId: id,
                      module: "guide",
                    });
                  } else {
                    snackDispatch({
                      type: "SHOW_SNACK",
                      payload:
                        "Please check. You can join the call only in your booked time slot.",
                    });
                  }
                }}
                style={{
                  ...styles.cardButton,
                  opacity: status === "COMPLETED" ? 0.3 : 1,
                }}
                disabled={status === "COMPLETED"}
              >
                <Text style={styles.cardButtonText}>Join Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  navigation.push("MakeBooking", {
                    module: "guide",
                    type: "reschedule",
                    // psyId: psychologist_detail?.id,
                    planId: "",
                    amount: "",
                    session: id,
                  })
                }
                style={{
                  ...styles.cardButton,
                  opacity: status === "COMPLETED" ? 0.3 : 1,
                }}
                disabled={status === "COMPLETED"}
              >
                <Text style={styles.cardButtonText}>Reschedule</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        {/* Sized Box */}
        <View style={{ height: hp(1) }} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {/* <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.push("Feedback", { showBack: true })}
            style={{
              ...styles.cardButton,
              opacity:
                status === "ACCEPTED" ||
                status === "PENDING" ||
                status === "CANCELLED" ||
                status === "REJECTED"
                  ? 0.3
                  : 1,
            }}
            disabled={
              status === "ACCEPTED" ||
              status === "PENDING" ||
              status === "CANCELLED" ||
              status === "REJECTED"
            }
          >
            <Text style={styles.cardButtonText}>Give Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowCancelModal(true)}
            style={{
              ...styles.cardButton,
              opacity:
                status === "COMPLETED" ||
                status === "CANCELLED" ||
                status === "REJECTED"
                  ? 0.3
                  : 1,
            }}
            disabled={
              status === "COMPLETED" ||
              status === "CANCELLED" ||
              status === "REJECTED"
            }
          >
            <Text style={styles.cardButtonText}>Cancel Booking</Text>
          </TouchableOpacity> */}
        </View>
      </Collapsible>
    </TouchableOpacity>
  );
};

const GuideBookings = (props) => {
  // Prop destructuring
  const { navigation, route } = props;
  const {
    session = {},
    fetchHappiGuideSession = () => {},
    loading = false,
  } = route?.params;

  // // COntext Variables
  // const { happiGUIDESession } = useContext(Hcontext);

  // // STate Variables
  // const [session, setSessions] = useState(null);
  // const [loading, setLoading] = useState(true);

  // // Mounting
  // useEffect(() => {
  //   fetchHappiGuideSession();
  // }, []);

  // // Fetching the HappiGUIDE session for user
  // const fetchHappiGuideSession = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await happiGUIDESession();
  //     console.log("Check the guide res - ", res);
  //     if (res.status === "success") {
  //       setSessions(res.list);
  //     }
  //   } catch (err) {
  //     console.log(
  //       "Some issue while fetching HappiGUIDE session (GuideBooking.js) - ",
  //       err
  //     );
  //   }
  //   setLoading(false);
  // };

  return (
    <View style={styles.container}>
      <Header showBack={true} showLogo={false} navigation={navigation} />
      <View style={{ paddingHorizontal: wp(10) }}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Guide Booking</Text>
          {/* <TouchableOpacity
            style={styles.refreshButton}
            activeOpacity={0.7}
            onPress={fetchHappiGuideSession}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity> */}
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        {loading ? (
          <ActivityIndicator color={colors.loaderColor} size="small" />
        ) : session ? (
          <BookingCard
            data={session}
            navigation={navigation}
            getUserBookings={fetchHappiGuideSession}
          />
        ) : (
          <Text style={styles.emptyBookingText}>No Booking Available</Text>
        )}
      </View>
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
  cardContainer: {
    backgroundColor: "#F9FEFE",
    width: wp(80),
    // paddingVertical: hp(2),
    // paddingTop: hp(0.5),
    paddingBottom: hp(2),
    paddingHorizontal: hp(2),
    borderRadius: 10,
    // flexDirection: "row",
  },
  cardImage: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(100),
    overflow: "hidden",
  },
  cardMiddleContainer: {
    // backgroundColor: "yellow",
    flex: 1,
    paddingHorizontal: hp(1),
  },
  cardName: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsMedium",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: hp(1),
    paddingBottom: hp(1.5),
    alignSelf: "flex-end",
  },
  statusText: {
    fontSize: RFValue(7),
    paddingHorizontal: hp(0.3),
    fontFamily: "PoppinsMedium",
    color: colors.borderLight,
  },
  cardDetails: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
    color: colors.pageTitle,
  },
  cardEndContainer: {
    // backgroundColor: "red",
  },
  cardButton: {
    backgroundColor: colors.primary,
    width: wp(34),
    borderRadius: hp(100),
    paddingVertical: hp(1),
  },
  cardButtonText: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
    textAlign: "center",
  },
  emptyBookingText: {
    textAlign: "center",
    fontSize: RFValue(18),
    fontFamily: "PoppinsSemiBold",
    color: colors.borderLight,
    textTransform: "capitalize",
    paddingTop: hp(4),
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  refreshButton: {
    borderWidth: 2,
    borderColor: colors.pageTitle,
    borderRadius: hp(100),
    paddingHorizontal: hp(1.5),
    paddingVertical: hp(0.8),
  },
  refreshButtonText: {
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(10),
    color: colors.pageTitle,
  },
});

export default GuideBookings;
