import React, { useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";

// Components
import Button from "../buttons/Button";
import DropDown from "../input/DropDown";
import TextArea from "../input/TextArea";

const queryOptions = [
  { id: 1, name: "Screening", value: "screening" },
  { id: 2, name: "Payment", value: "payment" },
  { id: 3, name: "Service", value: "service" },
  { id: 4, name: "Others", value: "others" },
];

const QueryModal = (props) => {
  // Prop Destructuring
  const {
    navigation,
    showModal,
    setShowModal,
    pressHandler = () => {},
    loading = false,
  } = props;

  // STate Variables
  const [selectedCategory, setSelectedCategory] = useState({});
  const [description, setDescription] = useState("");
  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => setShowModal(false)}
    >
      <View style={styles.container}>
        <Text style={styles.title}>User Query</Text>

        <DropDown
          title="Query category"
          placeHolder="Select Category"
          data={queryOptions}
          setSelectedData={setSelectedCategory}
          labelStyle={styles.label}
          containerStyle={styles.inputContainer}
          containerTextStyle={styles.inputText}
          dropDownContainerStyle={styles.dropDownList}
        />

        {/* Sized Box */}
        <View style={{ height: hp(1.5) }} />

        <TextArea
          title="Query Description"
          placeHolder="Enter Your Query In Detail"
          value={description}
          onChangeText={(text) => setDescription(text)}
          labelStyle={styles.label}
          textAreaStyle={styles.inputTextArea}
          placeholderColor="#A3A3A3"
        />

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <Button
          text="Submit"
          pressHandler={() =>
            pressHandler(selectedCategory.value, description)
          }
          loading={loading}
          containerStyle={styles.submitButton}
          textStyle={styles.submitText}
        />
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3EFFD",
    width: wp(92),
    alignSelf: "center",
    borderRadius: hp(3.5),
    paddingVertical: hp(3),
    paddingHorizontal: wp(6),
  },
  title: {
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(16),
    color: "#9747FF",
    marginBottom: hp(2),
    textAlign: "center",
    alignSelf: "center",
  },
  label: {
    color: "#666666",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D4D4D4",
    borderRadius: 8,
    borderWidth: 1,
    width: "100%",
    height: hp(5.5),
    justifyContent: "center",
    overflow: "hidden",
  },
  inputText: {
    color: "#222222",
  },
  dropDownList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  inputTextArea: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D4D4D4",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    minHeight: hp(12),
  },
  submitButton: {
    backgroundColor: "#E6DEFF",
    borderRadius: hp(3),
    width: wp(80),
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: {
    color: "#222222",
    fontFamily: "PoppinsSemiBold",
  },
});

export default QueryModal;
