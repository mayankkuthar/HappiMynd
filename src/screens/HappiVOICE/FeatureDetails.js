import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useContext, useState } from 'react'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import { Hcontext } from "../../context/Hcontext";
import { colors } from '../../assets/constants';
import { RadialSlider } from 'react-native-radial-slider';


const FeatureDetails = (props) => {


    const valStyle = () => {
        return(
            
        (feature?.name == "Smoothness" && feature?.score >= 94 && feature?.score < 100 ? styles.valRangeText :
            feature?.name == "Control" && feature?.score >= 80 && feature?.score < 90 ? styles.valRangeText :
                feature?.name == "Liveliness" && feature?.score >= 0.15 && feature?.score < 0.30 ? styles.valRangeText :
                    feature?.name == "Energy Range" && feature?.score >= 5 && feature?.score < 10 ? styles.valRangeText :
                        feature?.name == "Clarity" && feature?.score >= 0.30 && feature?.score < 0.45 ? styles.valRangeText :
                            feature?.name == "Crispness" && feature?.score >= 200 && feature?.score < 300 ? styles.valRangeText :
                                feature?.name == "Speech Rate" && feature?.score >= 75 && feature?.score < 125 ? styles.valRangeText :
                                    feature?.name == "Pause Duration" && feature?.score >= 0.25 && feature?.score < 0.60 ? styles.valRangeText :
                                        styles.valText))
}
    const featStyle = () => {
        return(
        (feature?.name == "Smoothness" && feature?.score >= 94 && feature?.score < 100 ? styles.featRangeText :
            feature?.name == "Control" && feature?.score >= 80 && feature?.score < 90 ? styles.featRangeText :
                feature?.name == "Liveliness" && feature?.score >= 0.15 && feature?.score < 0.30 ? styles.featRangeText :
                    feature?.name == "Energy Range" && feature?.score >= 5 && feature?.score < 10 ? styles.featRangeText :
                        feature?.name == "Clarity" && feature?.score >= 0.30 && feature?.score < 0.45 ? styles.featRangeText :
                            feature?.name == "Crispness" && feature?.score >= 200 && feature?.score < 300 ? styles.featRangeText :
                                feature?.name == "Speech Rate" && feature?.score >= 75 && feature?.score < 125 ? styles.featRangeText :
                                    feature?.name == "Pause Duration" && feature?.score >= 0.25 && feature?.score < 0.60 ? styles.featRangeText :
                                        styles.featText))
}

const { navigation } = props;
const { whiteLabelState, } = useContext(Hcontext);

const feature = props.route.params.ScoreDetails;

return (
    <View style={styles.mainContainer}>
        <TouchableOpacity
            style={styles.headerContainer}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
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

        <View style={{ height: hp(3) }} />

        <View style={styles.scoreOuterContainer}>
            <View style={{ height: hp(2) }} />
            <Text style={styles.Headingtext}>About {feature.name}</Text>
            <View >
              
                <View style={styles.scoreValCont}>
                    <View style={{ height: hp(2) }} />

                    <RadialSlider
                        variant={RadialSlider}
                        value={feature?.score}
                        
                        min={(feature?.name == "Energy Range" ? -0.09 : feature?.name == "Liveliness" ? -0.0001 : feature?.name == "Clarity" ? -0.023 : feature?.name == "Crispness" ? -35 : feature?.name == "Speech Rate" ? 0 : feature?.name == "Pause Duration" ? -0.55 : -13)}
                        max={(feature?.name == "Energy Range" ? 36.7 : feature?.name == "Liveliness" ? 0.489 : feature?.name == "Clarity" ? 0.56 : feature?.name == "Crispness" ? 335 : feature?.name == "Speech Rate" ? 180 : feature?.name == "Pause Duration" ? 5.09 : 114)}

                        radius={95}
                        onChange={() => {
                        }}
                        sliderWidth={15}

                        thumbColor='white'
                        sliderTrackColor='green'
                        thumbRadius={9}
                        thumbBorderWidth={7}
                        thumbBorderColor='green'
                        linearGradient={[{ offset: '30%', color: 'orange' }, { offset: '60%', color: 'yellow' }, { offset: '100%', color: 'green' }]}
                        unit={(feature?.name == "Energy Range" ? "dB" : feature?.name == "Liveliness" ? "octaves" : feature?.name == "Clarity" ? "kHz2" : feature?.name == "Crispness" ? "ms" : feature?.name == "Speech Rate" ? "words/min" : feature?.name == "Pause Duration" ? "sec" : "%")}
                        isHideLines={true}
                        unitStyle={[ {marginTop: -60}, valStyle() ]}

                        valueStyle={valStyle() }
                        subTitle={feature.name}
                        subTitleStyle={featStyle()}
                        isHideButtons={true}
                    />
                    <View style={{ height: 70, width: '80%', backgroundColor: "white", marginTop: -90, flexDirection: 'row', paddingStart: 28, paddingRight: 10 }}>
                        <Text style={{ flex: 1, marginLeft: -25 }}>{(feature?.name == "Energy Range" ? "0 dB" : feature?.name == "Liveliness" ? "0.01 octaves" : feature?.name == "Clarity" ? "0.1 kHz2" : feature?.name == "Crispness" ? "0 ms" : feature?.name == "Speech Rate" ? "0 words/min" : feature?.name == "Pause Duration" ? "0.1 sec" : "0%")}</Text>
                        <Text style={{ flex: 1, marginLeft: 70, textAlign: 'center', }}>{(feature?.name == "Energy Range" ? "36 dB" : feature?.name == "Liveliness" ? "0.50 octaves" : feature?.name == "Clarity" ? " 0.50 kHz2" : feature?.name == "Crispness" ? "500 ms" : feature?.name == "Speech Rate" ? "180 words/min" : feature?.name == "Pause Duration" ? "5.0 sec" : "100%")}</Text>
                    </View>

                </View>
                
                <View>

                    <Text style={styles.DetailsTitle}>About the range</Text>

                    <View style={{ height: hp(2) }} />
                    <View style={styles.iconView}>
                        <FontAwesome name="circle" size={hp(2)} color="green" />
                        <Text style={styles.iconText}>High {feature?.name} - {(feature.name == "Energy Range" ? "louder voices"
                            : feature.name == "Liveliness" ? "highness of voice"
                                : feature.name == "Clarity" ? "more vocal clarity"
                                    : feature.name == "Crispness" ? "larger sound durations"
                                        : feature.name == "Speech Rate" ? "more number of words spoken"
                                            : feature?.name == "Pause Duration" ? "more duration of the silent gaps"
                                                : "more pitch control")}
                        </Text>

                    </View>
                    <View style={{ height: hp(1) }} />

                    <View style={styles.iconView}>
                        <FontAwesome name="circle" size={hp(2)} color="orange" />
                        <Text style={styles.iconText}>Low {feature?.name} - {(feature.name == "Energy Range" ? "softer voices"
                            : feature.name == "Liveliness" ? "lowness of voice"
                                : feature.name == "Clarity" ? "less vocal clarity"
                                    : feature.name == "Crispness" ? "smaller sound durations"
                                        : feature.name == "Speech Rate" ? "less number of words spoken"
                                            : feature?.name == "Pause Duration" ? "less duration of the silent gaps"
                                                : "less pitch control")}
                        </Text>

                    </View>

                    <View style={{ height: hp(4) }} />

                    <Text style={styles.DetailsText}>{(feature?.name == "Smoothness" ? "Reduced mental health can negatively impact our ability to have precise control over vocal pitch. When vocal pitch control decreases, the smoothness of our voice decreases."
                        : feature?.name == "Control" ? "Reduced mental health can negatively impact our ability to have precise control over vocal muscles. When vocal muscles control decreases, our control decreases. "
                            : feature?.name == "Liveliness" ? "Depressed emotions or reduced mental fitness can affect how much vocal variety we use. Less variety or liveliness in our voice results in a more monotone and less engaging voice."
                                : feature.name == "Energy Range" ? "Depressed emotions or reduced mental fitness can cause our vocal energy range to decrease. When we feel at our best, we speak with a varying intensity for emphasis, leading to higher energy range."
                                    : feature.name == "Clarity" ? "Reduced mental fitness can result in reduced movements of the tongue, jaw and lips, reducing the range of sounds we produce. This can lead to lower vocal clarity."
                                        : feature.name == "Crispness" ? "Reduced mental fitness can lead to reduced effort at producing speech, leading to shorter durations of each sound. This can result in a less crisp sounding speech."
                                            : feature.name == "Speech Rate" ? "Reduced mental fitness can slow us down, including how we speak. Changes in speech rate can indicate changes in mental fitness."
                                                : feature?.name == "Pause Duration" ? "If we are not feeling well we tend to need more time to think about what we say or do. Measuring the average time of silence gaps in speech can indicate changes in mental fitness."
                                                    : "NA")}
                    </Text>
                </View>
                <View style={{ height: hp(20) }} />
            </View>
        </View>

    </View>
)
}


export default FeatureDetails

const styles = StyleSheet.create({

    mainContainer: {
        paddingHorizontal: wp(5),
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
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center'

    },

    iconView: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        paddingLeft: 20,
        alignItems: 'center'
    },

    scoreValCont: {
        paddingHorizontal: wp(10),
        paddingLeft: 20,
        paddingRight: 10,
        backgroundColor: "white",
        borderRadius: 10,
        alignSelf: 'center',

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

    Headingtext: {
        paddingHorizontal: wp(10),
        // color: 'black',
        alignSelf: 'flex-start',
        fontFamily: 'PoppinsSemiBold',
        fontSize: RFValue(20),
        alignSelf: 'center',
        color: colors.primaryText,
    },

    titletext: {
        paddingHorizontal: wp(20),
        color: 'black',
        alignSelf: 'flex-start',
        fontFamily: 'PoppinsSemiBold',
        fontSize: RFValue(20),
        alignSelf: 'center'
    },

    scoreText: {
        color: colors.primaryText,
        fontFamily: 'PoppinsBold',
        fontSize: RFValue(18),
        alignSelf: 'center'
    },
    featText: {
        color: 'orange',
        alignSelf: 'flex-start',
        fontFamily: 'PoppinsSemiBold',
        fontSize: RFValue(12),

    },
    featRangeText: {
        color: 'green',
        alignSelf: 'flex-start',
        fontFamily: 'PoppinsSemiBold',
        fontSize: RFValue(12),

    },

    DetailsTitle: {
      
        alignSelf: 'flex-end',
        fontFamily: 'PoppinsSemiBold',
        fontSize: RFValue(14),
        color: colors.primaryText,
        alignSelf: 'center',
        marginTop: -10

    },
    DetailsText: {
        paddingLeft: 10,
        paddingRight: 10,
        color: 'black',
        textAlign: 'center',
        fontFamily: 'PoppinsMedium',
        fontSize: RFValue(12),
    },
    iconText: {
        color: 'black',
        textAlign: 'center',
        fontFamily: 'PoppinsMedium',
        fontSize: RFValue(12),
        marginLeft: 10
    },
    valText: {
        color: 'orange',
        fontFamily: 'PoppinsSemiBold',
        fontSize: RFValue(14),
       
        marginTop: -30

      },
      valRangeText: {
        color: 'green',
        fontFamily: 'PoppinsSemiBold',
        fontSize: RFValue(14),
        marginTop: -30
      },

})