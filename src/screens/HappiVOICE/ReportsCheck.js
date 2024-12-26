import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import { Hcontext } from "../../context/Hcontext";
import { colors, happiVoice_constants } from '../../assets/constants';
import { RadialSlider } from 'react-native-radial-slider';


const ReportsCheck = (props) => {

  const { navigation } = props;
  const { whiteLabelState } = useContext(Hcontext);
  const { voiceReport, setVoiceReport} = useContext(Hcontext);


  const result = voiceReport; 


  const scoreVal = result?.result?.inference?.[0]?.score?.value


  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={styles.headerContainer}
        activeOpacity={0.7}
        onPress={() => {
          setVoiceReport("")
          navigation.navigate("HomeScreen")}}
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
      <View style={{ height: hp(4) }} />

      <View style={styles.scoreOuterContainer}>
        <View style={styles.dateContainer}>
          <View style={{ height: hp(3) }} />
          <Text style={styles.titletext}>{happiVoice_constants?.fit_Score}</Text>
      
          <Text style={styles.normalText}>{result?.result?.inferredAt.substring(0,10)}</Text>
        </View>
       
     
       <View style={styles.scoreValCont}>
       
         
          <RadialSlider
            variant={"RadialSlider"}
            value={scoreVal}
            min={-10.5}
            max={110.5}
            radius={100}
            onChange={() => {
            }}
            sliderWidth={15}
            sliderTrackColor={"green"}
            thumbColor='white'
            thumbRadius={10}
            thumbBorderWidth={6}
            thumbBorderColor='green'
            linearGradient={[{ offset: '30%', color: 'orange' }, { offset: '60%', color: 'yellow' }, { offset: '100%', color: 'green' }]}
            unit=''
            isHideLines={true}
            valueStyle={{ fontFamily: 'PoppinsSemiBold', color: 'black', fontSize: RFValue(16), marginTop: -60 }}
            isHideTailText={true}
            subTitle={(scoreVal >= 0 && scoreVal < 70 ? "Pay Attention" :
              scoreVal >= 70 && scoreVal <= 79 ? "Good" :
                scoreVal >= 80 && scoreVal <= 100 ? "Excellent" : "No score")}
            subTitleStyle={styles.titletext}
            isHideButtons={true}

          />
          <View style={{ height: 40, backgroundColor: "white", marginTop: -90, flexDirection:'row',paddingStart:28}}>
            <Text style={{flex:1, marginLeft:5}}> 0</Text>
            <Text style={{flex:1, marginLeft:15, textAlign:'center'}}>100</Text>
          </View>

        </View>


        <View style={{ height: hp(1) }} />

      </View>

      <View style={{ height: hp(2) }} />
      <Text style={styles.outerTitle}>{happiVoice_constants?.score_com}</Text>
      <View style={styles.scoreListCont}>

        <View style={{ height: hp(2) }} />
        <FlatList
          data={result?.result?.inference?.[0]?.voiceFeatures}
          renderItem={({ item }) =>
            <View style={styles.ListCont}>
              <View style={styles.ListInnerCont}>
                <Text style={styles.featText}>{item?.name}</Text>
              </View>
              <View style={styles.valCont}>
                <Text style={(item?.name == "Smoothness" && item?.score >= 94 && item?.score < 100 ? styles.valRangeText :
                  item?.name == "Control" && item?.score >= 80 && item?.score < 90 ? styles.valRangeText :
                    item?.name == "Liveliness" && item?.score >= 0.15 && item?.score < 0.30 ? styles.valRangeText :
                      item?.name == "Energy Range" && item?.score >= 5 && item?.score < 10 ? styles.valRangeText :
                        item?.name == "Clarity" && item?.score >= 0.30 && item?.score < 0.45 ? styles.valRangeText :
                          item?.name == "Crispness" && item?.score >= 200 && item?.score < 300 ? styles.valRangeText :
                            item?.name == "Speech Rate" && item?.score >= 75 && item?.score < 125 ? styles.valRangeText :
                              item?.name == "Pause Duration" && item?.score >= 0.25 && item?.score < 0.60 ? styles.valRangeText :
                                styles.valText)}>{item?.score} {(item?.name == "Energy Range" ? "dB" : item?.name == "Liveliness" ? "octaves" : item?.name == "Clarity" ? "kHz2" : item?.name == "Crispness" ? "ms" : item?.name == "Speech Rate" ? "words/min" : item?.name == "Pause Duration" ? "sec" : item?.name == "Smoothness" ? "%" : item?.name == "Control" ? "%" : "%")} </Text>
              </View>
              <View style={styles.iconCont}>
                <TouchableOpacity
                  onPress={() => {
                    item?.name == "Smoothness" ? navigation.push('FeatureDetails', { ScoreDetails: item }) :
                      item?.name == "Control" ? navigation.push('FeatureDetails', { ScoreDetails: item }) :
                        item?.name == "Energy Range" ? navigation.push('FeatureDetails', { ScoreDetails: item }) :
                          item?.name == "Liveliness" ? navigation.push('FeatureDetails', { ScoreDetails: item }) :
                            item?.name == "Clarity" ? navigation.push('FeatureDetails', { ScoreDetails: item }) :
                              item?.name == "Crispness" ? navigation.push('FeatureDetails', { ScoreDetails: item }) :
                                item?.name == "Speech Rate" ? navigation.push('FeatureDetails', { ScoreDetails: item }) :
                                  item?.name == "Pause Duration" ? navigation.push('FeatureDetails', { ScoreDetails: item }) :
                                  navigation.push('HomeScreen')
                  }}>
                  <Ionicons name="ios-chevron-forward" size={hp(3)} color='grey' />
                </TouchableOpacity>
              </View>
            </View>
          }
          keyExtractor={item => item.name}
        />

        <View style={{ height: hp(2) }} />

      </View>
    </View>
  )
}

const styles = StyleSheet.create({

  mainContainer: {
    backgroundColor: colors.background,
    flex: 1,
    alignItems: 'center'
  },
  headerLogo: {
    alignSelf: 'center',
    width: wp(28),
    height: hp(7),
  },
  headerContainer: {
    position: "absolute",
    left: wp(2),
    top: hp(8),
  },

  scoreOuterContainer: {
    paddingHorizontal: wp(5),
    paddingTop: 12,
    paddingBottom: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center'

  },
  dateContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },

  scoreValCont: {


    paddingLeft: 40,
    paddingRight: 40,
    borderRadius: 10,
    justifyContent: 'center'
  },
  scoreListCont: {
    flex: 0.9,
    width: '90%',
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center'

  },
  ListCont: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 8,
    borderColor: 'grey',
    margin: 5,
    borderWidth: 1,
    alignSelf: 'center',
    width: '95%',
  },
  ListInnerCont: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  valCont: {
    width: '32%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  iconCont: {
    width: '10%',
    alignItems: 'flex-start',
    marginRight: 5,
  },

  titletext: {
    color: 'black',
    alignSelf: 'flex-start',
    fontFamily: 'PoppinsSemiBold',
    fontSize: RFValue(12),
    marginTop: -20
  },
  outerTitle: {
    color: 'black',
    alignSelf: 'flex-start',
    fontFamily: 'PoppinsSemiBold',
    fontSize: RFValue(13),
    marginLeft: 40,
    marginBottom: 5
  },
  normalText: {
    color: 'grey',
    fontFamily: 'PoppinsMedium',
    fontSize: RFValue(12),
    alignSelf: 'center'
  },
  scoreText: {
    color: colors.primaryText,
    fontFamily: 'PoppinsBold',
    fontSize: RFValue(16),
    alignSelf: 'center'
  },
  featText: {
    flex: 1,
    color: 'black',
    fontFamily: 'PoppinsMedium',
    fontSize: RFValue(12),
    marginLeft: 15,
    justifyContent: 'center'
  },
  valText: {
    color: 'orange',
    alignSelf: 'flex-end',
    fontFamily: 'PoppinsMedium',
    fontSize: RFValue(12),
    justifyContent: 'center'
  },
  valRangeText: {
    color: 'green',
    alignSelf: 'flex-end',
    fontFamily: 'PoppinsMedium',
    fontSize: RFValue(12),
    color: colors.primaryText,
    justifyContent: 'center'
  },

})

export default ReportsCheck