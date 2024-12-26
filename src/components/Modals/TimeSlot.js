import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";

const timeSlotList = [
  // { id: 1, time: "12:00 AM - 12:30 AM" },
  // { id: 2, time: "12:30 AM - 1:00 AM" },
  // { id: 3, time: "1:00 AM - 1:30 AM" },
  // { id: 4, time: "1:30 AM - 2:00 AM" },
  // { id: 5, time: "2:00 AM - 2:30 AM" },
  // { id: 6, time: "2:30 AM - 3:00 AM" },
  // { id: 7, time: "3:00 AM - 3:30 AM" },
  // { id: 8, time: "3:30 AM - 4:00 AM" },
  // { id: 9, time: "4:00 AM - 4:30 AM" },
  // { id: 10, time: "4:30 AM - 5:00 AM" },
  // { id: 11, time: "5:00 AM - 5:30 AM" },
  // { id: 12, time: "5:30 AM - 6:00 AM" },
  // { id: 13, time: "6:00 AM - 6:30 AM" },
  // { id: 14, time: "6:30 AM - 7:00 AM" },
  // { id: 15, time: "7:00 AM - 7:30 AM" },
  // { id: 16, time: "7:30 AM - 8:00 AM" },
  // { id: 17, time: "8:00 AM - 8:30 AM" },
  // { id: 18, time: "8:30 AM - 9:00 AM" },
  // { id: 19, time: "9:00 AM - 9:30 AM" },
  { id: 20, time: "9:30 AM - 10:00 AM" },
  { id: 21, time: "10:00 AM - 10:30 AM" },
  { id: 22, time: "10:30 AM - 11:00 AM" },
  { id: 23, time: "11:00 AM - 11:30 AM" },
  { id: 24, time: "11:30 AM - 12:00 PM" },
  { id: 25, time: "12:00 PM - 12:30 PM" },
  { id: 26, time: "12:30 PM - 1:00 PM" },
  { id: 27, time: "1:00 PM - 1:30 PM" },
  { id: 28, time: "1:30 PM - 2:00 PM" },
  { id: 29, time: "2:00 PM - 2:30 PM" },
  { id: 30, time: "2:30 PM - 3:00 PM" },
  { id: 31, time: "3:00 PM - 3:30 PM" },
  { id: 32, time: "3:30 PM - 4:00 PM" },
  { id: 33, time: "4:00 PM - 4:30 PM" },
  { id: 34, time: "4:30 PM - 5:00 PM" },
  { id: 35, time: "5:00 PM - 5:30 PM" },
  { id: 36, time: "5:30 PM - 6:00 PM" },
  { id: 37, time: "6:00 PM - 6:30 PM" },
  { id: 38, time: "6:30 PM - 7:00 PM" },
  { id: 39, time: "7:00 PM - 7:30 PM" },
  // { id: 40, time: "7:30 PM - 8:00 PM" },
  // { id: 41, time: "8:00 PM - 8:30 PM" },
  // { id: 42, time: "8:30 PM - 9:00 PM" },
  // { id: 43, time: "9:00 PM - 9:30 PM" },
  // { id: 44, time: "9:30 PM - 10:00 PM" },
  // { id: 45, time: "10:00 PM - 10:30 PM" },
  // { id: 46, time: "10:30 PM - 11:00 PM" },
  // { id: 47, time: "11:00 PM - 11:30 PM" },
  // { id: 48, time: "11:30 PM - 12:00 AM" },
];

const TimeSlot = (props) => {
  // Prop Destructuring
  const {
    navigation,
    showModal,
    setShowModal,
    pressHandler = () => {},
    loading = false,
  } = props;

  // State Variables
  const [selectedSlot, setSelectedSlot] = useState("");

  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => setShowModal(false)}
    >
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Text style={styles.modalTextTitle}>Add Time Slot</Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          {/* Time Input Fields */}
          <View style={styles.timeSection}>
            {timeSlotList.map((data) => (
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  ...styles.timeContainer,
                  borderColor:
                    selectedSlot.id === data?.id
                      ? colors.primaryText
                      : colors.borderDim,
                }}
                onPress={() => setSelectedSlot(data)}
              >
                <Text style={styles.timeText}>{data?.time}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              style={{
                ...styles.modalButton,
                backgroundColor: colors.backgroundModal,
                borderWidth: 1,
                borderColor: colors.pageTitle,
              }}
              onPress={() => setShowModal(false)}
            >
              <Text
                style={{ ...styles.modalButtonText, color: colors.pageTitle }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            {/* Sized Box */}
            <View style={{ width: hp(2) }} />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => pressHandler(selectedSlot.time)}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.loaderColor} />
              ) : (
                <Text style={styles.modalButtonText}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundModal,
    height: hp(80),
    width: wp(80),
    // height: hp(20),
    alignSelf: "center",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2),
    paddingHorizontal: hp(2),
  },
  modalTextTitle: {
    fontSize: RFValue(16),
    fontFamily: "PoppinsMedium",
    textAlign: "center",
  },
  timeSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-around",
  },
  timeContainer: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: hp(100),
    padding: hp(1),
    flexDirection: "row",
    marginVertical: hp(0.5),
  },
  timeText: {
    fontFamily: "Poppins",
    fontSize: RFValue(10),
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingVertical: hp(1.5),
    width: wp(32),
    borderRadius: hp(100),
  },
  modalButtonText: {
    textAlign: "center",
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
});

export default TimeSlot;
