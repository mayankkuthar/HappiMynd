import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";

const CourseLockModal = (props) => {
  // Prop Destructuring
  const {
    navigation,
    showModal,
    setShowModal,
    pressHandler = () => {},
  } = props;

  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => setShowModal(false)}
    >
      <View style={styles.container}>
        <Text style={styles.modalText}>
          Session unlocks as you progress through the programme. Please complete
          the previous module to continue
        </Text>

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
            onPress={pressHandler}
          >
            <Text
              style={{ ...styles.modalButtonText, color: colors.pageTitle }}
            >
              Go Back
            </Text>
          </TouchableOpacity>
          {/* Sized Box */}
          <View style={{ width: hp(2) }} />
          <TouchableOpacity style={styles.modalButton} onPress={pressHandler}>
            <Text style={styles.modalButtonText}>Resume</Text>
          </TouchableOpacity>
        </View>
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
  modalText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
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

export default CourseLockModal;
