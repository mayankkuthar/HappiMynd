import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Touchable,
} from "react-native";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";

const ReportGenConfirmModal = (props) => {
  // Prop Destructuring
  const {
    navigation,
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

        <Text style={styles.modalText}>
          Your report has been generated, please continue to view.
        </Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => {
            setShowModal(false);
          }}
        >
          <Text style={styles.modalButtonText}>Continue</Text>
        </TouchableOpacity>
        {/* Sized Box */}
        <View style={{ height: hp(1) }} />
        <TouchableOpacity
          style={styles.outlineModalButton}
          onPress={() => {
            setShowModal(false);
          }}
        >
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundModal,
    width: wp(90),
    // height: hp(20),
    alignSelf: "center",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2),
    paddingHorizontal: hp(2),
  },
  heroImage: {
    // backgroundColor: "red",
    width: wp(50),
    height: hp(20),
  },
  modalText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    textAlign: "justify",
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingVertical: hp(1.5),
    width: "100%",
    borderRadius: hp(100),
  },
  outlineModalButton: {
    // backgroundColor: colors.primary,
    paddingVertical: hp(1.5),
    width: "100%",
    borderRadius: hp(100),
    borderWidth: hp(0.2),
    borderColor: colors.primary,
  },
  modalButtonText: {
    textAlign: "center",
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
  hyperlinkText: {
    color: colors.pageTitle,
    textDecorationLine: "underline",
  },
});

export default ReportGenConfirmModal;
