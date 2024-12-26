import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Linking,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Ionicons, FontAwesome, AntDesign, Feather } from "@expo/vector-icons";
import {
  GiftedChat,
  InputToolbar,
  Send,
  Bubble,
} from "react-native-gifted-chat"; // Chat Module
import {
  addDoc,
  orderBy,
  query,
  onSnapshot,
  collection,
  where,
} from "firebase/firestore";
import moment from "moment";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { Audio } from "expo-av";
// import { usePermissions } from "expo-permissions";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";
import { db } from "../../context/Firebase";

// Components
import LanguageModal from "../../components/Modals/LanguageModal";
import DocumentUploadModal from "../../components/Modals/DocumentUploadModal";
import {
  _renderBubbleTime,
  _renderChatBubble,
} from "../../components/common/Chat";
import AudioCard from "../../components/cards/AudioCard";
import DocumentCard from "../../components/cards/DocumentCard";

const ChatNote = (props) => {
  // Prop Destructuring
  const {} = props;

  return (
    <View style={styles.noteContainer}>
      <Text style={styles.noteText}>
        Share your emotions, feelings & thoughts here & let your expert Buddy
        answer & guide you.
      </Text>
      {/* Sized Box */}
      <View style={{ height: hp(1) }} />
      <Text style={styles.noteSubText}>
        Note- This is not a real time conversation. You may have to wait for the
        expert Buddy to get back to you
      </Text>
    </View>
  );
};

const Header = (props) => {
  // Context Variables
  const { getLanguages, assignPsychologist } = useContext(Hcontext);

  // Prop Destructuring
  const {
    navigation,
    fetchPsycologist,
    showLanguageModal,
    setShowLanguageModal,
  } = props;

  return (
    <View style={styles.headerContainer}>
      <LanguageModal
        navigation={navigation}
        showModal={showLanguageModal}
        setShowModal={setShowLanguageModal}
        fetchPsycologist={fetchPsycologist}
      />
      <View style={styles.headerBox}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          // style={{ backgroundColor: "red" }}
        >
          <Ionicons name="ios-chevron-back" size={hp(4)} color="black" />
        </TouchableOpacity>
        <Text style={styles.chatPersonTitle}>BUDDY</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowLanguageModal(true)}
        >
          <Image
            style={styles.chatHeaderAction}
            source={require("../../assets/images/chat_language.png")}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ChatFooter = (props) => {
  // Prop Destructuring
  // const {} = props;

  return (
    <View style={styles.chatFooterContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.chatAddButton}
        onPress={() => {}}
      >
        <AntDesign name="plus" size={hp(3)} color="#fff" />
      </TouchableOpacity>

      {/* Chat Text Area */}
      <View style={styles.chatTextArea}>
        <TextInput style={styles.chatInput} placeholder="Type a message" />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.chatIconContainer}
          onPress={() => {}}
        >
          <Ionicons
            name="mic-outline"
            size={hp(3)}
            color={colors.borderLight}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.chatIconContainer}
          onPress={() => {}}
        >
          <Feather name="send" size={hp(2.8)} color={colors.borderLight} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HappiBUDDYChat = (props) => {
  // Permissions
  // const [permission, askForPermission] = usePermissions(
  //   Permissions.AUDIO_RECORDING,
  //   { ask: true }
  // );

  // Context Variables
  const {
    authState,
    snackState,
    snackDispatch,
    assignPsychologist,
    currentlyAssignedPsycologist,
    changePsychologist,
    sendMsgToPsy,
    clearMessageBatch,
    sendChatNotification,
    fileUploadFirebase,
    screenTrafficAnalytics,
  } = useContext(Hcontext);

  // Prop Destructuring
  const { navigation } = props;
  const { assignedPsy = "", group = "" } = props.route.params;

  // State Variables
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [messages, setMessages] = useState([]); // Chat Message
  const [receiverPsy, setReceiverPsy] = useState(assignedPsy);
  const [senderUser, setSenderUser] = useState(authState.user.user.id + "_u");
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [groupId, setGroupId] = useState(group);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState(null);
  const [customText, setCustomText] = useState("");
  const [startAudio, setStartAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recording, setRecording] = useState(null);
  const [filePath, setFilePath] = useState("");
  const [audioLoading, setAudioLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mounting
  useEffect(() => {
    // getDownloadableFile();
    screenTrafficAnalytics({ screenName: "HappiBUDDY Chatting Screen" });
    return () => clearMessages();
  }, []);

  const clearMessages = async () => {
    try {
      const messageRes = await clearMessageBatch();
      console.log("check the message clear - ", messageRes);
    } catch (err) {
      console.log("Some issuw while clearing messages - ", err);
    }
  };

  const getDownloadableFile = (file) => {
    const storage = getStorage();
    getDownloadURL(ref(storage, file))
      .then((url) => {
        console.log("check the dowanloadable file - ", url);
        Linking.openURL(url);
        // // `url` is the download URL for 'images/stars.jpg'

        // // This can be downloaded directly:
        // const xhr = new XMLHttpRequest();
        // xhr.responseType = 'blob';
        // xhr.onload = (event) => {
        //   const blob = xhr.response;
        // };
        // xhr.open('GET', url);
        // xhr.send();

        // Or inserted into an <img> element
        // const img = document.getElementById('myimg');
        // img.setAttribute('src', url);
      })
      .catch((error) => {
        // Handle any errors
      });
  };

  // Mounting & Updating
  useLayoutEffect(() => {
    const collectionRef = collection(db, "chats");
    const q = query(
      collectionRef,
      where("groupId", "==", groupId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Mapping through messages
      const messageList = snapshot.docs.map((doc) => {
        // console.log("The received snapshot - ", doc.data());
        // const senderUser = authState.user.user.id + "_u";
        // if (
        //   (senderUser == doc.data().senderId &&
        //     receiverPsy == doc.data().receiverId) ||
        //   (receiverPsy == doc.data().senderId &&
        //     senderUser == doc.data().receiverId)
        // )
        return {
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        };
        // else return null;
      });

      // Setting message state
      setMessages(messageList.filter((message) => message));
      setLoading(false);
    });

    console.log("Chekc the receicer psy - ", receiverPsy);

    return () => unsubscribe();
  }, []);

  // Assigning a Psycologist
  const fetchPsycologist = async (language) => {
    try {
      const psycologist = await changePsychologist({ language });

      console.log("The fetched selected psycologist - ", psycologist);

      if (psycologist.status === "success") {
        setGroupId(psycologist.group_id);
        setReceiverPsy(psycologist.psychologist_detail.id + "_p");
        snackDispatch({
          type: "SHOW_SNACK",
          payload: "Your Buddy is waiting for you.",
        });
      }
    } catch (err) {
      console.log("Some issue while asigning psycologist - ", err);
    }
  };

  const startRecording = async () => {
    try {
      // console.log("Requesting permissions..");
      // // await Audio.requestPermissionsAsync();
      // await Audio.setAudioModeAsync({
      //   allowsRecordingIOS: true,
      //   interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      //   playsInSilentModeIOS: true,
      //   shouldDuckAndroid: true,
      //   interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      // });
      // console.log("Starting recording..");
      // const { recording } = await Audio.Recording.createAsync(
      //   Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      // );
      // setRecording(recording);
      // console.log("Recording started");

      await Audio.requestPermissionsAsync();
      const rec = new Audio.Recording();
      setRecording(rec);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });
      // await rec.prepareToRecordAsync(
      //   Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      // );
      await rec.prepareToRecordAsync({
        android: {
          extension: ".mp4",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          ...Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY.ios,
          extension: ".wav",
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
          sampleRate: 16000,
          bitRateStrategy:
            Audio.RECORDING_OPTION_IOS_BIT_RATE_STRATEGY_CONSTANT,
        },
      });
      await rec.startAsync();
      const recs = await rec.getStatusAsync();
      console.log("the rec status", recs);
      // You are now recording!
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    console.log("Stopping recording..");
    setRecording(null);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    const mediaName = uri.split("/")[uri.split("/").length - 1];
    setFilePath({ uri });
    setFileName(mediaName);
    setCustomText(mediaName);
    setFileType("audio");
    console.log("Recording stopped and stored at", uri);
  };

  const playSound = async () => {
    try {
      console.log("Loading Sound", filePath);

      if (filePath) {
        const { sound } = await Audio.Sound.createAsync(filePath);

        setIsPlaying(true);

        // Playing the sound
        const { durationMillis } = await sound.playAsync();

        // Stop playing state after audio completes
        setTimeout(() => setIsPlaying(false), durationMillis);
      }
    } catch (err) {
      console.log("Some issue while playing sound - ", err);
    }
  };

  // const stopSound = async () => {
  //   try {
  //     if (filePath) {
  //       const { sound } = await Audio.Sound.createAsync(filePath, {
  //         shouldPlay: false,
  //       });
  //       const result = await sound.stopAsync();
  //       console.log("UnLoading Sound", sound);

  //       setIsPlaying(false);

  //       // Playing the sound
  //       // const stopRes = await sound.stopAsync();

  //       // // Stop playing state after audio completes
  //       // setTimeout(() => setIsPlaying(false), durationMillis);
  //     }
  //   } catch (err) {
  //     console.log("Some issue while stopping sound - ", err);
  //   }
  // };

  // Handles mic icon click
  const audioHandler = () => {
    try {
      if (startAudio) {
        stopRecording();
        setStartAudio(false);
      } else {
        startRecording();
        setStartAudio(true);
      }
    } catch (err) {
      console.log("Some issue while handling audio - ", err);
    }
  };

  // Removes the recorded audio
  const removeAudio = () => {
    setStartAudio(false);
    setIsPlaying(false);
    setRecording(null);
    setFilePath("");
    setFileType(null);
    setFileName("");
    setCustomText("");
  };

  // Chat Send Action
  const onSend = async (messages = []) => {
    try {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
      const { _id, createdAt, text, user } = messages[0];

      addDoc(collection(db, "chats"), {
        _id,
        createdAt,
        text,
        user,
        receiverId: receiverPsy,
        senderId: senderUser,
        fileName,
        fileType,
        groupId,
      });

      const messageRes = await sendMsgToPsy({
        groupId,
        psyId: receiverPsy.substring(0, receiverPsy.length - 2),
        message: text,
      });
      console.log("check the message clear - ", messageRes);

      if (filePath) {
        fileUploadFirebase(filePath.uri);
        setFileName("");
        removeAudio();
      }
      if (recording) removeAudio();
    } catch (err) {
      console.log("Sending message error - ", err);
    }
  };

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="small" color={colors.loaderColor} />
      </View>
    );

  const _renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "white",
          borderTopColor: "#E8E8E8",
          marginHorizontal: wp(3),
          alignItems: "center",
          justifyContent: "center",
          // padding: 8,
        }}
        renderActions={() => (
          <View
            style={{
              backgroundColor: "#E4FDFE",
              paddingRight: wp(2),
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.chatAddButton}
              onPress={() => setShowDocumentModal(true)}
            >
              <AntDesign name="plus" size={hp(3)} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        renderSend={(props) => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {fileType === "audio" ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={removeAudio}
                style={{ opacity: isPlaying ? 0.5 : 1 }}
                disabled={isPlaying}
              >
                <FontAwesome name="trash-o" size={hp(3)} color="red" />
              </TouchableOpacity>
            ) : null}
            {fileType === "audio" ? (
              <>
                <View style={{ width: wp(4.5) }} />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => (isPlaying ? null : playSound())}
                  style={{ opacity: isPlaying ? 0.5 : 1 }}
                  disabled={isPlaying}
                >
                  <FontAwesome
                    name={isPlaying ? "play" : "play"}
                    size={hp(3)}
                    color={colors.borderLight}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={{ width: wp(4) }} />
                <TouchableOpacity activeOpacity={0.7} onPress={audioHandler}>
                  <Ionicons
                    name="mic-outline"
                    size={hp(3)}
                    color={startAudio ? "red" : colors.borderLight}
                  />
                </TouchableOpacity>
              </>
            )}
            <Send {...props}>
              <View style={styles.chatIconContainer}>
                <Feather
                  name="send"
                  size={hp(2.8)}
                  color={colors.borderLight}
                />
              </View>
              <View style={{ height: hp(1) }} />
            </Send>
          </View>
        )}
      />
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <Header
        navigation={navigation}
        fetchPsycologist={fetchPsycologist}
        showLanguageModal={showLanguageModal}
        setShowLanguageModal={setShowLanguageModal}
      />
      <ChatNote />

      <GiftedChat
        text={customText}
        onInputTextChanged={(text) => setCustomText(text)}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: authState?.user?.user?.id + "_u", // Adding _u for distinction b/w user & phsycologist
          name: authState?.user?.user?.username,
          fileName,
          fileType,
        }}
        onLongPress={(context, message) => {
          if (message?.user?.fileName)
            getDownloadableFile(message.user.fileName);
        }}
        renderBubble={_renderChatBubble}
        renderTime={_renderBubbleTime}
        // renderAvatar={() => null}
        renderInputToolbar={_renderInputToolbar}
        alwaysShowSend
      />

      <View style={{ height: hp(1) }} />

      <DocumentUploadModal
        showModal={showDocumentModal}
        setShowModal={setShowDocumentModal}
        setFileName={setFileName}
        setFilePath={setFilePath}
        setFileType={setFileType}
        setCustomText={setCustomText}
      />
      {/* <ChatFooter /> */}
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  headerContainer: {
    backgroundColor: colors.background,
    width: wp(100),
    height: hp(14),
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: hp(2),
    justifyContent: "space-between",
  },
  headerBox: {
    // backgroundColor: "yellow",
    width: wp(100),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatPersonTitle: {
    fontSize: RFValue(16),
    fontFamily: "Poppins",
  },
  chatHeaderAction: {
    // backgroundColor: "green",
    width: hp(4),
    height: hp(4),
  },
  chatFooterContainer: {
    // backgroundColor: "red",
    position: "absolute",
    bottom: 0,
    paddingHorizontal: wp(6),
    paddingVertical: hp(2),
    width: wp(100),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chatAddButton: {
    backgroundColor: "#4CA6A8",
    width: hp(6),
    height: hp(6),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: hp(100),
  },
  chatTextArea: {
    backgroundColor: "#fff",
    width: wp(74),
    height: hp(6),
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderDim,
    paddingHorizontal: hp(1),
    flexDirection: "row",
  },
  chatInput: {
    // backgroundColor: "green",
    // height: "100%",
    flex: 1,
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
  chatIconContainer: {
    // backgroundColor: "yellow",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: hp(0.3),
  },
  noteContainer: {
    backgroundColor: "#FBFFE1",
    width: wp(85),
    alignSelf: "center",
    paddingVertical: hp(2),
    paddingHorizontal: hp(2),
    borderRadius: 8,
  },
  noteText: {
    fontSize: RFValue(10),
    fontFamily: "PoppinsMedium",
    textAlign: "center",
  },
  noteSubText: {
    fontSize: RFValue(8),
    fontFamily: "PoppinsMedium",
    color: "#3E3A3A",
  },
  bubbleContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: hp(2),
    paddingVertical: hp(2),
    borderRadius: hp(2),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(1),
  },
  bubbleText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
  chatDownloadButton: {
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: hp(100),
    paddingHorizontal: hp(1),
    paddingVertical: hp(1),
  },
});

export default HappiBUDDYChat;
