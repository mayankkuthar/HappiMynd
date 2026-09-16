import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";

const QueryRaisedModal = (props) => {
  // Prop Destructuring
  const { showModal, setShowModal } = props;

  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => setShowModal(false)}
    >
      <View style={styles.panel}>
        <Image
          style={styles.illustration}
          source={require("../../assets/images/Query_raised.png")}
          resizeMode="contain"
        />

        <Text style={styles.message}>Query has been raised successfully.</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowModal(false)}
          style={styles.dismissButton}
        >
          <Text style={styles.dismissText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#F2EFFE",
    marginHorizontal: 2,
    borderRadius: hp(4),
    paddingHorizontal: wp(7),
    paddingTop: hp(3),
    paddingBottom: hp(3.5),
  },
  illustration: {
    width: wp(70),
    aspectRatio: 1.9,
    alignSelf: "center",
    overflow: "hidden",
  },
  message: {
    fontFamily: "Poppins",
    fontSize: RFValue(14),
    color: "#171717",
    textAlign: "center",
    marginTop: hp(3),
  },
  dismissButton: {
    backgroundColor: "#E6DEFF",
    height: hp(4.7),
    borderRadius: hp(2.3),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(4),
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  dismissText: {
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(13),
    color: "#222222",
  },
});

export default QueryRaisedModal;