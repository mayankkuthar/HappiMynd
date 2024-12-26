import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useContext } from 'react'
import Button from "../../components/buttons/Button"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AudioRecord from 'react-native-audio-record';
import { request, PERMISSIONS } from 'react-native-permissions';

import { colors, happiVoice_constants } from "../../assets/constants";

import { getScoreInference, uploadAudio } from './VoiceAPIService';
import { Ionicons } from "@expo/vector-icons";
import { Hcontext } from "../../context/Hcontext";
import CountdownCircle from './CountdownCircle';


const VoiceRecord = (props) => {
  const { whiteLabelState } = useContext(Hcontext);
  const { navigation } = props;
  const selectedTopic = props.route.params.Topic;
  const { signedUrlAudio, tokenSonde, sondeUserId, setSondeJobId } = useContext(Hcontext);

  const [binarydata, setBinarydata] = useState();
  const [countdown, setCountdown] = useState(30);
  const [loadingButton, setLoadingButton] = useState(false);
  const [isRecording, setIsRecording] = useState("Recording...");

  const [submit, setSubmit] = useState(false);




  useEffect(() => {
    const interval = setInterval(() => {
      if (countdown == 30) {
        startRecording();
      }
      if (countdown >= 1) {
        setCountdown(countdown - 1);
      } else {
        clearInterval(interval);

        stopRecording();

      }
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown, navigation]);



  const startRecording = async () => {

    const options = {
      sampleRate: 44100,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6,
      wavFile: `recordedAudio.wav`,

    };
    const android_permission = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);

    const ios_permission = await request(PERMISSIONS.IOS.MICROPHONE);

    console.log("permission ----- audio ",android_permission);

    if (android_permission == 'granted' || ios_permission == 'granted') {
     
      try {
        await startAudioRecording(options)
      } catch (error) {
        console.error('startAudioRecording_error', error);
      }
    }

  };

  const startAudioRecording = async (options) => {
    AudioRecord.init(options);
    AudioRecord.start();
  }

  const stopRecording = async () => {
    try {

      const audioFile = await AudioRecord.stop();
      if (audioFile) {
        setIsRecording("Recording completed...")
        setSubmit(true)
      }
      const res = await fetch("file://" + audioFile)
      const blobData = await res.blob();
      setBinarydata(blobData);

    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const postAudio = async () => {
    setLoadingButton(true);    console.log("upload result ------ ",uploadresult);
    console.log("post start  ------ ");

    let uploadresult = await uploadAudio(signedUrlAudio?.signedURL, binarydata)
    console.log("upload result ------ ",uploadresult);

    if (uploadresult?.ok) {

      let inferenceRes = await getScoreInference(tokenSonde, sondeUserId, signedUrlAudio);
      setSondeJobId(inferenceRes?.jobId)

      if (inferenceRes) {
        setLoadingButton(false);
        navigation.push("Tips")
      }
      if (!inferenceRes) {
        let inferenceRes = await getScoreInference(tokenSonde, sondeUserId, signedUrlAudio);
        setSondeJobId(inferenceRes?.jobId)
        setLoadingButton(false);
        navigation.push("Tips")
      }
    }
  }

  return (

    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backContainer}
        activeOpacity={0.7}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <Ionicons name="ios-chevron-back" size={hp(4)} color="black" />
      </TouchableOpacity>
      <View style={{ height: hp(6) }} />
      <Image
        source={
          whiteLabelState.logo
            ? { uri: whiteLabelState.logo }
            : require("../../assets/images/happimynd_logo.png")
        }
        style={{ ...styles.headerLogo }}
        resizeMode="contain"
      />
      <View style={{ paddingHorizontal: wp(10) }}>

        <View style={{ height: hp(12) }} />
        <Text style={styles.counterText}>{happiVoice_constants?.vr_seconds}</Text>
        <View style={{ height: hp(3) }} />
        <Text style={styles.topicText}>{selectedTopic}</Text>
        <View style={{ height: hp(4) }} />
        <Text style={styles.LoadText}>{countdown}s</Text>
        <View style={{ height: hp(7) }} />

        <View style={{ alignItems: 'center' }}>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <CountdownCircle duration={30} />
          </View>
          <View style={{ height: hp(10) }} />
          <Text style={styles.normalText}>  {isRecording}</Text>
        </View>


        {submit && (

          <View>
            <View style={{ height: hp(3) }} />
            <Button
              text={happiVoice_constants?.button_retake}
              pressHandler={() => {
                navigation.goBack()
              }}
            />
            <View style={{ height: hp(2) }} />

            <Button
              text={happiVoice_constants?.button_submit}
              loading={loadingButton}
              pressHandler={() => {
                postAudio();
              }}
            />
          </View>
        )}
        <View style={{ height: hp(6) }} />



      </View>
    </View>

  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  counterText: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsSemiBold",
    color: "grey",
    alignSelf: 'center'
  },
  topicText: {
    fontSize: RFValue(18),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
    textAlign: 'center',


  },
  LoadText: {
    fontSize: RFValue(26),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
    alignSelf: 'center'
  },
  normalText: {
    fontSize: RFValue(16),
    fontFamily: "PoppinsSemiBold",
    color: 'grey',
    alignSelf: 'center'
  },
  headerLogo: {
    alignSelf: 'center',

    width: wp(28),
    height: hp(7),
  },
  backContainer: {
    position: "absolute",
    left: wp(6),
    top: hp(8),

  },

})

export default VoiceRecord