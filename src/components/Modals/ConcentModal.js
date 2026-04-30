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

const ConcentModal = (props) => {
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
        <Image
          source={require("../../assets/images/concent_hero.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <Text style={styles.modalTextTitle}>
          Would you like to give consent for the session to be recorded by our
          psychologist, as part of the therapy process?
        </Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <View style={styles.pointsContainer}>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.pointBullet} />
            <Text style={styles.pointsText}>
              It is a safe space with an experienced therapist where you can
              discuss life, ambitions or anything under the roof.
            </Text>
          </View>
          {/* Sized Box */}
          <View style={{ height: hp(1) }} />
          <View style={{ flexDirection: "row" }}>
            <View style={styles.pointBullet} />
            <Text style={styles.pointsText}>
              It is a cost effective and competent tool to address your mental
              wellness needs through digital mediums
            </Text>
          </View>
        </View>

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
            // onPress={() => setShowModal(false)}
            onPress={() => pressHandler(false)}
          >
            <Text
              style={{ ...styles.modalButtonText, color: colors.pageTitle }}
            >
              No
            </Text>
          </TouchableOpacity>
          {/* Sized Box */}
          <View style={{ width: hp(2) }} />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => pressHandler(true)}
          >
            <Text style={styles.modalButtonText}>Yes</Text>
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
  heroImage: {
    // backgroundColor: "red",
    width: wp(50),
    height: hp(20),
  },
  modalTextTitle: {
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
  pointsContainer: {
    backgroundColor: "#E3FDFE",
    width: "100%",
    paddingVertical: hp(1),
    paddingHorizontal: hp(1),
    borderRadius: 6,
  },
  pointBullet: {
    backgroundColor: "#358287",
    width: hp(0.8),
    height: hp(0.8),
    borderRadius: hp(100),
    marginTop: hp(0.5),
    marginRight: hp(0.5),
  },
  pointsText: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
  },
});

export default ConcentModal;
