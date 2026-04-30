import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Collapsible from "react-native-collapsible";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";
import { StringDateTimeCombine, StringToDateConvert } from "../../utils/Util";

// Components
import Header from "../../components/common/Header";
import ConfidentialModal from "../../components/Modals/ConfidentialModal";
import CancelBookingModal from "../../components/Modals/CancelBookingModal";
import moment from "moment";

const Tab = createMaterialTopTabNavigator();

// Status View
export const CardStatus = ({ status }) => {
  return (
    <View style={styles.statusContainer}>
      {status === "PENDING" ? (
        <AntDesign name="clockcircle" size={hp(1.5)} color="red" />
      ) : status === "CANCELLED" ? (
        <Entypo name="circle-with-cross" size={hp(1.6)} color="red" />
      ) : status === "ACCEPTED" ? (
        <Ionicons
          name="checkmark-circle"
          size={hp(1.8)}
          color={colors.pageTitle}
        />
      ) : status === "COMPLETED" ? (
        <Ionicons name="checkmark-circle" size={hp(1.8)} color="green" />
      ) : null}

      <Text
        style={{
          ...styles.statusText,
          color:
            status === "PENDING"
              ? "red"
              : status === "CANCELLED"
              ? "red"
              : status === "ACCEPTED"
              ? colors.primaryText
              : status === "COMPLETED"
              ? "green"
              : colors.borderLight,
        }}
      >
        {status}
      </Text>
    </View>
  );
};

const BookingCard = (props) => {
  // Prop Destructuring
  const { navigation, getUserBookings = () => {} } = props;
  const {
    date = "",
    time = "",
    psychologist_detail = {},
    id = "",
    is_req_accepted = "",
    is_cancel = "",
    is_end = "",
  } = props.data;

  // Context Variables
  const { cancelBooking, snackDispatch, getUserReport } = useContext(Hcontext);

  // State Variables
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showConfidentialModal, setShowConfidentialModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [status, setStatus] = useState("");
  const [userReport, setUserReport] = useState("");
  const [loading, setLoading] = useState(false);

  // Mounting
  useEffect(() => {
    bookingStatusHandler();
  }, [props.data]);

  const bookingStatusHandler = () => {
    // Setting the status for the session

    if (is_cancel == 1) {
      return setStatus("CANCELLED");
    }

    if (is_req_accepted == 0) {
      setStatus("PENDING");
    } else if (is_req_accepted == 2) {
      setStatus("REJECTED");
    } else if (is_req_accepted == 1) {
      if (is_cancel == 1) {
        setStatus("CANCELLED");
      } else if (is_cancel == 0 && is_end == 0) {
        setStatus("ACCEPTED");
      } else if (is_cancel == 0 && is_end == 1) {
        setStatus("COMPLETED");
      }
    }
  };

  const cancelBookingHandler = async (sessionId) => {
    // Check if user has a cancelling reason
    if (!cancelReason) {
      setShowCancelModal(false);
      return snackDispatch({
        type: "SHOW_SNACK",
        payload: "Please give reason for cancelling !",
      });
    }

    setLoading(true);
    try {
      const cancelRes = await cancelBooking({ sessionId, cancelReason });

      if (cancelRes.status === "success") {
        getUserBookings();
        setShowCancelModal(false);
        snackDispatch({ type: "SHOW_SNACK", payload: cancelRes.message });
      }
    } catch (err) {
      console.log(
        "Some issue while cancelling user booking (ManageBookings.js) - ",
        err
      );
    }
    setLoading(false);
  };

  // const fetchUserReport = async (user) => {
  //   try {
  //     const userReport = await getUserReport({ user });
  //     console.log(`The fetched user report for ${user} - `, userReport);
  //   } catch (err) {
  //     console.log(
  //       "Some issue while getting user report (ManageBooking.js) - ",
  //       err
  //     );
  //   }
  // };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setIsCollapsed((prevState) => !prevState)}
      style={styles.cardContainer}
    >
      <ConfidentialModal
        showModal={showConfidentialModal}
        setShowModal={setShowConfidentialModal}
        pressHandler={() => setShowConfidentialModal(false)}
      />

      {showCancelModal && (
        <CancelBookingModal
          showModal={showCancelModal}
          setShowModal={setShowCancelModal}
          pressHandler={() => cancelBookingHandler(id)}
          cancelReason={cancelReason}
          setCancelReason={setCancelReason}
          loading={loading}
          userType={props?.data?.user_type}
        />
      )}

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
          {/* <TouchableOpacity
            style={{ paddingRight: wp(4), paddingTop: hp(0.3) }}
            activeOpacity={0.7}
            onPress={() => fetchUserReport(id)}
          >
            <AntDesign name="form" size={hp(2)} color="black" />
          </TouchableOpacity> */}
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
          <TouchableOpacity
            activeOpacity={0.7}
            // onPress={() => setShowConfidentialModal(true)}
            onPress={() => {
              //console.log("call date  ", date); //2023-06-12
              // console.log("call  time ", time);

              let validStartSlot = true;
              let validEndSlot = true;

              try {
                //start slot time
                const lastSlot = time.split(" - ");
                let selectSlotStart = lastSlot[0];
                console.log("selectSlot ", selectSlotStart.toLowerCase());

                var callStartStr = StringDateTimeCombine(date, selectSlotStart);
                console.log("callStartStr", callStartStr);

                var beginningTime = StringToDateConvert(callStartStr);
                console.log("begin", beginningTime);

                //end slot time
                let selectSlotEnd = lastSlot[1];
                console.log("selectSlotEnd ", selectSlotEnd.toLowerCase());

                var callEndStr = StringDateTimeCombine(date, selectSlotEnd);
                console.log("callEndStr", callEndStr);

                var endCallTime = StringToDateConvert(callEndStr);
                console.log("end", endCallTime);

                //current date time
                //2023-06-12 11:00 pm
                var currentTimeStr = moment().format("YYYY-MM-DD hh:mm a");
                var currentTime = StringToDateConvert(currentTimeStr);
                console.log("current", currentTime);

                validStartSlot = currentTime.isSameOrAfter(beginningTime);
                validEndSlot = currentTime.isSameOrBefore(endCallTime);

                console.log("result1", validStartSlot);
                console.log("result2", validEndSlot);
              } catch (error) {
                console.log("305", error);
              }

              // console.log(
              //   "ajsdkaskdjhlllllllll",
              //   moment(
              //     `${date} ${time.split("-")[0].trim()}`,
              //     "YYYY-MM-DD hh:mm a"
              //   ).isSameOrBefore(
              //     moment(
              //       moment().format("YYYY-MM-DD hh:mm a"),
              //       "YYYY-MM-DD hh:mm a"
              //     )
              //   )
              // );
              if (validStartSlot && validEndSlot) {
                console.log("join call");
                navigation.push("VideoCall", { sessionId: id, module: "talk" });
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
              opacity:
                status === "PENDING" ||
                status === "COMPLETED" ||
                status === "CANCELLED" ||
                status === "REJECTED"
                  ? 0.3
                  : 1,
            }}
            disabled={
              status === "PENDING" ||
              status === "COMPLETED" ||
              status === "CANCELLED" ||
              status === "REJECTED"
            }
          >
            <Text style={styles.cardButtonText}>Join Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigation.push("MakeBooking", {
                type: "reschedule",
                psyId: psychologist_detail?.id,
                planId: "",
                amount: "",
                session: id,
              })
            }
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
            <Text style={styles.cardButtonText}>Reschedule</Text>
          </TouchableOpacity>
        </View>
        {/* Sized Box */}
        <View style={{ height: hp(1) }} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigation.push("Feedback", {
                showBack: true,
                sessionId: id,
                module: "talk",
              })
            }
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
                status === "REJECTED" ||
                // moment(`${date} ${time.split("-")[0].trim()}`).isSameOrBefore(
                //   new Date()
                // )
                moment(
                  `${date} ${time.split("-")[0].trim()}`,
                  "YYYY-MM-DD hh:mm a"
                ).isSameOrBefore(
                  moment(
                    //  moment().format("YYYY-MM-DD hh:mm a"),
                    new Date(),
                    "YYYY-MM-DD hh:mm a"
                  )
                )
                  ? 0.3
                  : 1,
            }}
            disabled={
              status === "COMPLETED" ||
              status === "CANCELLED" ||
              status === "REJECTED" ||
              // moment(`${date} ${time.split("-")[0].trim()}`).isSameOrBefore(
              //   new Date()
              // )
              moment(
                `${date} ${time.split("-")[0].trim()}`,
                "YYYY-MM-DD hh:mm a"
              ).isSameOrBefore(moment(new Date(), "YYYY-MM-DD hh:mm a"))
            }
          >
            <Text style={styles.cardButtonText}>Cancel Booking</Text>
          </TouchableOpacity>
        </View>
      </Collapsible>
    </TouchableOpacity>
  );
};

const TabScreen = (props) => {
  // Prop Destructuring
  const { navigation, bookingType } = props;

  // Context Variables
  const { myBookingUsers } = useContext(Hcontext);

  // State Variables
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(true);

  // // Mounting
  // useEffect(() => {
  //   getUserBookings();

  //   return () => {
  //     console.log("Tab Screen unmounted - ", bookingType);
  //   };
  // }, []);

  // Focus Effect
  useFocusEffect(
    useCallback(() => {
      getUserBookings();
    }, [])
  );

  const getUserBookings = async () => {
    setLoading(true);
    try {
      const bookings = await myBookingUsers({ bookingType });
      console.log("Check the bookings - ", bookings);
      if (bookings.status === "success")
        setBookingList(bookings.session_detail);
    } catch (err) {
      console.log(
        "Some issue while getting user bookings (ManageBookings.js) - ",
        err
      );
    }
    setLoading(false);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      resizeMode="cover"
      style={styles.container}
    >
      {/* Body Section */}
      <View style={{ paddingHorizontal: wp(10), flex: 1 }}>
        {/* Sized Box */}
        <View style={{ height: hp(3) }} />

        <View style={{ flex: 1 }}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.loaderColor} />
          ) : bookingList.length ? (
            <FlatList
              onRefresh={getUserBookings}
              refreshing={loading}
              data={bookingList}
              renderItem={({ item }) => (
                <View>
                  <BookingCard
                    data={item}
                    navigation={navigation}
                    getUserBookings={getUserBookings}
                  />
                  {/* Sized Box */}
                  <View style={{ height: hp(2) }} />
                </View>
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            // bookingList.map((data) => (
            //   <View key={data.id}>
            //     <BookingCard data={data} navigation={navigation} />
            //     {/* Sized Box */}
            //     <View style={{ height: hp(2) }} />
            //   </View>
            // ))
            <Text style={styles.emptyBookingText}>No bookings available</Text>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const ManageBookings = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  return (
    <>
      <ImageBackground
        source={require("../../assets/images/language_background.png")}
        resizeMode="cover"
        style={styles.container}
      >
        <Header showLogo={false} showBack={true} navigation={navigation} />
        <View style={{ paddingHorizontal: wp(10) }}>
          <Text style={styles.pageTitle}>Manage Bookings</Text>
        </View>
        <Tab.Navigator
          tabBarOptions={{
            indicatorStyle: { backgroundColor: colors.pageTitle },
            activeTintColor: colors.pageTitle,
            inactiveTintColor: colors.borderLight,
          }}
          screenOptions={{
            tabBarStyle: {
              backgroundColor: "transparent",
              paddingTop: hp(2),
            },
          }}
          initialRouteName="Today"
        >
          <Tab.Screen
            name="Past"
            component={() => (
              <TabScreen bookingType={"past"} navigation={navigation} />
            )}
          />
          <Tab.Screen
            name="Today"
            component={() => (
              <TabScreen bookingType={"today"} navigation={navigation} />
            )}
          />
          <Tab.Screen
            name="Future"
            component={() => (
              <TabScreen bookingType={"future"} navigation={navigation} />
            )}
          />
        </Tab.Navigator>
      </ImageBackground>
    </>
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
    color: colors.pageTitle,
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
    flexDirection: "row",
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
  },
});

export default ManageBookings;
