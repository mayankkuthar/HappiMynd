import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Context
import { Hcontext } from "../../context/Hcontext";

const LogoutModal = (props) => {
  // Prop Destructuring
  const { navigation, showModal, setShowModal } = props;

  // Context Variables
  const { authState, authDispatch, userLogout } = useContext(Hcontext);
  const { botVisible, setBotVisible, botAssessmetDone, gotoVideo, setGotoVideo, gotoAssessment, setGotoAssessment } = useContext(Hcontext)

  // State Varaibels
  const [loading, setLoading] = useState(false);

  const logoutHandler = async () => {
    setLoading(true);
    try {
      console.log("check teh aauth state - ", authState.user.access_token);
      const userRes = await userLogout({ token: authState.user.access_token });
      // if (userRes) {
      setShowModal(false);
      await AsyncStorage.removeItem("USER");
      await AsyncStorage.removeItem("chatBotMessages");
      setGotoVideo(false)
      setGotoAssessment(false)
      authDispatch({ type: "LOGOUT" });
      // }
    } catch (err) {
      console.log("Some issue while LogOut (LogoutModal.js) - ", err);
    }
    setLoading(false);
  };

  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => setShowModal(false)}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/logout_hero.png")}
          style={styles.heroImage}
          resizeMode="contain"
        />

        {/* Sized Box */}
        <View style={{ height: hp(1) }} />

        <Text style={styles.modalText}>Are you sure you want to logout?</Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.modalButton, styles.noButton]}
            onPress={() => {
              setShowModal(false);
            }}
          >
            <Text style={[styles.modalButtonText, styles.noButtonText]}>
              No
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.yesButton]}
            onPress={logoutHandler}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#A0A0A0" />
            ) : (
              <Text style={[styles.modalButtonText, styles.yesButtonText]}>
                Yes
              </Text>
            )}
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

export default LogoutModal;
