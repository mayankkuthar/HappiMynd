import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const ReportGenConfirmModal = (props) => {
  // Prop Destructuring
  const {
    showModal = false,
    setShowModal = () => {},
    pressHandler = () => {},
  } = props;

  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => setShowModal(false)}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/report_mod.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />

        {/* Sized Box */}
        <View style={{ height: hp(1) }} />

        <Text style={styles.modalText} numberOfLines={2}>
          Your report has been generated, please continue to view.
        </Text>

        {/* Sized Box */}
        <View style={{ height: hp(3) }} />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => {
              setShowModal(false);
            }}
          >
            <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.confirmButton]}
            onPress={() => {
              setShowModal(false);
              pressHandler();
            }}
          >
            <Text style={[styles.modalButtonText, styles.confirmButtonText]}>
              Yes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F1EFFF",
    width: wp(86),
    alignSelf: "center",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(3),
    paddingHorizontal: hp(2),
  },
  heroImage: {
    width: wp(50),
    height: hp(20),
  },
  modalText: {
    color: "#191919",
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    fontWeight: "400",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalButton: {
    paddingVertical: hp(1.5),
    width: wp(33),
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#F1EFFF",
    borderWidth: 2,
    borderColor: "#A34BFF",
    marginRight: wp(8),
  },
  cancelButtonText: {
    color: "#191919",
  },
  confirmButton: {
    backgroundColor: "#EAD5FF",
    borderWidth: 0,
  },
  confirmButtonText: {
    color: "#191919",
  },
  modalButtonText: {
    textAlign: "center",
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
});

export default ReportGenConfirmModal;