import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Feather, AntDesign } from "@expo/vector-icons";

// Context
import { Hcontext } from "../../context/Hcontext";
import { colors } from "../../assets/constants";

const MessageNotifies = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { currentlyAssignedPsycologist } = useContext(Hcontext);

  //   State Varibales
  const [assignedPsy, setAssignedPsy] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [unreadMessage, setUnreadMessage] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setTimeout(() => {
        checkCurrentPsycologist();
      }, 1000);
    });

    return unsubscribe;
  }, []);

  // CHeck the previously assigned psycologist to continue with
  const checkCurrentPsycologist = async () => {
    try {
      const currentPsy = await currentlyAssignedPsycologist();
      console.log("The current psycoligist - ",
      //  currentPsy
       );
      if (currentPsy.status === "success") {
        setUnreadMessage(currentPsy.user_unread_message);
        setAssignedPsy(currentPsy.psychologist_detail.id + "_p");
        setGroupId(currentPsy.group_id);
      } else {
        setUnreadMessage(0);
        setAssignedPsy(null);
        setGroupId(null);
      }
    } catch (err) {
      console.log("Some issue while checking current psycologist - ", err);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{ display: assignedPsy ? "flex" : "none" }}
      onPress={() => {
        navigation.push("HappiBUDDYChat", {
          assignedPsy: assignedPsy,
          group: groupId,
        });
      }}
    >
      <ImageBackground
        source={require("../../assets/images/session_background.png")}
        resizeMode="cover"
        style={styles.messageContainer}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.messageText}>Continue HappiBUDDY Session</Text>
          <Image
            source={require("../../assets/images/message_icon.png")}
            resizeMode="contain"
            style={{ height: hp(5), width: hp(5) }}
          />
        </View>
        {unreadMessage > 0 ? (
          <View style={styles.unreadContainer}>
            <Text
              style={{
                fontSize: RFValue(12),
                fontFamily: "PoppinsMedium",
                color: "#fff",
              }}
            >
              {unreadMessage}
            </Text>
          </View>
        ) : null}
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default MessageNotifies;

const styles = StyleSheet.create({
  messageContainer: {
    // backgroundColor: "red",
    backgroundColor: colors.background,
    height: hp(8),
    width: wp(90),
    alignSelf: "center",
    borderRadius: hp(4),
    // alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(6),
    marginBottom: hp(2),
  },
  messageText: {
    // backgroundColor: "yellow",
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    width: wp(65),
  },
  unreadContainer: {
    position: "absolute",
    backgroundColor: "red",
    top: -hp(1),
    right: -hp(1),
    height: hp(3),
    width: hp(3),
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: hp(1),
    // paddingVertical: hp(0.5),
    borderRadius: hp(100),
  },
});
