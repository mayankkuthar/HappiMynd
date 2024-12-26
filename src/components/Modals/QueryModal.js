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
        {/* Sized Box */}
        <View style={{ height: hp(1) }} />

        <Text style={styles.title}>USER QUERY</Text>

        {/* Sized Box */}
        <View style={{ height: hp(1) }} />

        <DropDown
          title="Query category"
          placeHolder="Select Category"
          data={queryOptions}
          setSelectedData={setSelectedCategory}
        />

        {/* Sized Box */}
        <View style={{ height: hp(1) }} />

        <TextArea
          title="Query Description"
          placeHolder="Enter your query in detail"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <View style={{ width: wp(80) }}>
          <Button
            text="Submit"
            pressHandler={() =>
              pressHandler(selectedCategory.value, description)
            }
            loading={loading}
          />
        </View>
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
  title: {
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(16),
    color: colors.primaryText,
  },
});

export default QueryModal;
