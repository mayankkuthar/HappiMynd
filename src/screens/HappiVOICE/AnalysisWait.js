import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import Button from "../../components/buttons/Button"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { colors, happiVoice_constants } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";


import Header from "../../components/common/Header";


const AnalysisWait = (props) => {
  const { navigation } = props;
 
  const [countdown, setCountdown] = useState(6);


  useEffect(() => {

    const interval = setInterval(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1);
      } else {
        clearInterval(interval);
        navigation.push('VoiceReport');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown, navigation]);

  return (


    <View style={styles.container}>
      <Header showBack={true} navigation={navigation} />
      <ScrollView style={{ paddingHorizontal: wp(10) }}>

        <View style={{ height: hp(30) }} />
        <Text style={styles.topicText}>{happiVoice_constants?.ana_wait}</Text>
        <View style={{ height: hp(3) }} />

      </ScrollView>
    </View>

  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,


  },
  topicText: {
    padding: 10,
    fontSize: RFValue(22),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
    textAlign: 'center'
  }

})

export default AnalysisWait