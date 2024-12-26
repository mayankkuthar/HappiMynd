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

// Constants
import { colors } from "../../assets/constants";

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

        <TouchableOpacity style={styles.modalButton} onPress={logoutHandler}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.loaderColor} />
          ) : (
            <Text style={styles.modalButtonText}>Yes</Text>
          )}
        </TouchableOpacity>
        {/* Sized Box */}
        <View style={{ height: hp(1.2) }} />
        <TouchableOpacity
          style={{
            ...styles.modalButton,
            backgroundColor: colors.backgroundModal,
            borderWidth: 1,
            borderColor: colors.pageTitle,
          }}
          onPress={() => {
            setShowModal(false);
          }}
        >
          <Text style={{ ...styles.modalButtonText, color: colors.pageTitle }}>
            No
          </Text>
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

export default LogoutModal;
