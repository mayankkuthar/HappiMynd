import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { weekDayNames } from "react-native-calendars/src/dateutils";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";

const ACCENT_PURPLE = "#A454FE";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
import ConcentModal from "../../components/Modals/ConcentModal";
import CouponModal from "../../components/Modals/CouponModal";
import { timeSlotList as guideTimeSlots } from "../../components/Modals/TimeSlot";

const CalendarCustomHeader = (props) => {
  const {
    month,
    addMonth,
    firstDay,
    onPressArrowLeft,
    onPressArrowRight,
    renderArrow,
  } = props;

  const monthTitle = moment(
    month && typeof month.toDate === "function" ? month.toDate() : month
  ).format("MMMM YYYY");

  const dayNames = weekDayNames(firstDay ?? 1);

  const pressLeft = () => {
    if (typeof onPressArrowLeft === "function") {
      onPressArrowLeft(() => addMonth?.(-1));
    } else {
      addMonth?.(-1);
    }
  };

  const pressRight = () => {
    if (typeof onPressArrowRight === "function") {
      onPressArrowRight(() => addMonth?.(1));
    } else {
      addMonth?.(1);
    }
  };

  return (
    <View>
      <View style={styles.calendarHeaderRow}>
        <Text allowFontScaling={false} style={styles.calendarMonthTitle}>
          {monthTitle}
        </Text>
        <View style={styles.calendarArrowGroup}>
          <TouchableOpacity
            onPress={pressLeft}
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            style={styles.calendarArrow}
          >
            {renderArrow ? (
              renderArrow("left")
            ) : (
              <AntDesign
                name="left"
                size={hp(2)}
                color={colors.primaryText}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={pressRight}
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
            style={styles.calendarArrow}
          >
            {renderArrow ? (
              renderArrow("right")
            ) : (
              <AntDesign
                name="right"
                size={hp(2)}
                color={colors.primaryText}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.calendarDayNames}>
        {dayNames.map((day, index) => (
          <Text
            allowFontScaling={false}
            key={index}
            style={styles.calendarDayName}
          >
            {day}
          </Text>
        ))}
      </View>
    </View>
  );
};

const MakeBooking = (props) => {
  // Prop Destructuring
  const { navigation, route, addedBundles, bundlesInfo } = props;
  const {
    type = "",
    psyId = "",
    planId = "",
    amount = "",
    session = "",
    module = "",
  } = route?.params;

  // Context Variables
  const {
    authState,
    getSlotsOfPsy,
    paymentForHappiTalk,
    snackDispatch,
    bookAnotherSession,
    rescheduleBooking,
    psychologistPayment,
    happiGUIDEPayment,
    rescheduleGuideBooking,
    getBundles,
    availHappiGuideUser,
    onOffStatus,
    applyCoupon,
  } = useContext(Hcontext);

  // State Variables
  const [showConcentModal, setShowConcentModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [psyDates, setPsyDates] = useState([]);
  const [psyTimes, setPsyTimes] = useState([]);
  const [allSlotDatesWithTime, setAllSlotDatesWithTime] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(0);
  const [loading, setLoading] = useState(false);

  const [totalAmount, setTotalAmount] = useState(amount);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [couponId, setCouponId] = useState(0);
  const [showCouponButton, setShowCouponButton] = useState(
    Platform.OS === "android"
  );
  const [bundles, setBundles] = useState([]);
  const [iosBundles, setIosBundles] = useState([]);

  const [disabledDaysIndexes, setDisabledDaysIndexes] = useState([7]);
  const [markedDates, setMarkedDates] = useState({});

  // Mounting
  useEffect(() => {
    console.log("prams=", route?.params);
    // console.log("module=", module);
    if (module === "guide") {
      getDisabledDays(
        new Date().getMonth(),
        new Date().getFullYear(),
        disabledDaysIndexes
      );
    } else {
      getPsycologistDates();
    }

    fetchBundles();
  }, []);

  // Updating Phase
  useEffect(() => {
    console.log("Chec the selected date - ", selectedDate);
    if (selectedDate) {
      const selectedTime = selectedDate?.dateString;
      if (allSlotDatesWithTime)
        setPsyTimes(allSlotDatesWithTime[selectedTime]?.time);
      setSelectedTimeSlot("");
    }
  }, [selectedDate]);

  // Mounting Phase
  useEffect(() => {
    if (Platform.OS === "ios") getOnOffStatus();
  }, []);

  // UpdatingPhase
  useEffect(() => {
    if (isCouponApplied) {
      setIsCouponApplied(false);
      setTotalAmount(totalAmount + discountedAmount);
    }
  }, [coupon]);

  const getDisabledDays = (month, year, daysIndexes) => {
    let pivot = moment().month(month).year(year).startOf("month");
    const end = moment().month(month).year(year).endOf("month");
    let dates = {};
    const disabled = { disabled: true, disableTouchEvent: true };
    while (pivot.isBefore(end)) {
      daysIndexes.forEach((day) => {
        const copy = moment(pivot);
        dates[copy.day(day).format("YYYY-MM-DD")] = disabled;
      });
      pivot.add(7, "days");
    }
    setMarkedDates(dates);
    return dates;
  };

  const getOnOffStatus = async () => {
    try {
      const fetchedStatus = await onOffStatus();
      console.log("The fetched on/off STatus - ", fetchedStatus);

      if (fetchedStatus?.status === "success") {
        setShowCouponButton(fetchedStatus?.is_open ? true : false);
      }
    } catch (err) {
      console.log("Some issue while getting on-off status - ", err);
    }
  };

  const handleCoupon = async () => {
    console.log("handleCoupon....");
    try {
      setShowCouponModal(false);
      let getPlanId = 0;
      if (route?.params?.module === "guide") {
        getPlanId = currentPlan?.mobile_plans[0]?.id;
      } else {
        getPlanId = route?.params?.planId;
      }

      // const getPlanId = currentPlan?.id;
      console.log("Check teh planId here - ", getPlanId);

      const couponRes = await applyCoupon({
        plan: getPlanId, //addedBundles.toString(),
        coupon: coupon,
      });

      console.log("Check teh coupon res - ", couponRes);

      if (couponRes?.status === "success") {
        setIsCouponApplied(true);

        const discountedPrice = discountCalculations(couponRes.data);
        console.log("iddd......", couponRes.data.coupon_id);
        setCouponId(couponRes.data.coupon_id);
        setTotalAmount(totalAmount - discountedPrice);
      }
    } catch (err) {
      console.log("Some problem while applying coupon - ", err);
    }
    setLoading(false);
  };

  const discountCalculations = (data) => {
    const { plan_id, discount } = data;
    // const item = bundlesInfo.find((bundle) => bundle.id == plan_id);
    const discountedAmount = totalAmount * (discount / 100);
    var rounded = Math.round(discountedAmount * 10) / 10;
    console.log("rounded==>", rounded);
    setDiscountedAmount(rounded);
    return rounded;
  };

  // fetching the user bundles
  const fetchBundles = async () => {
    setLoading(true);
    try {
      const fetchedBundels = await getBundles();

      console.log("fetchedBundels", fetchedBundels);
      if (fetchedBundels.status === "success") {
        //for happy guide
        if (route?.params?.module === "guide") {
          const foundBundel = fetchedBundels.data.find(
            (bundel) => bundel.name === "HappiGUIDE"
          );
          console.log("Teh fetched bundels are - ", foundBundel);
          setCurrentPlan(foundBundel);
        } else {
          // for happy talk
          const foundBundelTalk = fetchedBundels.data.find(
            (bundel) => bundel.name === "HappiTALK"
          );
          setCurrentPlan(foundBundelTalk);
        }
      }
    } catch (err) {
      console.log("Some issue while fetching bundels - ", ere);
    }
    setLoading(false);
  };

  // getting the available dates for psycologist
  const getPsycologistDates = async () => {
    try {
      const availableDates = await getSlotsOfPsy(psyId);
      console.log("The available dates - ", availableDates);
      if (availableDates.status === "success") {
        setAllSlotDatesWithTime(availableDates.slot_dates_with_time);
        // Formatting the dates response for calendar library
        let formattedDates = {};
        availableDates.slot_dates.forEach((date) => {
          formattedDates = {
            ...formattedDates,
            [date]: {
              selected: true,
              color: colors.primary,
            },
          };
        });
        console.log("Check the formatted dates - ", formattedDates);
        setPsyDates(formattedDates);
      }
    } catch (err) {
      console.log("Some issue while getting psycologist dates - ", err);
    }
  };

  const getAllMarkedDates = () => {
    const base = module === "guide" ? markedDates : psyDates;
    const result = { ...base };

    const todayStr = moment().format("YYYY-MM-DD");
    const todayIsSelected = selectedDate?.dateString === todayStr;

    if (!todayIsSelected && result[todayStr]?.disabled !== true) {
      result[todayStr] = {
        customStyles: {
          container: {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: ACCENT_PURPLE,
          },
          text: { color: ACCENT_PURPLE },
        },
      };
    }

    if (selectedDate?.dateString) {
      result[selectedDate.dateString] = {
        selected: true,
        selectedColor: ACCENT_PURPLE,
        selectedTextColor: "#ffffff",
      };
    }

    return result;
  };

  const bookingConfirmHandler = async (concent) => {
    setLoading(true);
    try {
      setShowConcentModal(false);

      //static check for 1996 plan id
      if (planId === 1996 || totalAmount === 0) {
        const dataToSend = {
          psyId,
          session,
          date: selectedDate.dateString,
          time: selectedTimeSlot,
          shouldRecord: concent,
          coupen_id: couponId,
        };

        console.log("zero........", dataToSend);
        const bookingRes = await psychologistPayment(dataToSend);
        console.log("check the data to send for zero- ", bookingRes);

        if (bookingRes.status === "success") {
          snackDispatch({ type: "SHOW_SNACK", payload: bookingRes.message });
          navigation.navigate("HomeScreen");
        } else {
          snackDispatch({ type: "SHOW_SNACK", payload: bookingRes.message });
        }

        setLoading(false);
        return;
      }

      //for other plans

      const dataToSend = {
        psyId,
        planId,
        amount: totalAmount,
        date: selectedDate.dateString,
        time: selectedTimeSlot,
        session,
        shouldRecord: concent,
        coupen_id: couponId,
      };

      console.log("paymentForHappiTalk", dataToSend);
      const bookingRes = await paymentForHappiTalk(dataToSend);
       
      console.log("data send to happi ------",bookingRes);
      if (bookingRes.status === "success") {
        Linking.openURL(bookingRes.link);
        setTimeout(() => {
          navigation.replace("HappiTALKBook");
          // navigation.navigate("BookingConfirm");
        }, 2000);
      } else if (bookingRes.status === "error") {
        snackDispatch({ type: "SHOW_SNACK", payload: bookingRes.message });
      }

      // navigation.push("BookingConfirm");
    } catch (err) {
      console.log(
        "Some issue while booking confirmation (MakeBooking.js) - ",
        err
      );
    }
    setLoading(false);
  };

  const addAnotherSession = async (bookingId) => {
    setLoading(true);

    try {
      const dataToSend = {
        bookingId,
        date: selectedDate.dateString,
        time: selectedTimeSlot,
      };
      const anotherSessionRes = await bookAnotherSession(dataToSend);
      console.log("chec the data a ti anothe rsend - ", anotherSessionRes);
      if (anotherSessionRes.status === "success") {
        snackDispatch({
          type: "SHOW_SNACK",
          payload: anotherSessionRes.message,
        });
        navigation.navigate("HappiTALKBook");
      } else if (anotherSessionRes.status === "error") {
        snackDispatch({
          type: "SHOW_SNACK",
          payload: anotherSessionRes.message,
        });
      }
    } catch (err) {
      console.log(
        "Some issue while booking another session (MakeBooking.js) - ",
        err
      );
    }
    setLoading(false);
  };

  const rescheduleHandler = async () => {
    setLoading(true);
    try {
      const dataToSend = {
        date: selectedDate.dateString,
        time: selectedTimeSlot,
        session,
      };
      const res = await rescheduleBooking({ ...dataToSend });
      console.log("check the reschedule 233 response - ", res);
      if (res.status === "success") {
        snackDispatch({ type: "SHOW_SNACK", payload: res.message });
        navigation.pop();
      } else {
        snackDispatch({ type: "SHOW_SNACK", payload: res.message });
      }
    } catch (err) {
      console.log(
        "Some issue while rescheduling request (MakeBooking.js) - ",
        err
      );
    }
    setLoading(false);
  };

  // Only used for HappiGUIDE payment mode
  const happiGuidePaymentHandler = async () => {
    if (totalAmount === 0) {
      const planId = currentPlan?.mobile_plans[0]?.id;
      availHappiGuideHandler(planId);
    } else {
      setLoading(true);
      try {
        const dataToSend = {
          plan_id: route?.params?.planId,
          amount: totalAmount,
          date: selectedDate.dateString,
          time: selectedTimeSlot,
          coupen_id: couponId,
        };
        const paymentRes = await happiGUIDEPayment({ ...dataToSend });

        console.log("Check the guide data to send - ", dataToSend);
        console.log("Check the guide payment res - ", paymentRes);

        if (paymentRes.status === "success") {
          Linking.openURL(paymentRes?.link);
          setTimeout(() => navigation.navigate("HomeScreen"), 2000);
          //setTimeout(() => navigation.navigate("BookingConfirm"), 2000);
        }
      } catch (err) {
        console.log(
          "Some issue while proceeding for HappiGUIDE payment - ",
          err
        );
      }
      setLoading(false);
    }
  };

  const happiGuideRescheduleHandler = async () => {
    setLoading(true);

    try {
      const dataToSend = {
        date: selectedDate.dateString,
        time: selectedTimeSlot,
        session,
      };
      const res = await rescheduleGuideBooking({ ...dataToSend });
      console.log("check the reschedule guide response - ", res);
      if (res.status === "success") {
        snackDispatch({ type: "SHOW_SNACK", payload: res.message });
        // navigation.navigate("HomeScreen");
        navigation.navigate("BookingConfirm", { isFrom: "guide" });
      }
    } catch (err) {
      console.log(
        "Some issue while rescheduling guide request (MakeBooking.js) - ",
        err
      );
    }
    setLoading(false);
  };

  const availHappiGuideHandler = async (planId) => {
    setLoading(true);
    try {
      const fetchedRes = await availHappiGuideUser({
        planId,
        date: selectedDate?.dateString,
        time: selectedTimeSlot,
        coupen_id: couponId,
      });
      console.log("check the fetched Rs - ", fetchedRes);

      if (fetchedRes.status === "success") {
        snackDispatch({ type: "SHOW_SNACK", payload: fetchedRes.message });
        // navigation.navigate("HomeScreen");
        navigation.navigate("BookingConfirm");
      }
    } catch (err) {
      console.log(
        "Some issue while availing happiguide user for free (MakeBooking.js) - ",
        err
      );
    }
    setLoading(false);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/booking_background.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <ConcentModal
        showModal={showConcentModal}
        setShowModal={setShowConcentModal}
        pressHandler={bookingConfirmHandler}
      />
      <CouponModal
        showModal={showCouponModal}
        setShowModal={setShowCouponModal}
        handleSubmit={handleCoupon}
        value={coupon}
        setValue={setCoupon}
        isCouponApplied={isCouponApplied}
      />

      {/* Top Section */}
      <View>
        <Header navigation={navigation} showLogo={false} showBack={true} />

        <View style={{ paddingHorizontal: wp(10) }}>
          <Text style={styles.pageTitle}>Schedule Your Session</Text>
        </View>
      </View>

      {/* Sized BOx */}
      <View style={{ height: hp(2) }} />

      {/* Bottom Section */}
      <ScrollView style={styles.bottomContainer}>
        <View>
          <Calendar
            // // Initially visible month. Default = now
            // initialDate={"2012-03-01"}
            // initialDate={moment().format("YYYY-DD-MM")}
            // // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            minDate={moment().format("YYYY-MM-DD")}
            // // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            // maxDate={"2022-10-22"}
            // markingType={"multi-period"}
            customHeader={CalendarCustomHeader}
            markingType={"custom"}
            disabledDaysIndexes={[7]}
            markedDates={getAllMarkedDates()}
            // markedDates={psyDates}
            // Handler which gets executed on day press. Default = undefined
            onDayPress={(day) => {
              console.log("selected day", day);
              setSelectedDate(day);
              //moment().format('dddd');
              // var today = moment().format(day.dateString, "YYYY-MM-DD");
              // var today = moment(day.dateString, "YYYY-MM-DD");
              // var todayDay = moment(today).format("dddd");
              // console.log("todayDay====>", todayDay);
              // if (todayDay == "Sunday") {
              //   snackDispatch({
              //     type: "SHOW_SNACK",
              //     payload: "Soory! You can not select sunday slot.",
              //   });
              // } else {
              //   setSelectedDate(day);
              // }
            }}
            // Handler which gets executed on day long press. Default = undefined
            onDayLongPress={(day) => {
              console.log("selected day", day);
            }}
            // Month display handled by the custom header. Formatting values: http://arshaw.com/xdate/#Formatting
            // Handler which gets executed when visible month changes in calendar. Default = undefined
            onMonthChange={(month) => {
              // console.log(
              //   "month changed",
              //   moment(month.dateString).format("MMMM")
              // );
              if (module === "guide") {
                getDisabledDays(
                  month.month - 1,
                  month.year,
                  disabledDaysIndexes
                );
              }
            }}
            // Replace default arrows with custom ones (direction can be 'left' or 'right')
            renderArrow={(direction) => (
              <View>
                {direction === "left" ? (
                  <AntDesign
                    name="left"
                    size={hp(2)}
                    color={colors.primaryText}
                  />
                ) : (
                  <AntDesign
                    name="right"
                    size={hp(2)}
                    color={colors.primaryText}
                  />
                )}
              </View>
            )}
            // Do not show days of other months in month page. Default = false
            hideExtraDays={true}
            // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
            // day from another month that is visible in calendar page. Default = false
            disableMonthChange={false}
            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
            firstDay={1}
            // Hide day names. Default = false
            hideDayNames={false}
            // Show week numbers to the left. Default = false
            showWeekNumbers={false}
            // Handler which gets executed when press arrow icon left. It receive a callback can go back month
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            // Handler which gets executed when press arrow icon right. It receive a callback can go next month
            onPressArrowRight={(addMonth) => addMonth()}
            // Disable left arrow. Default = false
            disableArrowLeft={false}
            // Disable right arrow. Default = false
            disableArrowRight={false}
            // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
            disableAllTouchEventsForDisabledDays={false}
            // Enable the option to swipe between months. Default = false
            enableSwipeMonths={false}
          />
          {/* <Image
            source={require("../../assets/images/calendar.png")}
            resizeMode="contain"
            style={styles.calendarImage}
          /> */}

          {/* Sized BOx */}
          <View style={{ height: hp(2) }} />

          {/* Time Slots Section */}
          {selectedDate?.dateString
            ? (() => {
                const availableSlots = (
                  module === "guide"
                    ? guideTimeSlots.map((slot) => slot.time)
                    : psyTimes || []
                ).filter(
                  (timeSlot) =>
                    moment(
                      `${selectedDate?.dateString} ${timeSlot
                        .split("-")[0]
                        .trim()}`,
                      "YYYY-MM-DD hh:mm:ss A"
                    ).isAfter(new Date())
                );

                return availableSlots.length ? (
                  <>
                    {/* Sized BOx */}
                    <View style={{ height: hp(1) }} />

                    <Text style={styles.slotHeading}>Select Time Slot</Text>

                    {/* Time Slot Grid */}
                    <View style={styles.timeGrid}>
                      {availableSlots.map((timeSlot, index) => (
                        <TouchableOpacity
                          key={index}
                          activeOpacity={0.7}
                          onPress={() => setSelectedTimeSlot(timeSlot)}
                          style={[
                            styles.timeGridChip,
                            {
                              backgroundColor:
                                selectedTimeSlot === timeSlot
                                  ? ACCENT_PURPLE
                                  : "#E9D5FF",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.timeGridChipText,
                              {
                                color:
                                  selectedTimeSlot === timeSlot
                                    ? "#FFFFFF"
                                    : "#191719",
                              },
                            ]}
                          >
                            {timeSlot}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                ) : null;
              })()
            : null}

          {/* Sized BOx */}
          <View style={{ height: hp(8) }} />
        </View>
      </ScrollView>

      {/* Pricing Section */}
      <View style={styles.pricingContainer}>
        <View style={{ opacity: type === "reschedule" ? 0 : 1 }}>
          <Text style={styles.amountTitle}>Total Amount</Text>
          <Text style={styles.amountValue}>Rs. {totalAmount}</Text>
        </View>
        {type == "reschedule" ? null : (
          <View
            style={{
              flexDirection: "row",
              marginLeft: 5,
              marginRight: 5,
            }}
          >
            {showCouponButton ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowCouponModal(true)}
                style={{
                  ...styles.bookButton,
                  opacity: !selectedTimeSlot || !selectedDate ? 0.3 : 1,
                }}
                disabled={!selectedTimeSlot || !selectedDate}
              >
                <Text style={styles.bookButtonText}>Apply Coupon</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
        <View>
          {loading ? (
            <ActivityIndicator size="small" color={colors.loaderColor} />
          ) : type === "reschedule" ? (
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                ...styles.bookButton,
                opacity: selectedTimeSlot ? 1 : 0.3,
              }}
              onPress={() => {
                if (route?.params?.module === "guide") {
                  happiGuideRescheduleHandler();
                } else {
                  rescheduleHandler();
                }
              }}
              disabled={!selectedTimeSlot}
            >
              <Text style={styles.bookButtonText}>Reschedule Booking</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                ...styles.bookButton,
                opacity: !selectedTimeSlot || !selectedDate ? 0.3 : 1,
              }}
              onPress={() => {
                try {
                  if (route?.params?.module === "guide") {
                    if (currentPlan.is_subscribed !== 2) {
                      happiGuidePaymentHandler();
                    } else {
                      // Avail HappiGuide for free
                      const planId = currentPlan?.mobile_plans[0]?.id;
                      if (!selectedDate)
                        return snackDispatch({
                          type: "SHOW_SNACK",
                          payload: "Click on date to select",
                        });
                      availHappiGuideHandler(planId);
                    }
                  } else {
                    route?.params?.bookingId
                      ? addAnotherSession(route?.params?.bookingId)
                      : setShowConcentModal(true);
                  }
                } catch (err) {
                  console.log("Some issue while booking session - ", err);
                }
              }}
              disabled={!selectedTimeSlot || !selectedDate}
            >
              <Text style={styles.bookButtonText}>
                {currentPlan.is_subscribed !== 2
                  ? "Confirm Booking"
                  : "Avail for free"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pageTitle: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  bottomContainer: {
    backgroundColor: "#fff",
    flex: 1,
    borderTopRightRadius: hp(4),
    borderTopLeftRadius: hp(4),
    paddingHorizontal: wp(8),
    paddingVertical: hp(4),
  },
  calendarHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 6,
  },
  calendarMonthTitle: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsMedium",
    color: "#000000",
  },
  calendarArrowGroup: {
    flexDirection: "row",
  },
  calendarArrow: {
    padding: 10,
  },
  calendarDayNames: {
    marginTop: 7,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  calendarDayName: {
    flex: 1,
    textAlign: "center",
    marginTop: 2,
    marginBottom: 7,
    fontSize: 13,
    color: "#b6c1cd",
  },
  calendarImage: {
    // backgroundColor: "red",
    width: wp(80),
    height: hp(32),
  },
  slotHeading: {
    fontSize: RFValue(13),
    fontFamily: "PoppinsMedium",
    color: "#191719",
    textAlign: "center",
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  timeGridChip: {
    width: "31%",
    backgroundColor: "#E9D5FF",
    borderRadius: hp(2),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(1.2),
    marginVertical: hp(0.8),
  },
  timeGridChipText: {
    fontSize: RFValue(8),
    fontFamily: "PoppinsMedium",
  },
  pricingContainer: {
    backgroundColor: colors.background,
    width: wp(100),
    height: hp(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
  },
  bookButton: {
    backgroundColor: "#E6DFFF",
    paddingVertical: hp(1),
    paddingHorizontal: hp(2),
    borderRadius: hp(100),
    shadowColor: "#BDB5CE",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 4,
  },
  bookButtonText: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
    color: "#191719",
  },
  amountTitle: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
  },
  amountValue: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsSemiBold",
    color: "#000000",
  },
  amountButtonText: {
    fontSize: RFValue(10),
    fontFamily: "PoppinsMedium",
  },
  amountButton: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: hp(10),
    paddingHorizontal: hp(2),
    paddingVertical: hp(1),
  },
});

export default MakeBooking;
