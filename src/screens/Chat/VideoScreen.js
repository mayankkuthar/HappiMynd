import React, { useState, useEffect, useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Video, AVPlaybackStatus } from "expo-av";
import { useFocusEffect } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../assets/constants";
import { getVideo } from "./BotUtils";
import { Hcontext } from "../../context/Hcontext";

const VideoScreen = (props) => {
    const { navigation } = props;
    const { setBotVideofinished,botVideofinished, gotoVideo, setGotoVideo } = useContext(Hcontext)

    const [loading, setLoading] = useState(true);
    const [buffering, setBuffering] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");

    useEffect(() => {
        getUrl();
    }, []);

    const getUrl = async () => {
        const video = await getVideo();
        setVideoUrl(video?.content)
    }

    return (
        <View style={styles.container}>
            <View style={{ height: hp(6) }} />
            <View style={{ flexDirection: 'row', width: '100%', paddingStart: 10 }}>

                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack()
                    }}>
                    <Ionicons name="ios-chevron-back" size={hp(4)} color="black" />

                </TouchableOpacity>
            </View>
            <View style={styles?.videoCont}>
                <View style={{ height: hp(4) }} />
                <Video
                    style={{ ...styles.video, opacity: buffering ? 0.3 : 1 }}
                    source={{
                        uri: videoUrl
                    }}
                    useNativeControls
                    resizeMode="contain"
                    shouldPlay={true}
                    playsInSilentLockedModeIOS={true}
                    onPlaybackStatusUpdate={(status) => {
                        if (status.isLoaded) {
                            setLoading(false);
                        } else {
                            setLoading(true);
                        }
                        if (status.isBuffering) {
                            setBuffering(true);
                        } else {
                            setBuffering(false);
                        }
                        if (status.didJustFinish) {
                            setGotoVideo(false)
                            navigation.goBack()
                        }
                    }}
                />
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors?.background,
        flex: 1,
    },
    video: {
        height: hp(28),
        borderRadius: hp(2),
        alignItems: 'center',
    },
    videoCont: {
        paddingHorizontal: hp(4),

    }

});

export default VideoScreen;
