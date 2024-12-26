import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
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

const AudioCard = ({ user }) => {
  // State Variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const getAudioFile = (file) => {
    const storage = getStorage();
    setAudioLoading(true);
    getDownloadURL(ref(storage, file))
      .then(async (url) => {
        console.log("check the dowanloadable file - ", url);

        const { sound } = await Audio.Sound.createAsync({ uri: url });

        setIsPlaying(true);
        setAudioLoading(false);
        // Playing the sound
        const { durationMillis } = await sound.playAsync();

        // Stop playing state after audio completes
        setTimeout(() => setIsPlaying(false), durationMillis);
      })
      .catch((error) => {
        console.log("Some issue while getting audio file - ", error);
        setAudioLoading(false);
      });
  };

  return (
    <View style={styles.bubbleContainer}>
      {audioLoading ? (
        <ActivityIndicator color={colors.loaderColor} />
      ) : (
        <TouchableOpacity
          style={{
            ...styles.chatDownloadButton,
            paddingHorizontal: hp(1.2),
          }}
          onPress={() => getAudioFile(user.fileName)}
        >
          <FontAwesome
            name={isPlaying ? "stop" : "play"}
            size={hp(1)}
            color="black"
          />
        </TouchableOpacity>
      )}

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

export default AudioCard;

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
