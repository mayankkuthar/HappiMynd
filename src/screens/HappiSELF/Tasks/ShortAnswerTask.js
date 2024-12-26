import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Components
import TaskScreenHeader from "./TaskScreenHeader";

// Context
import { Hcontext } from "../../../context/Hcontext";
import { colors } from "../../../assets/constants";

const ShortAnswerTask = (props) => {
  // Prop Destructuring
  const { question, completeTask, setIsCorrectOption, navigation } = props;

  // Context Variables
  const { happiSelfState, happiSelfDispatch } = useContext(Hcontext);

  // Mounting
  useEffect(() => {
    console.log("check the suer is here  - ", question);
    if (happiSelfState.activeTaskAnswer) {
      completeTask(question.id);
      setIsCorrectOption(true);
    }
    return () => {
      setIsCorrectOption(false);
    };
  }, [happiSelfState.activeTaskAnswer]);

  useEffect(() => {}, []);

  // // Focus Effect
  // useFocusEffect(
  //   useCallback(() => {
  //     console.log("check the suer is here  - ", question);
  //     completeTask(question.id);
  //     setIsCorrectOption(true);
  //     return () => {
  //       setIsCorrectOption(false);
  //     };
  //   }, [])
  // );

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        {/* Screen Header */}
        <TaskScreenHeader
          title="Exercise"
          subTitle="Please complete this activity to move to next activity"
          navigation={navigation}
        />

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        {/* Question Box */}
        <View style={styles.questionContainer}>
          <Text style={styles.contentDescription}>{question.content}</Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <TextInput
            style={styles.shortInput}
            numberOfLines={10}
            multiline={true}
            placeholder="Type your answer here ..."
            value={happiSelfState.activeTaskAnswer}
            onChangeText={(text) =>
              happiSelfDispatch({
                type: "SET_ACTIVE_TASK_ANSWER",
                payload: text,
              })
            }
          />
        </View>
        {/* Sized Box */}
        <View style={{ height: hp(16) }} />
      </KeyboardAwareScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red",
    paddingHorizontal: hp(4),
    flex: 1,
  },
  questionContainer: {
    backgroundColor: "#F3FEFE",
    paddingHorizontal: hp(2),
    paddingVertical: hp(2),
    borderRadius: hp(2),
  },
  contentDescription: {
    fontSize: RFValue(16),
    fontFamily: "PoppinsMedium",
    textAlign: "justify",
  },
  shortInput: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: hp(1),
    height: hp(16),
    textAlignVertical: "top",
    paddingHorizontal: hp(1),
    paddingVertical: hp(1),
  },
});

export default ShortAnswerTask;
