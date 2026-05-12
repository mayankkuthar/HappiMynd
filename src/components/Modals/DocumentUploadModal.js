import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

// Constants
import { colors } from "../../assets/constants";

const DocumentUploadModal = (props) => {
  const {
    showModal = false,
    setShowModal = () => {},
    setFileName,
    setFileType,
    setFilePath,
    setCustomText,
  } = props;

  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      setUploading(true);

      // Pick any image file from the device
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });

      if (result.type === "cancel") {
        setUploading(false);
        return;
      }

      const { uri, name, mimeType } = result;
      const mime = mimeType || "image/jpeg";

      // Read as base64 — matches web version base64 approach
      // expo-document-picker for images typically returns small-enough files
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setFileName(name || uri.split("/").pop());
      setFileType("image");
      setFilePath({ uri, base64, mimeType: mime });
      setCustomText("📷 Image");
      setShowModal(false);
    } catch (err) {
      console.log("Image pick error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      testID="DocumentUploadModal"
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => setShowModal(false)}
      onSwipeComplete={() => setShowModal(false)}
      swipeDirection={["down"]}
      style={styles.modalContainer}
    >
      <View style={styles.container}>
        {uploading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={colors.primary || "#4CA6A8"} />
            <Text style={styles.loaderText}>Processing…</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={pickImage}
              style={[styles.actionContainer, styles.borderBottom]}
            >
              <Text style={styles.actionText}>🖼️  Choose Image</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowModal(false)}
              style={styles.actionContainer}
            >
              <Text style={[styles.actionText, { color: "red" }]}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
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
    width: wp(100),
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: hp(1),
  },
  borderBottom: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#EFEFEF",
  },
  actionContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2),
  },
  actionText: {
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(13),
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(3),
  },
  loaderText: {
    fontFamily: "Poppins",
    fontSize: RFValue(11),
    color: "#888",
    marginTop: 8,
  },
});

export default DocumentUploadModal;
