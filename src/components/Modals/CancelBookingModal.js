import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Context
import { Hcontext } from "../../context/Hcontext";

// Constants
import { colors } from "../../assets/constants";

const CancelBookingModal = (props) => {
  // Prop Destructuring
  const {
    navigation,
    showModal,
    setShowModal,
    pressHandler = () => {},
    cancelReason,
    setCancelReason,
    loading,
    userType = "",
  } = props;

  // Context Variables
  const { getPenaltyClauseUser } = useContext(Hcontext);

  // State Variables
  const [clause, setClause] = useState("");

  console.log("CHeck teh cancel user tyep - ", userType);

  // Mounting
  useEffect(() => {
    fetchPanelty(userType);
  }, []);

  const fetchPanelty = async () => {
    try {
      const penalityRes = await getPenaltyClauseUser();
      console.log("check teh panelity res - ", penalityRes);

      if (penalityRes.status === "success") {
        let sentence = "";
        if (userType === "b2b") {
          sentence = `Since your booking cancellation is done prior ${penalityRes?.data?.for_b2b_user_for_one_credit} hours, the credit will be added to your HappiMynd account as per policy`;
        } else {
          sentence = `Since your booking cancellation is done prior ${penalityRes?.data?.for_b2c_user_for_one_credit} hours, the credit will be added to your HappiMynd account as per policy`;
        }
        setClause(sentence);
      }
    } catch (err) {
      console.log(
        "Some issue while fetching panelty (CancelBookingModal.js) - ",
        err
      );
    }
  };

  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => setShowModal(false)}
    >
      <View style={styles.container}>
        <Text style={styles.modalTextTitle}>
          Are you sure you want to cancel this booking ?
        </Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />
        <TextInput
          style={styles.textInput}
          onChangeText={(text) => setCancelReason(text)}
          value={cancelReason}
          placeholder="Cancel Reason"
        />
        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
              No
            </Text>
          </TouchableOpacity>
          {/* Sized Box */}
          <View style={{ width: hp(2) }} />
          <TouchableOpacity style={styles.modalButton} onPress={pressHandler}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.loaderColor} />
            ) : (
              <Text style={styles.modalButtonText}>Yes</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <Text style={styles.modalText}>{clause}</Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        {/* <Text style={{ ...styles.modalText, color: colors.pageTitle }}>
          View Penality Clause
        </Text> */}
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundModal,
    width: wp(80),
    // height: hp(20),
    alignSelf: "center",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2),
    paddingHorizontal: hp(2),
  },
  textInput: {
    // backgroundColor: colors.borderDim,
    fontSize: RFValue(12),
    width: "100%",
    paddingHorizontal: hp(1),
    paddingVertical: hp(1),
    borderRadius: hp(0.5),
    borderWidth: 1,
    borderColor: colors.borderDim,
  },
  modalTextTitle: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsMedium",
    textAlign: "center",
  },
  modalText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: colors.borderLight,
    textAlign: "center",
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

export default CancelBookingModal;
