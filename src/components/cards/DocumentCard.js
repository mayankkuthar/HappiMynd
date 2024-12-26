import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Ionicons, AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { Audio } from "expo-av";

// Constants
import { colors } from "../../assets/constants";

const DocumentCard = ({ user }) => {
  const getDocumentFile = (file) => {
    const storage = getStorage();
    getDownloadURL(ref(storage, file))
      .then((url) => {
        console.log("check the dowanloadable file - ", url);
        Linking.openURL(url);
      })
      .catch((error) => {
        console.log("Some issue while getting document file - ", error);
      });
  };

  return (
    <View style={styles.bubbleContainer}>
      <TouchableOpacity
        style={styles.chatDownloadButton}
        onPress={() => getDocumentFile(user.fileName)}
      >
        <AntDesign name="arrowdown" size={hp(1.5)} color="black" />
      </TouchableOpacity>

      {/* SIzed Box */}
      <View style={{ width: wp(4) }} />

      <Text style={styles.bubbleText}>
        {user.fileName.length > 20
          ? `${user.fileName.substring(0, 20)} .....`
          : user.fileName}
      </Text>
    </View>
  );
};

export default DocumentCard;

const styles = StyleSheet.create({
  bubbleContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: hp(2),
    paddingVertical: hp(2),
    borderRadius: hp(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1),
  },
  bubbleText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
  chatDownloadButton: {
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: hp(100),
    paddingHorizontal: hp(1),
    paddingVertical: hp(1),
  },
});
