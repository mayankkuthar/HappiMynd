import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import Button from "../../components/buttons/Button"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors, happiVoice_promptTips } from "../../assets/constants";

import Header from "../../components/common/Header";

const Tips = (props) => {
  const { navigation } = props;

  const [tip, setTip] = useState(happiVoice_promptTips[0])
  const [countdown, setCountdown] = useState(18);

  useEffect(() => {

    const interval = setInterval(() => {
      var randomTip = happiVoice_promptTips[Math.floor(Math.random() * happiVoice_promptTips.length)];
   
      countdown%3 == 0 ? setTip(randomTip) : null
      
      if (countdown > 1) {
        setCountdown(countdown - 1);
      } else {

        clearInterval(interval);
        navigation.navigate('AnalysisWait');
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [countdown, navigation]);


  return (


    <View style={styles.container}>
      <Header showBack={true} navigation={navigation} />
      <View style={{ paddingHorizontal: wp(10) }}>

        <View style={{ height: hp(30) }} />
        <Text style={styles.topicText}>{tip}</Text>
        <View style={{ height: hp(3) }} />

      </View>
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

export default Tips