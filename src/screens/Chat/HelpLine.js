import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native'
import Button from "../../components/buttons/Button"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { colors, happiVoice_promptTips } from "../../assets/constants";
import Header from "../../components/common/Header";
import { getHelpLineTxt } from './BotUtils';
import HTML from 'react-native-render-html';


const HelpLine = (props) => {
  const { navigation } = props;

  const [helpText, setHelpText] = useState([])
  const [phoneNum, setPhoneNum] = useState([])

  useEffect(() => {
    helpSuicidal();
  }, []);

  const helpSuicidal = async () => {
    let message = await getHelpLineTxt();
    const phoneRegex = /\+\d{2}-\d{10}/;

    const phoneNumberMatch = message.match(phoneRegex);
    let textM = message;
    let phoneNumber = null;
    if (phoneNumberMatch) {
      phoneNumber = phoneNumberMatch[0];
      setPhoneNum(phoneNumber)
      textM = message.replace(phoneRegex, '').trim();
      setHelpText(textM)
    }
  }

  const handleHelplinePress = () => {
    Linking.openURL(`tel:${phoneNum}`);
  };

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: wp(7) }}>
        <View style={{ height: hp(3) }} />
        <HTML
          contentWidth={10}
          source={{ html: helpText }}
          baseStyle={{
            color: colors.primaryText, fontSize: RFValue(18), fontFamily: "PoppinsSemiBold", fontWeight: "500"
          }} />
        <TouchableOpacity onPress={handleHelplinePress}>
          <Text style={styles.numText}>{phoneNum}</Text>
        </TouchableOpacity>
        <View style={{ height: hp(3) }} />
      </View>
    </View>

  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    padding: 5
  },
  topicText: {
    padding: 10,
    fontSize: RFValue(30),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
    textAlign: 'center'
  },
  numText: {
    padding: 10,
    fontSize: RFValue(18),
    fontFamily: "PoppinsMedium",
    fontWeight: 'bold',
    // color: colors.primaryText,
    color: 'blue',
    textDecorationLine: 'underline',
    // textAlign: 'center'
  }

})

export default HelpLine