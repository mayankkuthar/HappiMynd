import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import DropDown from "../input/DropDown";

const LanguageModal = (props) => {
  // Context Variables
  const { snackDispatch, getLanguages } = useContext(Hcontext);

  // Prop Destructuring
  const { navigation, showModal, setShowModal, fetchPsycologist } = props;

  //State varibales
  const [selectedLanguage, setSelectedLanguage] = useState({});
  const [languages, setLanguages] = useState([]);

  // Mounting
  useEffect(() => {
    fetchLanguages();
  }, []);

  // Fetching Languages
  const fetchLanguages = async () => {
    try {
      const languageList = await getLanguages();
      console.log("The fetched languages - ", languageList);
      if (languageList.status === "success")
        setLanguages(
          languageList.data.filter(
            (language) =>
              language.name === "english" || language.name === "hindi"
          )
        );
    } catch (err) {
      console.log("Some issue while fetching languages - ", err);
    }
  };

  const submitHandler = async () => {
    try {
      if (selectedLanguage.name) {
        fetchPsycologist(selectedLanguage.name);
        setShowModal(false);
        // navigation.push("HappiBUDDYChat");
      }
    } catch (err) {
      console.log("Some issue while submitting language - ", err);
    }
  };

  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => {
        setShowModal(false);
      }}
    >
      <View style={styles.container}>
        <Text style={styles.modalText}>Select a language to continue</Text>

        <DropDown
          placeHolder="Select language"
          data={languages}
          setSelectedData={setSelectedLanguage}
        />

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <TouchableOpacity style={styles.modalButton} onPress={submitHandler}>
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

export default LanguageModal;
