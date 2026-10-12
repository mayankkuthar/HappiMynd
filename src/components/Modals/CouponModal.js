import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";

const CouponModal = (props) => {
  // Prop Destructuring
  const {
    navigation,
    showModal,
    setShowModal,
    handleSubmit = () => {},
    value,
    setValue,
    isCouponApplied = false,
  } = props;
  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => setShowModal(false)}
    >
      <View style={styles.mainPanel}>
        <Image
          source={require("../../assets/images/coupon_hero.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            placeholder="Enter Coupon Code"
            placeholderTextColor="#A3A3A3"
            value={value}
            onChangeText={(text) => setValue(text)}
            autoCapitalize="none"
          />
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            disabled={isCouponApplied}
            style={{
              ...styles.modalButton,
              opacity: isCouponApplied ? 0.3 : 1,
              backgroundColor: "#EAD5FF",
            }}
            onPress={handleSubmit}
          >
            <Text style={styles.modalButtonText}>Apply</Text>
          </TouchableOpacity>

          {/* Sized Box */}
          <View style={{ width: wp(3) }} />

          <TouchableOpacity
            style={{ ...styles.modalButton, ...styles.cancelButton }}
            onPress={() => {
              setShowModal(false);
            }}
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  mainPanel: {
    backgroundColor: "#F3F0FF",
    borderRadius: 20,
    paddingHorizontal: wp(4),
    paddingVertical: hp(5),
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  heroImage: {
    width: wp(50),
    height: hp(20),
  },
  inputBox: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderColor: "#D6D6D6",
    borderWidth: 2,
    borderRadius: 20,
    height: hp(6),
    justifyContent: "center",
    paddingHorizontal: wp(4),
  },
  input: {
    fontSize: RFValue(13),
    color: "#111111",
    fontFamily: "Poppins",
  },
  modalButton: {
    backgroundColor: "#EAD5FF",
    paddingVertical: hp(1.5),
    flex: 1,
    borderRadius: hp(50),
  },
  buttonRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F0FF",
    borderColor: "#111111",
    borderWidth: 2,
  },
  modalButtonText: {
    textAlign: "center",
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#111111",
  },
});

export default CouponModal;