import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useLayoutEffect,
  useRef,
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
} from "react-native-gifted-chat";
import {
  addDoc,
  orderBy,
  query,
  onSnapshot,
  collection,
  where,
} from "firebase/firestore";
import moment from "moment";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

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

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const MAX_RECORDING_SECONDS = 30;

// Module-level tracker: only ONE audio plays at a time across all AudioBubble instances.
// When a new bubble starts playing, it stops whatever was previously playing.
const activeSoundRef = { current: null, setPlaying: null };

const ChatNote = () => (
  <View style={styles.noteContainer}>
    <Text style={styles.noteText}>
      Share your emotions, feelings & thoughts here & let your expert Buddy
      answer & guide you.
    </Text>
    <View style={{ height: hp(1) }} />
    <Text style={styles.noteSubText}>
      Note- This is not a real time conversation. You may have to wait for the
      expert Buddy to get back to you
    </Text>
  </View>
);

const Header = ({ navigation, fetchPsycologist, showLanguageModal, setShowLanguageModal }) => {
  const { getLanguages, assignPsychologist } = useContext(Hcontext);
  return (
    <View style={styles.headerContainer}>
      <LanguageModal
        navigation={navigation}
        showModal={showLanguageModal}
        setShowModal={setShowLanguageModal}
        fetchPsycologist={fetchPsycologist}
      />
      <View style={styles.headerBox}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()}>
          <Ionicons name="ios-chevron-back" size={hp(4)} color="black" />
        </TouchableOpacity>
        <Text style={styles.chatPersonTitle}>BUDDY</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setShowLanguageModal(true)}>
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

// ─────────────────────────────────────────────
// Inline image bubble rendered inside GiftedChat
// ─────────────────────────────────────────────
const ImageBubble = ({ base64, mimeType = "image/jpeg" }) => (
  <View style={styles.imageBubble}>
    <Image
      source={{ uri: `data:${mimeType};base64,${base64}` }}
      style={styles.inlineImage}
      resizeMode="cover"
    />
  </View>
);

// ─────────────────────────────────────────────
// Audio bubble that plays from a base64 string
// ─────────────────────────────────────────────
const AudioBubble = ({ base64, mimeType = "audio/mp4" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const soundRef = useRef(null);
  const durationTimerRef = useRef(null);

  // Stop this bubble's sound (called externally via activeSoundRef too)
  const stopThis = async () => {
    try {
      if (durationTimerRef.current) clearTimeout(durationTimerRef.current);
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (_) {}
    setIsPlaying(false);
  };

  const play = async () => {
    try {
      setLoading(true);

      // ── Stop any other bubble that is currently playing ──
      if (activeSoundRef.current && activeSoundRef.setPlaying) {
        await activeSoundRef.current();
      }

      // ── CRITICAL: switch audio mode to PLAYBACK (not recording) ──
      // After recording, expo-av leaves the session in recording mode
      // which routes audio to earpiece and often mutes speaker output.
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false, // force loudspeaker
        staysActiveInBackground: false,
      });

      // Write base64 → temp file (expo-av cannot play data URIs directly)
      const ext = mimeType.includes("mp4") || mimeType.includes("m4a") ? ".mp4" : ".wav";
      const tempUri = FileSystem.cacheDirectory + `audio_${Date.now()}${ext}`;
      await FileSystem.writeAsStringAsync(tempUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: tempUri },
        { shouldPlay: false, volume: 1.0 },
      );
      soundRef.current = sound;

      // Register this as the globally active sound
      activeSoundRef.current = stopThis;
      activeSoundRef.setPlaying = setIsPlaying;

      setIsPlaying(true);
      setLoading(false);

      const status = await sound.playAsync();
      const duration = status.durationMillis || 30000;

      // Auto-reset playing state when audio finishes
      durationTimerRef.current = setTimeout(async () => {
        setIsPlaying(false);
        if (activeSoundRef.current === stopThis) {
          activeSoundRef.current = null;
          activeSoundRef.setPlaying = null;
        }
      }, duration);
    } catch (err) {
      console.log("AudioBubble play error:", err);
      setIsPlaying(false);
      setLoading(false);
    }
  };

  const stop = async () => {
    await stopThis();
    if (activeSoundRef.current === stopThis) {
      activeSoundRef.current = null;
      activeSoundRef.setPlaying = null;
    }
  };

  return (
    <View style={styles.audioBubble}>
      {loading ? (
        <ActivityIndicator size="small" color={colors.loaderColor} />
      ) : (
        <TouchableOpacity
          style={styles.audioPlayBtn}
          onPress={isPlaying ? stop : play}
        >
          <FontAwesome
            name={isPlaying ? "stop" : "play"}
            size={hp(1.6)}
            color="black"
          />
        </TouchableOpacity>
      )}
      <View style={{ width: wp(3) }} />
      <Text style={styles.audioLabel}>🎤 Voice Message</Text>
    </View>
  );
};

// ─────────────────────────────────────────────
// Main Chat Screen
// ─────────────────────────────────────────────
const HappiBUDDYChat = (props) => {
  const {
    authState,
    snackState,
    snackDispatch,
    assignPsychologist,
    currentlyAssignedPsychologist,
    changePsychologist,
    sendMsgToPsy,
    clearMessageBatch,
    sendChatNotification,
    screenTrafficAnalytics,
  } = useContext(Hcontext);

  const { navigation } = props;
  const { assignedPsy = "", group = "" } = props.route.params;

  // ── State ──────────────────────────────────
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [receiverPsy, setReceiverPsy] = useState(assignedPsy);
  const [senderUser] = useState(authState.user.user.id + "_u");
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [groupId, setGroupId] = useState(group);

  // Media state (image or audio pending send)
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState(null);      // "image" | "audio" | null
  const [filePath, setFilePath] = useState(null);      // { uri, base64, mimeType }
  const [customText, setCustomText] = useState("");
  const [mediaSending, setMediaSending] = useState(false);

  // Audio recording state
  const [startAudio, setStartAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0); // countdown

  // Refs
  const recordingRef = useRef(null);    // always up-to-date recording object (avoids stale closure)
  const timerRef = useRef(null);        // countdown interval
  const autoStopRef = useRef(null);     // auto-stop at 30s

  const [loading, setLoading] = useState(true);

  // ── Lifecycle ──────────────────────────────
  useEffect(() => {
    screenTrafficAnalytics({ screenName: "HappiBUDDY Chatting Screen" });
    return () => {
      clearMessages();
      clearTimers();
    };
  }, []);

  const clearTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoStopRef.current) clearTimeout(autoStopRef.current);
  };

  const clearMessages = async () => {
    try {
      await clearMessageBatch();
    } catch (err) {
      console.log("Error clearing messages:", err);
    }
  };

  // ── Firestore listener ─────────────────────
  useLayoutEffect(() => {
    const collectionRef = collection(db, "chats");
    const q = query(
      collectionRef,
      where("groupId", "==", groupId),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messageList = snapshot.docs.map((doc) => {
          const data = doc.data();

          // ── Resolve media across two schemas ──────────────────────────────
          // Mobile schema:  { mediaBase64, mediaType, mediaMime }
          // Web/psy schema: { fileName: "data:image/jpeg;base64,...", fileType: "image/jpeg" }

          let resolvedBase64 = data.mediaBase64 || null;
          let resolvedType   = data.mediaType   || null;
          let resolvedMime   = data.mediaMime   || null;

          // Web schema: fileName holds the full data URI
          if (!resolvedBase64 && data.fileName && typeof data.fileName === "string"
              && data.fileName.startsWith("data:")) {
            const dataUri = data.fileName;
            // e.g. "data:image/jpeg;base64,/9j/4AAQ..."
            const commaIdx = dataUri.indexOf(",");
            if (commaIdx !== -1) {
              const header = dataUri.substring(5, commaIdx); // "image/jpeg;base64"
              resolvedBase64 = dataUri.substring(commaIdx + 1);
              resolvedMime   = header.split(";")[0] || "image/jpeg";
              resolvedType   = resolvedMime.startsWith("audio") ? "audio" : "image";
            }
          }

          return {
            _id: doc.id,
            createdAt: data.createdAt.toDate(),
            text: data.text || "",
            user: data.user,
            mediaBase64: resolvedBase64,
            mediaType:   resolvedType,
            mediaMime:   resolvedMime,
            fileName:    data.fileName || null,
          };
        });
        setMessages(messageList.filter(Boolean));
        setLoading(false);
      },
      (error) => {
        console.error("Firestore onSnapshot error:", error.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // ── Change psychologist ────────────────────
  const fetchPsycologist = async (language) => {
    try {
      const psycologist = await changePsychologist({ language });
      if (psycologist.status === "success") {
        setGroupId(psycologist.group_id);
        setReceiverPsy(psycologist.psychologist_detail.id + "_p");
        snackDispatch({ type: "SHOW_SNACK", payload: "Your Buddy is waiting for you." });
      }
    } catch (err) {
      console.log("Assign psychologist error:", err);
    }
  };

  // ── Audio Recording ────────────────────────
  const startRecording = async () => {
    try {
      const permResult = await Audio.requestPermissionsAsync();
      if (!permResult.granted) {
        console.warn("Microphone permission denied");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });

      const rec = new Audio.Recording();
      // Use the built-in HIGH_QUALITY preset — safe for expo-av 11.x
      // Individual Audio.RECORDING_OPTION_* constants don't exist in this version
      await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await rec.startAsync();

      // Store in ref so stopRecording always has the current instance (no stale closure)
      recordingRef.current = rec;
      setStartAudio(true);
      setRecordingSeconds(0);

      console.log("🎙 Recording started");

      // Live second counter
      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);

      // Auto-stop at 30 seconds
      autoStopRef.current = setTimeout(() => {
        stopRecordingFromRef();
      }, MAX_RECORDING_SECONDS * 1000);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  // Always reads from ref — no stale closure
  const stopRecordingFromRef = async () => {
    try {
      clearTimers();
      const rec = recordingRef.current;
      if (!rec) {
        console.warn("stopRecordingFromRef: no recording in ref");
        return;
      }

      recordingRef.current = null;
      setStartAudio(false);
      setRecordingSeconds(0);

      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      console.log("🎙 Recording stopped, uri:", uri);

      if (!uri) {
        console.warn("No URI from recording");
        return;
      }

      // Read audio file as base64 — matching web version's approach
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const mediaName = uri.split("/").pop();
      const mimeType = "audio/mp4"; // expo-av HIGH_QUALITY preset produces mp4 on Android

      // Reset audio mode back to playback so the recorded clip can be heard
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      setFileName(mediaName);
      setFileType("audio");
      setFilePath({ uri, base64, mimeType });
      setCustomText("🎤 Voice Message");
      console.log("🎙 Audio ready to send, size:", base64.length, "chars");
    } catch (err) {
      console.error("Failed to stop recording:", err);
    }
  };

  const audioHandler = () => {
    if (startAudio) {
      stopRecordingFromRef();
    } else {
      startRecording();
    }
  };

  const removeMedia = () => {
    setStartAudio(false);
    setIsPlaying(false);
    recordingRef.current = null;
    setFilePath(null);
    setFileType(null);
    setFileName("");
    setCustomText("");
    setRecordingSeconds(0);
    clearTimers();
  };

  // ── Send Message ───────────────────────────
  const onSend = async (newMessages = []) => {
    try {
      setMediaSending(true);

      setMessages((prev) => GiftedChat.append(prev, newMessages));
      const { _id, createdAt, text, user } = newMessages[0];

      // Build data URI the same way the web app stores it
      // Web schema: fileName = "data:<mime>;base64,<data>", fileType = "<mime>"
      const webFileName = filePath?.base64
        ? `data:${filePath.mimeType || "image/jpeg"};base64,${filePath.base64}`
        : fileName || null;
      const webFileType = filePath?.mimeType || null;

      const chatDoc = {
        _id,
        createdAt,
        text: text || "",
        user,
        receiverId: receiverPsy,
        senderId: senderUser,
        groupId,
        // ── Mobile schema (read by this app) ──────────────────────────────
        mediaBase64: filePath?.base64 || null,
        mediaType:   fileType || null,
        mediaMime:   filePath?.mimeType || null,
        // ── Web schema (read by psychologist's web app) ───────────────────
        fileName:  webFileName,
        fileType:  webFileType,
      };

      await addDoc(collection(db, "chats"), chatDoc);

      // Also notify the backend API
      await sendMsgToPsy({
        groupId,
        psyId: receiverPsy.substring(0, receiverPsy.length - 2),
        message: text || (fileType === "image" ? "[Image]" : "[Voice Message]"),
      });

      removeMedia();
    } catch (err) {
      console.log("Send message error:", err);
    } finally {
      setMediaSending(false);
    }
  };

  // ── Render media inside message bubble ─────
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (!currentMessage?.mediaBase64) return null;

    if (currentMessage.mediaType === "image") {
      return (
        <ImageBubble
          base64={currentMessage.mediaBase64}
          mimeType={currentMessage.mediaMime || "image/jpeg"}
        />
      );
    }

    if (currentMessage.mediaType === "audio") {
      return (
        <AudioBubble
          base64={currentMessage.mediaBase64}
          mimeType={currentMessage.mediaMime || "audio/mp4"}
        />
      );
    }

    return null;
  };

  // ── Input toolbar ──────────────────────────
  const _renderInputToolbar = (toolbarProps) => {
    const secsLeft = MAX_RECORDING_SECONDS - recordingSeconds;

    return (
      <InputToolbar
        {...toolbarProps}
        containerStyle={styles.inputToolbar}
        renderActions={() => (
          <View style={styles.inputActionsBox}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.chatAddButton}
              onPress={() => setShowDocumentModal(true)}
              disabled={startAudio}
            >
              <AntDesign name="plus" size={hp(3)} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        renderSend={(sendProps) => (
          <View style={styles.sendRow}>
            {/* ── Audio mode: show countdown, trash, play preview ── */}
            {fileType === "audio" ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={removeMedia}
                  style={{ marginRight: wp(2) }}
                >
                  <FontAwesome name="trash-o" size={hp(3)} color="red" />
                </TouchableOpacity>
                <Text style={styles.audioPreviewLabel}>🎤 Ready</Text>
              </>
            ) : startAudio ? (
              // ── Recording in progress: countdown ──
              <TouchableOpacity activeOpacity={0.7} onPress={audioHandler}>
                <View style={styles.recordingPill}>
                  <View style={styles.recordingDot} />
                  <Text style={styles.recordingTimer}>{secsLeft}s</Text>
                </View>
              </TouchableOpacity>
            ) : fileType === "image" ? (
              // ── Image selected: show trash ──
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={removeMedia}
                style={{ marginRight: wp(2) }}
              >
                <FontAwesome name="trash-o" size={hp(3)} color="red" />
              </TouchableOpacity>
            ) : (
              // ── Default mic button ──
              <TouchableOpacity activeOpacity={0.7} onPress={audioHandler}>
                <Ionicons
                  name="mic-outline"
                  size={hp(3)}
                  color={colors.borderLight}
                  style={{ marginRight: wp(2) }}
                />
              </TouchableOpacity>
            )}

            {/* Send button */}
            <Send {...sendProps} disabled={mediaSending}>
              <View style={styles.chatIconContainer}>
                {mediaSending ? (
                  <ActivityIndicator size="small" color={colors.borderLight} />
                ) : (
                  <Feather name="send" size={hp(2.8)} color={colors.borderLight} />
                )}
              </View>
            </Send>
          </View>
        )}
      />
    );
  };

  // ── Loading state ──────────────────────────
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={colors.loaderColor} />
      </View>
    );
  }

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
        onInputTextChanged={(t) => setCustomText(t)}
        messages={messages}
        onSend={(msgs) => onSend(msgs)}
        user={{
          _id: authState?.user?.user?.id + "_u",
          name: authState?.user?.user?.username,
        }}
        renderBubble={_renderChatBubble}
        renderTime={_renderBubbleTime}
        renderInputToolbar={_renderInputToolbar}
        renderCustomView={renderCustomView}
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
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
    width: hp(4),
    height: hp(4),
  },
  inputToolbar: {
    backgroundColor: "white",
    borderTopColor: "#E8E8E8",
    marginHorizontal: wp(3),
    alignItems: "center",
    justifyContent: "center",
  },
  inputActionsBox: {
    backgroundColor: "#E4FDFE",
    paddingRight: wp(2),
  },
  chatAddButton: {
    backgroundColor: "#4CA6A8",
    width: hp(6),
    height: hp(6),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: hp(100),
  },
  sendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: wp(1),
  },
  chatIconContainer: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: hp(0.5),
    minWidth: hp(4),
  },
  // Recording countdown pill
  recordingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE8E8",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: 20,
    marginRight: wp(2),
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
    marginRight: 5,
  },
  recordingTimer: {
    fontSize: RFValue(11),
    fontFamily: "PoppinsMedium",
    color: "red",
  },
  audioPreviewLabel: {
    fontSize: RFValue(11),
    fontFamily: "Poppins",
    color: "#555",
    marginRight: wp(2),
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
  // Image in bubble
  imageBubble: {
    borderRadius: 10,
    overflow: "hidden",
    margin: 4,
  },
  inlineImage: {
    width: wp(55),
    height: hp(22),
    borderRadius: 10,
  },
  // Audio in bubble
  audioBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary || "#E4FDFE",
    paddingHorizontal: hp(1.5),
    paddingVertical: hp(1.2),
    borderRadius: 10,
    margin: 4,
  },
  audioPlayBtn: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: hp(100),
    paddingHorizontal: hp(1.2),
    paddingVertical: hp(1),
  },
  audioLabel: {
    fontSize: RFValue(11),
    fontFamily: "Poppins",
    color: "#333",
  },
});

export default HappiBUDDYChat;
