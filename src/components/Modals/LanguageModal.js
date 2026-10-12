import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";

// Context
import { Hcontext } from "../../context/Hcontext";

// Components
import DropDown from "../input/DropDown";

const LanguageModal = (props) => {
  // Context Variables
  const { getLanguages } = useContext(Hcontext);

  // Prop Destructuring
  const { showModal, setShowModal, fetchPsycologist } = props;

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
        <Text style={styles.modalText}>Select A Language to Continue</Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <DropDown
          placeHolder="English"
          data={languages}
          setSelectedData={setSelectedLanguage}
          containerStyle={styles.dropdownButton}
          containerTextStyle={styles.dropdownButtonText}
          dropDownContainerStyle={styles.dropdownList}
          iconColor="#45424D"
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
    backgroundColor: "#F3EFFF",
    width: wp(80),
    alignSelf: "center",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2),
    paddingHorizontal: hp(2),
  },
  modalText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#111111",
    textAlign: "left",
    alignSelf: "stretch",
  },
  dropdownButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D5D5D5",
  },
  dropdownButtonText: {
    color: "#111111",
  },
  dropdownList: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D5D5D5",
  },
  modalButton: {
    backgroundColor: "#E6DEFF",
    paddingVertical: hp(1.5),
    width: "100%",
    borderRadius: hp(100),
  },
  modalButtonText: {
    textAlign: "center",
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: "#17141E",
  },
});

export default LanguageModal;
