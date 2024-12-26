import React, { useState, useEffect, useContext } from "react";

import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";




import { colors, happiVoice_constants } from "../../assets/constants";

import Header from "../../components/common/Header";
import Button from "../../components/buttons/Button";
import { Ionicons } from "@expo/vector-icons";
import { Hcontext } from "../../context/Hcontext";




const Loader = (props) => {
    const { navigation } = props;
    const [countdown, setCountdown] = useState(3);
    const { whiteLabelState } = useContext(Hcontext);
    const [loadingButton, setLoadingButton] = useState(false);
    
    const selectedTopic = props.route.params.selectedTopic;

    useEffect(() => {
        const interval = setInterval(() => {
            if (countdown > 1) {
                setCountdown(countdown - 1);
            } else {

                clearInterval(interval);
                navigation.replace('VoiceRecord', { Topic: selectedTopic });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [countdown, navigation]);



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
            <ScrollView style={{ paddingHorizontal: wp(10) }}>
       

                <View style={{ height: hp(2) }} />

                <View>

                    <View style={{ height: hp(8) }} >
                        <View style={{ height: hp(15) }} />

                        <View>
                            <Text style={styles.title}>{countdown}</Text>
                            <View style={{ height: hp(20) }} />

                        </View>
                        <View style={{ height: hp(8) }} />
                        <Text style={styles.counterText}>{happiVoice_constants?.ready}</Text>
                    </View>

                    <View style={{ height: hp(50) }} />
                    <View>
                        <Text style={styles.topicTitle}>{happiVoice_constants?.prepared}</Text>
                        <View style={{ height: hp(3) }} />
                        <Text style={styles.topicText}>{selectedTopic}</Text>
                        <View style={{ height: hp(3) }} />
                    </View>
                 
                </View>
            </ScrollView >
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
    title: {
        fontSize: RFValue(110),
        fontFamily: "PoppinsSemiBold",
        color: colors.primaryText,
        alignSelf: 'center'
    },
    topicTitle: {
        fontSize: RFValue(14),
        fontFamily: "PoppinsMedium",
        color: "black",
        alignSelf: 'center'
    },
    topicText: {
        fontSize: RFValue(19),
        fontFamily: "PoppinsSemiBold",
        color: colors.primaryText,
        textAlign: 'center'
    },
    headerLogo: {  
        alignSelf:'center',
     
        width: wp(28),
        height: hp(7),
      },
      backContainer: {
        position: "absolute",
        left: wp(6),
        top: hp(8),
      },

})

export default Loader;

