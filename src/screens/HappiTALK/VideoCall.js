import React, { useState, useEffect, useContext, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { MaterialIcons, Feather, AntDesign } from "@expo/vector-icons";
import {
  TwilioVideo,
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
} from "react-native-twilio-video-webrtc";
import { check, PERMISSIONS, RESULTS, request } from "react-native-permissions";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

const VideoCall = (props) => {
  // Prop Destructuring
  const { navigation, route } = props;

  //State Variables
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState("disconnected");
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [token, setToken] = useState(null);
  const [participantUser, setParticipantUser] = useState("");
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Context Variables
  const { authState, joinRoom, joinRoomGuide } = useContext(Hcontext);

  console.log("check teh randomness - ", status);

  // Refference Variables
  const twilioRef = useRef(null);

  // Mounting
  useEffect(() => {
    check(PERMISSIONS.ANDROID.CAMERA)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              "This feature is not available (on this device / in this context)"
            );
            break;
            requestPermissions();
          case RESULTS.DENIED:
            console.log(
              "The permission has not been requested / is denied but requestable"
            );
            requestPermissions();
            break;
          case RESULTS.LIMITED:
            console.log("The permission is limited: some actions are possible");
            requestPermissions();
            break;
          case RESULTS.GRANTED:
            console.log("The permission is granted");
            getRoomAccess(route.params.sessionId);
            break;
          case RESULTS.BLOCKED:
            console.log("The permission is denied and not requestable anymore");
            requestPermissions();
            break;
        }
      })
      .catch((error) => {
        // …
      });

    return () => {
      _onEndButtonPress();
    };
  }, []);

  const requestPermissions = () => {
    request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
      console.log("check camera perssion req result - ", result);
      if (result === "granted") {
        request(PERMISSIONS.ANDROID.RECORD_AUDIO).then((res) => {
          if (res === "granted") {
            getRoomAccess(route.params.sessionId);
          }
        });
      }
    });
  };

  // Getting the room access token
  const getRoomAccess = async (sessionId) => {
    try {
      let roomToken;
      console.log("check the route module - ", route.params.module);
      console.log("check the session id - ", sessionId);
      if (route.params.module === "guide") {
        roomToken = await joinRoomGuide({ sessionId });
      } else {
        roomToken = await joinRoom({ sessionId });
      }

      console.log("The room response - ", roomToken);
      if (roomToken.token) {
        setToken(roomToken.token);
        _onConnectButtonPress(roomToken.token);
      }
    } catch (err) {
      console.log(
        "Some issue while granting room access (VideoCall.js) - ",
        err
      );
    }
  };

  // Twillio methods
  const _onConnectButtonPress = (roomToken) => {
    twilioRef.current.connect({
      // roomName: "cool_room",
      accessToken: roomToken,
    });
    setStatus("connecting");
  };

  const _onEndButtonPress = () => {
    twilioRef.current.disconnect();

    navigation.pop();
  };

  const _onMuteButtonPress = () => {
    setMicEnabled((prevState) => !prevState);
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled) => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioRef.current.flipCamera();
  };

  const _onRoomDidConnect = ({ roomName, error }) => {
    console.log("onRoomDidConnect: ", roomName);

    setStatus("connected");
  };

  const _onRoomDidDisconnect = ({ roomName, error }) => {
    console.log("[Disconnect]ERROR: ", error);

    setStatus("disconnected");
  };

  const _onRoomDidFailToConnect = (error) => {
    console.log("[FailToConnect]ERROR: ", error);

    setStatus("disconnected");
  };

  const _onParticipantAddedVideoTrack = ({ participant, track }) => {
    console.log("onParticipantAddedVideoTrack: ", participant, track);

    setParticipantUser(participant.identity);
    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          { participantSid: participant.sid, videoTrackSid: track.trackSid },
        ],
      ])
    );
  };

  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    console.log("onParticipantRemovedVideoTrack: ", participant, track);

    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);

    setVideoTracks(videoTracksLocal);
  };

  const _onDisableVideoButtonPress = () => {
    twilioRef.current
      .setLocalVideoEnabled(!videoEnabled)
      .then((isEnabled) => setVideoEnabled(isEnabled));
  };

  return (
    <View style={styles.container}>
      {console.log("Check the status of the here - ", status)}
      {/* Receipent Screen */}
      {status === "connected" || status === "connecting" ? (
        !participantUser ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text
              style={{
                fontSize: RFValue(16),
                fontFamily: "PoppinsMedium",
                color: colors.borderLight,
                width: wp(70),
                textAlign: "center",
              }}
            >
              Please wait while psychologist connects !
            </Text>

            {/* Call Buttons */}
            <View style={{ position: "absolute", bottom: hp(10) }}>
              <View style={styles.callButtons}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.callButton}
                  onPress={_onEndButtonPress}
                >
                  <MaterialIcons name="call-end" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.receiverContainer}>
            {status === "connected" && (
              <View style={styles.remoteGrid}>
                {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                  return (
                    <TwilioVideoParticipantView
                      style={styles.remoteVideo}
                      key={trackSid}
                      trackIdentifier={trackIdentifier}
                    />
                  );
                })}
                <TwilioVideoLocalView
                  enabled={true}
                  style={styles.localVideo}
                />
                <View style={styles.callDetailSection}>
                  {/* Call Details Section */}
                  <View style={styles.callDetail}>
                    <>
                      <Text style={styles.callDetailText}>
                        {route?.params?.user?.username}
                      </Text>

                      {/* Sized Box */}
                      <View style={{ height: hp(1) }} />

                      {/* <Text
                          style={{
                            ...styles.callDetailText,
                            fontSize: RFValue(14),
                          }}
                        >
                          09:12
                        </Text> */}
                    </>
                  </View>

                  {/* Call Buttons */}
                  <View style={styles.callButtons}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                        ...styles.callButton,
                        backgroundColor: "white",
                      }}
                      onPress={_onMuteButtonPress}
                    >
                      <Feather
                        name={micEnabled ? "mic" : "mic-off"}
                        size={20}
                        color={micEnabled ? "black" : "grey"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                        ...styles.callButton,
                        backgroundColor: "white",
                      }}
                      onPress={_onFlipButtonPress}
                    >
                      <AntDesign name="reload1" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                        ...styles.callButton,
                        backgroundColor: "white",
                      }}
                      onPress={() => {
                        setVideoEnabled((prevState) => !prevState);
                        _onDisableVideoButtonPress();
                      }}
                    >
                      <Feather
                        name={videoEnabled ? "video" : "video-off"}
                        size={20}
                        color={videoEnabled ? "black" : "grey"}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Sized Box */}
                  <View style={{ height: hp(4) }} />

                  {/* Call Buttons */}
                  <View style={styles.callButtons}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.callButton}
                      onPress={_onEndButtonPress}
                    >
                      <MaterialIcons name="call-end" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        )
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.loaderColor} />
        </View>
      )}

      {/* Twillio Video Parent */}
      <TwilioVideo
        ref={twilioRef}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
      />
    </View>
  );
};

export default VideoCall;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  receiverContainer: {
    // backgroundColor: "red",
    // height: hp(14),
    // width: hp(10),
    // top: hp(5),
    // left: wp(74),
    // borderRadius: hp(2),
    width: wp(100),
    height: hp(94),
  },
  remoteGrid: {
    // backgroundColor: "yellow",
    flex: 1,
  },
  remoteVideo: {
    // backgroundColor: "green",
    flex: 1,
  },
  callDetail: {
    // backgroundColor: "yellow",
    alignItems: "center",
  },
  callDetailText: {
    fontSize: RFValue(16),
    fontWeight: "600",
    color: "#fff",
  },
  callButtons: {
    // backgroundColor: "red",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    // position: "absolute",
    // zIndex: 10,
  },
  callButton: {
    backgroundColor: "#ED3C3D",
    padding: hp(2),
    borderRadius: hp(100),
    zIndex: 200,
  },
  callDetailSection: {
    // backgroundColor: "pink",
    width: "100%",
    position: "absolute",
    bottom: hp(10),
    alignSelf: "center",
    justifyContent: "center",
  },
  localVideo: {
    // backgroundColor: "red",
    // width: wp(100),
    // height: hp(90),
    position: "absolute",
    height: hp(14),
    width: hp(10),
    top: hp(5),
    left: wp(74),
    borderRadius: hp(2),
  },
});
