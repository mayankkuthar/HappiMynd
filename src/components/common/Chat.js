import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  FlatList,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Ionicons, AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import {
  GiftedChat,
  Bubble,
  Time,
  InputToolbar,
  Send,
} from "react-native-gifted-chat"; // Chat Module

// Components
import AudioCard from "../cards/AudioCard";
import DocumentCard from "../cards/DocumentCard";



export const _renderChatBubble = (props) => {
  const { navigation } = props;

  // console.log('_renderChatBubble__ ', props)
  // Prop Destructuring
  const { currentMessage, position = "right" } = props;

  const isSent = position === "right";

  if (currentMessage.user.fileType === "audio") {
    const { user } = currentMessage;
    return <AudioCard user={user} />;
  }

  if (currentMessage.user.fileType === "document") {
    const { user, createdAt } = currentMessage;
    return <DocumentCard user={user} />;
  }

  return (
    <View
      style={[
        styles.bubbleWrapper,
        isSent ? styles.bubbleWrapperSent : styles.bubbleWrapperReceived,
      ]}
    >
      <Image
        source={
          isSent
            ? require("../../assets/images/sent_message.png")
            : require("../../assets/images/received_message.png")
        }
        resizeMode="cover"
        style={[
          styles.bubbleBgImage,
          isSent ? styles.bubbleBgImageSent : styles.bubbleBgImageReceived,
        ]}
      />
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#E6DFFF",
            marginLeft: "22%",
            borderRadius: 12,
            paddingHorizontal: hp(1.5),
            paddingTop: hp(1.2),
            paddingBottom: hp(1),
            marginBottom: hp(1),
          },
          left: {
            backgroundColor: "#FFFFFF",
            marginRight: "14%",
            borderRadius: 12,
            paddingHorizontal: hp(1.5),
            paddingTop: hp(1.2),
            paddingBottom: hp(1),
            marginBottom: hp(1),
          },
        }}
        textStyle={{
          right: { color: "#17151D", fontFamily: "Poppins", fontSize: RFValue(12), },
          left: { color: "#17151D", fontFamily: "Poppins", fontSize: RFValue(12),},
        }}
        tickStyle={{ color: "#17151D" }}
      />
    </View>
  );
};

export const _renderBubbleTime = (props) => {
  return (
    <Time
      {...props}
      timeTextStyle={{
        left: {
          color: "#ffffff", // White
        },
        right: {
          color: "#A4B7B6", // Grey
        },
      }}
    />
  );
};

const styles = StyleSheet.create({
  bubbleWrapper: {
    position: "relative",
  },
  bubbleWrapperSent: {
    marginRight: "8%",
  },
  bubbleWrapperReceived: {
    marginLeft: "8%",
  },
  bubbleBgImage: {
    position: "absolute",
    top: 0,
    width: hp(4.5),
    height: hp(3),
    resizeMode: "cover",
  },
  bubbleBgImageSent: {
    right: -20,
  },
  bubbleBgImageReceived: {
    left: -20,
  },
  chatAddButton: {
    backgroundColor: "#4CA6A8",
    width: hp(6),
    height: hp(6),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: hp(100),
  },
  
  // bubbleContainer: {
  //   backgroundColor: colors.primary,
  //   paddingHorizontal: hp(2),
  //   paddingVertical: hp(2),
  //   borderRadius: hp(2),
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   marginBottom: hp(1),
  // },
  // bubbleText: {
  //   fontSize: RFValue(12),
  //   fontFamily: "Poppins",
  // },
  // chatDownloadButton: {
  //   borderWidth: 1,
  //   borderColor: colors.borderDark,
  //   borderRadius: hp(100),
  //   paddingHorizontal: hp(1),
  //   paddingVertical: hp(1),
  // },
});
