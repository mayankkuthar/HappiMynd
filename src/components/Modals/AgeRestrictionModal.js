import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";

const AgeRestrictionModal = (props) => {
  // Prop Destructuring
  const { showModal, setShowModal } = props;
  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => setShowModal(false)}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/exit_modal_hero.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />

        {/* Sized Box */}
        <View style={{ height: hp(1) }} />

        <Text style={styles.modalText}>
          This app is restricted for age 12 & below.
        </Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.closeButton}
          onPress={() => setShowModal(false)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F2EFFE",
    width: wp(80),
    alignSelf: "center",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2),
    paddingHorizontal: hp(2),
  },
  heroImage: {
    width: wp(50),
    height: hp(20),
  },
  modalText: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    color: "#191928",
    textAlign: "center",
  },
  closeButton: {
    width: "100%",
    height: hp(5),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    backgroundColor: "#E6DFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 4,
  },
  closeButtonText: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsMedium",
    color: "#000",
    letterSpacing: 1,
  },
});

export default AgeRestrictionModal;
