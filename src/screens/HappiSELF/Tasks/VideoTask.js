import React, { useState, useEffect, useContext, useCallback } from "react";
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
import { Video, AVPlaybackStatus } from "expo-av";
// import Video from "react-native-video";
import { useFocusEffect } from "@react-navigation/native";
import { WebView } from "react-native-webview";

// Components
import TaskScreenHeader from "./TaskScreenHeader";

// Context
import { Hcontext } from "../../../context/Hcontext";
import { colors } from "../../../assets/constants";

const VideoTask = (props) => {
  // Prop Destructuring
  const {
    question,
    completeTask = () => {},
    setIsCorrectOption = () => {},
    navigation,
  } = props;
  const { content, option, title, description } = props.question;

  // Context Variables
  const { happiSelfState } = useContext(Hcontext);

  // State variables
  const [loading, setLoading] = useState(true);
  const [buffering, setBuffering] = useState(false);

  // // Mounting
  // useEffect(() => {
  //   console.log("Mounted Video Task Screen - ", props.question);

  //   return () => {
  //     setIsCorrectOption(false);
  //   };
  // }, []);

  // Hits when focus hits
  useFocusEffect(
    useCallback(() => {
      console.log("Mounted Video Task Screen - ", props.question);

      return () => {
        setIsCorrectOption(false);
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Screen Header */}
      <TaskScreenHeader
        title="Interactive Video"
        subTitle="Please complete this activity to move to next activity"
        navigation={navigation}
      />

      {/* Sized Box */}
      <View style={{ height: hp(4) }} />

      {/* Question Box */}
      <View style={styles.questionContainer}>
        {/* <Text style={styles.questionText}>{content}</Text> */}
        {loading || buffering ? (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color={colors.loaderColor} />
          </View>
        ) : null}
        {/* <Video
          source={{ uri: content }} // Can be a URL or a local file.
          onBuffer={() => {}} // Callback when remote video is buffering
          onError={() => {}} // Callback when video cannot be loaded
          style={styles.video}
        /> */}
        {/* <WebView source={{ uri: content }} style={styles.video} /> */}
        <Video
          // ref={video}
          style={{ ...styles.video, opacity: buffering ? 0.3 : 1 }}
          source={{
            uri: content,
          }}
          useNativeControls
          resizeMode="contain"
          // isLooping
          shouldPlay={true}
          playsInSilentLockedModeIOS={true}
          // onLoad={() => console.log("loading is ended !")}
          // onLoadStart={() => console.log("loading is started !")}
          onPlaybackStatusUpdate={(status) => {
            console.log("chekc the playback status - ", status);
            if (status.isLoaded) {
              setLoading(false);
            } else {
              setLoading(true);
            }
            if (status.isBuffering) {
              setBuffering(true);
            } else {
              setBuffering(false);
            }
            if (status.didJustFinish) {
              if (!question.happiself_library_id) {
                completeTask(props.question.id);
                setIsCorrectOption(true);
              }
            }
          }}
        />

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <View>
          <Text style={styles.videoTitle}>{title}</Text>
          <Text style={styles.videoDescription}>{description}</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: hp(4),
  },
  questionContainer: {
    backgroundColor: "#F3FEFE",
    paddingHorizontal: hp(2),
    paddingVertical: hp(2),
    borderRadius: hp(2),
  },
  questionText: {
    fontSize: RFValue(16),
    fontFamily: "PoppinsMedium",
    textAlign: "justify",
  },
  video: {
    // width: wp(70),
    height: hp(26),
    borderRadius: hp(2),
  },
  videoTitle: {
    fontSize: RFValue(15),
    fontFamily: "PoppinsMedium",
    textAlign: "justify",
  },
  videoDescription: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    textAlign: "justify",
  },
  loader: {
    position: "relative",
    top: hp(14),
    zIndex: 10,
  },
});

export default VideoTask;
