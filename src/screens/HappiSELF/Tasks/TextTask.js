import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

// Components
import TaskScreenHeader from "./TaskScreenHeader";

// Context
import { Hcontext } from "../../../context/Hcontext";
import { colors } from "../../../assets/constants";

const TextTask = (props) => {
  // Prop Destructuring
  const { question, completeTask, setIsCorrectOption, navigation } = props;

  // Context Variables
  const { happiSelfState } = useContext(Hcontext);

  // Mounting
  useEffect(() => {
    completeTask(question.id);
    setIsCorrectOption(true);
    return () => {
      setIsCorrectOption(false);
    };
  }, [question]);
  // // Hits when focus hits
  // useFocusEffect(() => {
  //   console.log("Mounted Text Task Screen", question);
  //   // const timer = setTimeout(() => {
  //   //   completeTask(question.id);
  //   //   setIsCorrectOption(true);
  //   // }, 2000);
  // });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Screen Header */}
      <TaskScreenHeader
        title="Exercise"
        subTitle="Text Reading"
        navigation={navigation}
      />

      {/* Sized Box */}
      <View style={{ height: hp(4) }} />

      {/* Question Box */}
      <View style={styles.questionContainer}>
        <Text style={styles.contentTitle}>{question.title}</Text>
        <Text style={styles.contentDescription}>{question.content}</Text>
      </View>

      {/* Sized Box */}
      <View style={{ height: hp(10) }} />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: hp(4),
  },
  questionContainer: {
    backgroundColor: "#F3FEFE",
    paddingHorizontal: hp(2),
    paddingVertical: hp(2),
    borderRadius: hp(2),
  },
  questionText: {
    fontSize: RFValue(16),
    fontFamily: "PoppinsMedium",
    textAlign: "justify",
  },
  contentTitle: {
    fontSize: RFValue(15),
    fontFamily: "PoppinsMedium",
    textAlign: "justify",
  },
  contentDescription: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    textAlign: "justify",
  },
});

export default TextTask;
