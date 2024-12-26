import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as DocumentPicker from "expo-document-picker";
import { getStorage, ref, uploadBytes } from "firebase/storage";

// Constants
import { colors } from "../../assets/constants";

const DocumentUploadModal = (props) => {
  // Prop Destructuring
  const {
    showModal = false,
    setShowModal = () => {},
    fielName,
    setFileName,
    setFileType,
    setFilePath,
    setCustomText,
  } = props;

  const documentHandler = async () => {
    try {
      // opening document picker
      const document = await DocumentPicker.getDocumentAsync();

      // // Creating a blob for the document
      // const response = await fetch(document.uri);
      // const blob = await response.blob();

      // Extracting file-name
      const fileName = document.uri.substring(
        document.uri.lastIndexOf("/") + 1
      );

      setFileName(fileName);
      setFileType("document");
      setFilePath(document);
      setCustomText(fileName);

      // // Firrebase Storage reference
      // const storage = getStorage();
      // const storageRef = ref(storage, fileName);

      // // Uploading the bytes to Firebase
      // uploadBytes(storageRef, blob).then((snapshot) => {
      //   console.log("Uploaded a blob or file!", snapshot);
      //   setShowModal(false);
      // });
    } catch (err) {
      console.log("Some issue while uploading doc - ", err);
    }
  };

  return (
    <Modal
      testID="DocumentUploadModal"
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => setShowModal(false)}
      onSwipeComplete={() => {}}
      swipeDirection={["up", "left", "right", "down"]}
      style={styles.modalContainer}
    >
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={documentHandler}
          style={{
            ...styles.actionContainer,
            borderBottomWidth: 1.5,
            borderBottomColor: colors.borderDim,
          }}
        >
          <Text style={styles.actionText}>Upload File</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowModal(false)}
          style={styles.actionContainer}
        >
          <Text style={{ ...styles.actionText, color: "red" }}>Cancel</Text>
        </TouchableOpacity>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    backgroundColor: "#fff",
    // height: hp(20),
    width: wp(100),
  },
  actionContainer: {
    // backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2),
  },
  actionText: {
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(13),
  },
});

export default DocumentUploadModal;
