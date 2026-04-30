import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useContext } from 'react';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { colors, happiVoice_constants } from "../../assets/constants";

import Header from "../../components/common/Header";
import Button from "../../components/buttons/Button";

import InputField from '../../components/input/InputField';
import { Ionicons } from "@expo/vector-icons";

import { Hcontext } from "../../context/Hcontext";


const RecordTopic = (props) => {
    const { navigation } = props;
    const { whiteLabelState } = useContext(Hcontext);
    const promptTopics = props.route.params.topicList;
    const [loadingButton, setLoadingButton] = useState(false);
    const [topic, setTopic] = useState(promptTopics[0])
    const [ownTopic, setownTopic] = useState("")
    const [wtVisible, setWtVisible] = useState(false)
1
    var randomTopic = []



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
                <View style={{ height: hp(4) }} />

                <View>
                
                    <Text style={styles.title}>{happiVoice_constants?.record_topic_title}</Text>
                    <View style={{ height: hp(1) }} />
                    <Image
                        source={require("../../assets/images/HappiVoice_record_type.jpg")}
                        resizeMode="contain"
                        style={styles.banner}
                    />
                    <View style={{ height: hp(3) }} />
                    <View style={styles.detailSection}>

                        <View style={{ height: hp(2) }} />
                        <Text style={styles.detail}>{topic}</Text>
                        <View style={{ height: hp(3) }} />
                        <View style={{ flexDirection: 'row', paddingLeft: 45 }}>
                            <View style={{ paddingRight: 10, paddingTop: 3 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        randomTopic = promptTopics[Math.floor(Math.random() * promptTopics.length)];
                                        setTopic(randomTopic)
                                    }}>
                                    <Image
                                        source={require("../../assets/images/refresh_type.png")}
                                        resizeMode="contain"
                                        style={{ height: 20, width: 20, marginBottom: 10 }}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {

                                        setWtVisible(true)

                                    }}>
                                    <Image
                                        source={require("../../assets/images/edit_type.png")}
                                        resizeMode="contain"
                                        style={{ height: 20, width: 20 }}
                                    />

                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={styles.topicText}
                                    onPress={() => {
                                        randomTopic = promptTopics[Math.floor(Math.random() * promptTopics.length)];
                                        setTopic(randomTopic)
                                    }}>{happiVoice_constants?.diff_topic}</Text>
                                <Text style={styles.topicText}>{happiVoice_constants?.use_my_own}</Text>
                                <View style={{ height: hp(1) }} />
                            </View>

                        </View>
                        {wtVisible &&
                            <View style={styles.customTopic}>
                                <TextInput
                                    style={styles.customTopicText}
                                    placeholder="Write your own topic here"
                                    value={setownTopic}
                                    onChangeText={(text) => {
                                        setownTopic(text);
                                    }}
                                />


                                {true &&
                                    <TouchableOpacity
                                        onPress={() => {
                                            setWtVisible(false)
                                            setTopic(ownTopic)
                                        }}>
                                        <Image
                                            source={require("../../assets/images/checked.png")}
                                            resizeMode="contain"
                                            style={styles.checkBanner}
                                        />
                                    </TouchableOpacity>
                                }
                            </View>

                        }
                        <View style={{ height: hp(1) }} />
                        <Text style={{ color: 'grey', textAlign: 'center' }}>{happiVoice_constants?.record_Reminder}</Text>

                    </View>


                    {/* <View style={{ height: hp(4) }} > */}
                        <View style={{ height: hp(4) }} />

                        <Button
                            text={happiVoice_constants?.begin_rec}
                            loading={loadingButton}
                            pressHandler={() => {
                                navigation.push('Loader', { selectedTopic: topic, });
                            }}
                        />
                        <View style={{ height: hp(4) }} />
                    {/* </View> */}
                    {/* <View style={{ height: hp(8) }} /> */}
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
    title: {
        fontSize: RFValue(14),
        fontFamily: "PoppinsMedium",
        color: "black",
        alignSelf: 'center'
    },
    topicText: {
        fontSize: RFValue(13),
        fontFamily: "PoppinsMedium",
        color: "grey",
        marginBottom: 5
    },

    banner: {
        width: wp(80),
        height: hp(30),
        alignSelf: 'center',
        borderRadius: 8
    },
    detailSection: {
        backgroundColor: "#FAFFFF",
        paddingHorizontal: hp(2.5),
        paddingVertical: hp(1.5),
        borderRadius: 10,
    },
    noteSection: {
        backgroundColor: "#FAFFFF",
        paddingVertical: hp(1.5),
        borderRadius: 30,
        alignItems: 'center'
    },
    detail: {
        fontSize: RFValue(15),
        fontFamily: "PoppinsMedium",
        lineHeight: hp(3),
        textAlign: 'center'

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

    customTopic: {
        flexDirection: 'row',
        padding: 12,
        paddingTop: 15,
        paddingBottom: 15,
        alignSelf: "center",
        alignItems: 'center',
        backgroundColor: "white",
        borderWidth: 0.8,
        borderRadius: 8,
        borderColor: 'grey',
        borderStyle: ("dashed")
    },

    customTopicText: {
        marginTop: 2,
        marginBottom: 2,
        marginRight: 5,
        backgroundColor: '#FAFFFF',
        borderWidth: 1,
        borderColor: colors.borderLight,
        borderRadius: 5,
        paddingLeft: 5,
        flex: 0.8,
        height: "120%",
        fontSize: RFValue(12),
        alignItems: 'center'
    },
    checkBanner: {
        height: 25,
        width: 25,
        alignSelf: 'center',
        marginLeft: 2
    }
})

export default RecordTopic