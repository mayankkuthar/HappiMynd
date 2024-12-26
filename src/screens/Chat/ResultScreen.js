import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native'
import Button from "../../components/buttons/Button"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { colors, happiVoice_promptTips } from "../../assets/constants";
import Header from "../../components/common/Header";
import { getHelpLineTxt, getScore } from './BotUtils';
import HTML from 'react-native-render-html';
import { Ionicons } from "@expo/vector-icons";

import { Hcontext } from '../../context/Hcontext';

const ResultScreen = (props) => {
  const { navigation } = props;
  const { whiteLabelState } = useContext(Hcontext);
  const [score, setScore] = useState("")
  const [phoneNum, setPhoneNum] = useState([])
  const { setGotoAssessment } = useContext(Hcontext);

  useEffect(() => {
    getRes();
  }, []);

  const getRes = async () => {
    let message = await getScore(props?.route?.params?.profile_id);
    if (message?.status == "Success") {
      const filteredData = message?.assessments.filter(item => item.chat_bot_category_id === props?.route?.params?.cat_id);
      setScore(filteredData[0])
    }
    else {
      let message = await getScore();
      const filteredData = message?.assessments.filter(item => item.chat_bot_category_id === props?.route?.params?.cat_id);
      setScore(filteredData[0])
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: wp(7) }}>
      <View style={{ height: hp(3) }} />
        <View style={{ flexDirection: 'row' }}>

          <TouchableOpacity
            onPress={() => {
              setGotoAssessment(false)
              navigation.navigate("ChatHome")

            }}>
            <View style={styles.backContainer}>
              <Ionicons name="ios-chevron-back" size={hp(4)} color="black" />
            </View>
            <View style={{ height: hp(4) }} />
           
          </TouchableOpacity>
          <Image
            source={
              whiteLabelState.logo
                ? { uri: whiteLabelState.logo }
                : require("../../assets/images/happimynd_logo.png")
            }
            style={{ ...styles.headerLogo }}
            resizeMode="contain"
          />
        </View>
        <Text style={styles?.titleText}>{score?.category?.name}</Text>
        <View style={{ height: hp(3) }} />
        <View style={styles?.scoreCont}>
          <Text style={styles?.topicText}>Your score is {score?.score} </Text>
          <Text style={styles?.topicText}>{score?.report?.interpretation}</Text>
          <View style={{ height: hp(3) }} />
        </View>

      </View>
    </View>

  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    padding: 5,
    
  },
  titleText: {
    paddingTop: 22,
    fontSize: RFValue(20),
    fontFamily: "PoppinsSemiBold",
    // color: colors.primaryText,
    color: 'black',

    textAlign: 'center'
  },
  topicText: {
    padding: 10,
    fontSize: RFValue(18),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
    // color: 'black',
    textAlign: 'center'
  },
  
  backContainer: {
    paddingTop: 20,
   
  },
  scoreCont: {
    paddingTop: 20,
    backgroundColor:"white",
    borderRadius: 10
  },
  headerLogo: {
    alignSelf: 'center',
    width: wp(28),
    height: hp(7),
    marginLeft: hp(9),

  },

})

export default ResultScreen