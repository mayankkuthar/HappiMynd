import React from "react";
import {
  StyleSheet,
  Text,
  View,
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

// Constants
import { colors } from "../../assets/constants";

// Components
import AudioCard from "../cards/AudioCard";
import DocumentCard from "../cards/DocumentCard";



export const _renderChatBubble = (props) => {
  const { navigation } = props;




  // console.log('_renderChatBubble__ ', props)
  // Prop Destructuring
  const { currentMessage } = props;

  

  if (currentMessage.user.fileType === "audio") {
    const { user } = currentMessage;
    return <AudioCard user={user} />;
  }

  if (currentMessage.user.fileType === "document") {
    const { user, createdAt } = currentMessage;
    return <DocumentCard user={user} />;
  }




  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: colors.senderBubble,
          shadowColor: colors.borderLight,
          shadowOffset: { width: wp(0.5), height: hp(0.1) },
          shadowRadius: hp(1),
          shadowOpacity: 0.5,
          paddingHorizontal: hp(1),
          marginBottom: hp(1),
          elevation: 5,
        },
        left: {
          backgroundColor: colors.receiverBubble,
          shadowColor: colors.borderLight,
          shadowOffset: { width: wp(0.5), height: hp(0.1) },
          shadowRadius: hp(1),
          shadowOpacity: 0.5,
          paddingHorizontal: hp(1),
          marginBottom: hp(1),
          elevation: 5,
        },
      }}
      textStyle={{
        right: { color: "#2B2E2E", fontFamily: "Poppins", fontSize: RFValue(12), },
        left: { color: "#fff", fontFamily: "Poppins", fontSize: RFValue(12),},
      }}
    />
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
