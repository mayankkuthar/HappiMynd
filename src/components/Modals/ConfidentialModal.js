import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";

const ConfidentialModal = (props) => {
  // ─── Props ──────────────────────────────────────────────────────────────────
  const {
    navigation,
    showModal,
    setShowModal,
    setShowLanguageModal,
    pressHandler = () => {},
    receiverPsy = "",
    image = require("../../assets/images/happiBUDDY_girl.png"),
  } = props;

  // ─── Ref to always track the LATEST receiverPsy value ───────────────────────
  // Without this, the useEffect cleanup below would close over the
  // mount-time snapshot of receiverPsy (stale closure). If the parent
  // sets receiverPsy *after* this modal mounts (e.g. checkCurrentPsycologist
  // resolves while the modal is already open), the old empty-string value
  // would be read in the cleanup and setShowLanguageModal(true) would fire
  // incorrectly — opening the language picker even though a buddy is already
  // assigned.
  const receiverPsyRef = useRef(receiverPsy);

  // Keep the ref in sync on every render so the cleanup always reads fresh.
  receiverPsyRef.current = receiverPsy;

  // ─── Show language modal when this modal unmounts without a buddy ────────────
  useEffect(() => {
    return () => {
      // Use the ref so we always check the latest value, not the stale
      // mount-time snapshot that a plain closure would give us.
      if (!receiverPsyRef.current) {
        setShowLanguageModal(true);
      }
    };
  }, []); // intentionally empty — we only want this to run on unmount

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => setShowModal(false)}
    >
      <View style={styles.container}>
        <Image source={image} style={styles.heroImage} resizeMode="contain" />

        {/* Sized Box */}
        <View style={{ height: hp(1) }} />

        <Text style={styles.modalText}>
          All your information will be kept confidential and will not be shared
          with anyone.
        </Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <TouchableOpacity
          style={styles.modalButton}
          onPress={pressHandler}
          activeOpacity={0.8}
        >
          <Text style={styles.modalButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundModal,
    width: wp(80),
    alignSelf: "center",
    borderRadius: 6,
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
  modalButton: {
    backgroundColor: colors.primary,
    paddingVertical: hp(1.5),
    width: "100%",
    borderRadius: hp(100),
  },
  modalButtonText: {
    textAlign: "center",
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
});

export default ConfidentialModal;
