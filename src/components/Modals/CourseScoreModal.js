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

const CourseScoreModal = (props) => {
  // Prop Destructuring
  const {
    navigation,
    showModal = false,
    setShowModal = () => {},
    points = 0,
  } = props;
  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => setShowModal(false)}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/party.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />

        {/* Sized Box */}
        <View style={{ height: hp(1) }} />

        <View style={styles.pointBox}>
          <Text style={styles.modalText}>Points earned </Text>
          <Text style={styles.score}>{points}</Text>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => {
            setShowModal(false);
          }}
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
    color: colors.primaryText,
    paddingRight: wp(2),
  },
  pointBox: {
    backgroundColor: colors.primary,
    paddingHorizontal: hp(3),
    paddingVertical: hp(0.5),
    borderRadius: hp(1),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  score: {
    fontSize: RFValue(22),
    fontWeight: "bold",
    fontFamily: "Poppins",
    textAlign: "justify",
    color: colors.primaryText,
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

export default CourseScoreModal;
