import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const ExitScreeningModal = (props) => {
  // Prop Destructuring
  const { navigation, showModal, setShowModal } = props;
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
          It is suggested that you complete your screening questions for better
          results!
        </Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.modalButton, styles.noButton]}
            onPress={() => {
              setShowModal(false);
              // navigation.navigate("HomeScreen");
            }}
          >
            <Text style={[styles.modalButtonText, styles.noButtonText]}>
              Continue
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.yesButton]}
            onPress={() => {
              setShowModal(false);
              navigation.navigate("HomeScreen");
            }}
          >
            <Text style={[styles.modalButtonText, styles.yesButtonText]}>
              Save and Exit
            </Text>
          </TouchableOpacity>
        </View>
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
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    paddingVertical: hp(1.5),
    width: "48%",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  yesButton: {
    backgroundColor: "#EEDFFF",
  },
  yesButtonText: {
    color: "#A0A0A0",
  },
  noButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A5A5A5",
    shadowColor: "rgba(0,0,0,0.16)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  noButtonText: {
    color: "#000",
  },
  modalButtonText: {
    textAlign: "center",
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
});

export default ExitScreeningModal;
