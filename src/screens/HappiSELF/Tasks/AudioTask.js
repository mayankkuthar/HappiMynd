import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { FontAwesome } from "@expo/vector-icons";
import { Audio } from "expo-av";
import moment from "moment";
import CountDown from "react-native-countdown-component";
import { useKeepAwake } from "expo-keep-awake";

// Components
import TaskScreenHeader from "./TaskScreenHeader";

// Context
import { Hcontext } from "../../../context/Hcontext";
import { colors } from "../../../assets/constants";

const AudioTask = (props) => {
  // Prop Destructuring
  const {
    question = null,
    completeTask = () => {},
    setIsCorrectOption = () => {},
    navigation,
  } = props;

  // Context Variables
  const { happiSelfState } = useContext(Hcontext);

  // State variables
  const [minutes, setMinutes] = useState(null);
  const [seconds, setSeconds] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(false);

  // Hook to keep screen awake while playing audio
  useKeepAwake();

  // Mounting
  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
          setIsCorrectOption(false);
        }
      : undefined;
  }, [sound]);

  // Timer Updatoin
  useEffect(() => {
    if (isPlaying) {
      if (seconds <= 0) {
        setTimeout(() => setSeconds(59), 1000);
        if (minutes > 0) {
          setTimeout(() => setMinutes((prevState) => prevState - 1), 1000);
        }
      } else {
        setTimeout(() => setSeconds((prevState) => prevState - 1), 1000);
      }
    }
  }, [seconds]);

  // Function accepts millisecond value and converts to minutes & seconds
  const millisToMinutesAndSeconds = (millis) => {
    // const min = Math.floor(millis / 60000);
    // const sec = ((millis % 60000) / 1000).toFixed(0);
    const timeStam = moment.duration(millis);
    const min = timeStam.minutes();
    const sec = timeStam.seconds();
    console.log("conevert mikk i- to - ", min);
    console.log("conevert secc i- to - ", sec);
    setMinutes(min);
    setSeconds(sec);
  };

  const playSound = async () => {
    setLoading(true);
    const { content } = question;
    const { sound } = await Audio.Sound.createAsync({ uri: content });
    // await Audio.setAudioModeAsync({
    //   staysActiveInBackground: true,
    //   interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    //   playsInSilentModeIOS: true,
    //   shouldDuckAndroid: true,
    //   interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    // });
    setSound(sound);

    const soundStatus = await sound.getStatusAsync();
    console.log("Playing Sound", soundStatus);
    await sound.playAsync();
    // Set state to declare sound is playing
    setIsPlaying(true);

    // Set Minutes and Seconds values for timer
    millisToMinutesAndSeconds(soundStatus.durationMillis);

    // Stop declaration after sound play duration
    setTimeout(() => {
      setIsPlaying(false);
      if (!question.happiself_library_id) {
        completeTask(question.id);
        setIsCorrectOption(true);
      }
      setSeconds(null);
      setMinutes(null);
    }, soundStatus.durationMillis);
    setLoading(false);
  };

  const pauseSound = async () => {
    const soundStatus = sound.pauseAsync();
    setIsPlaying(false);
  };

  return (
    <>
      <View style={styles.timerContainer}>
        <TaskScreenHeader title="" subTitle="" navigation={navigation} />
        <ImageBackground
          source={require("../../../assets/images/timer_background.png")}
          resizeMode="contain"
          style={styles.timerBox}
        >
          {/* {minutes ? (
            <CountDown
              until={10}
              onFinish={() => alert("finished")}
              onPress={() => alert("hello")}
              size={20}
            />
          ) : null} */}

          {seconds != null && minutes != null ? (
            <Text style={styles.timerText}>{`${
              minutes <= 9 ? ("0" + minutes).slice(-2) : minutes
            } : ${seconds <= 9 ? ("0" + seconds).slice(-2) : seconds}`}</Text>
          ) : (
            <Text style={styles.timerText}>GO</Text>
          )}
        </ImageBackground>
      </View>

      <View style={{ height: hp(16) }} />

      <View style={styles.playButtonContaier}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={isPlaying ? pauseSound : playSound}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: hp(8),
            height: hp(8),
          }}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.loaderColor} />
          ) : (
            <FontAwesome
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={hp(8)}
              color="#58C4CB"
            />
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default AudioTask;

const styles = StyleSheet.create({
  timerContainer: {
    // backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
  },
  timerBox: {
    // backgroundColor: "red",
    width: hp(30),
    height: hp(30),
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: RFValue(38),
    fontFamily: "PoppinsBold",
  },
  playButtonContaier: {
    // backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  },
});
