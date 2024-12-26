import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";

const ConfidentialModal = (props) => {
  // Prop Destructuring
  const {
    navigation,
    showModal,
    setShowModal,
    setShowLanguageModal,
    pressHandler = () => {},
    receiverPsy = "",
    image = require("../../assets/images/happiBUDDY_girl.png"),
  } = props;

  // Mounting & unmounting
  useEffect(() => {
    return () => {
      if (!receiverPsy) setShowLanguageModal(true);
    };
  }, []);

  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => setShowModal(false)}
    >
      <View style={styles.container}>
        <Image
          // source={require("../../assets/images/confidential_hero.png")}
          source={image}
          style={styles.heroImage}
          resizeMode="contain"
        />

        {/* Sized Box */}
        <View style={{ height: hp(1) }} />

        <Text style={styles.modalText}>
          All your information will be kept confidential and will not be shared
          with anyone.
        </Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <TouchableOpacity style={styles.modalButton} onPress={pressHandler}>
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
