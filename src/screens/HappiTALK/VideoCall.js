import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Linking,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

const VideoCall = (props) => {
  const { navigation, route } = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { joinRoom, joinRoomGuide, snackDispatch } = useContext(Hcontext);

  useEffect(() => {
    getRoomAccess(route.params.sessionId);

    return () => {};
  }, []);

  const getRoomAccess = async (sessionId) => {
    try {
      let response;
      if (route.params.module === "guide") {
        response = await joinRoomGuide({ sessionId });
      } else {
        response = await joinRoom({ sessionId });
      }

      if (response.meet_link) {
        await Linking.openURL(response.meet_link);
        navigation.pop();
      } else if (response.status === "error") {
        setError(response.message || "Unable to join the call.");
        snackDispatch({
          type: "SHOW_SNACK",
          payload: response.message || "Unable to join the call.",
        });
        setLoading(false);
      } else {
        setError("Meeting link not available.");
        snackDispatch({
          type: "SHOW_SNACK",
          payload: "Meeting link not available.",
        });
        setLoading(false);
      }
    } catch (err) {
      console.log("Error joining call (VideoCall.js) - ", err);
      setError("Something went wrong. Please try again.");
      snackDispatch({
        type: "SHOW_SNACK",
        payload: "Something went wrong. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.loaderColor} />
          <Text style={styles.loadingText}>Joining call...</Text>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

export default VideoCall;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: RFValue(16),
    fontFamily: "PoppinsMedium",
    color: colors.borderLight,
    marginTop: hp(2),
  },
  errorText: {
    fontSize: RFValue(16),
    fontFamily: "PoppinsMedium",
    color: colors.borderLight,
    width: wp(70),
    textAlign: "center",
  },
});
