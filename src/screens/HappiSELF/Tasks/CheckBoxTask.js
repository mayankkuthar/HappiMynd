import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Components
import TaskScreenHeader from "./TaskScreenHeader";

// Context
import { Hcontext } from "../../../context/Hcontext";
import { colors } from "../../../assets/constants";

// Components
import MultiCheckbox from "../../../components/input/MultiCheckbox";

const CheckBoxTask = (props) => {
  // Prop Destructuring
  const {
    question: { content, option },
    completeTask,
    setIsCorrectOption,
    navigation,
  } = props;

  // Context Variables
  const { happiSelfState, happiSelfDispatch } = useContext(Hcontext);

  // State Variables
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Mounting
  useEffect(() => {
    return () => {
      setIsCorrectOption(false);
    };
  }, []);

  // Triggers when selected option changes
  useEffect(() => {
    console.log("Mounted MCQ Screen", selectedOptions);
    if (selectedOptions.length) {
      completeTask(props.question.id);
      setIsCorrectOption(true);
    }
  }, [selectedOptions]);

  return (
    <View style={styles.container}>
      <TaskScreenHeader
        title="Exercise"
        subTitle="Checkbox Question"
        navigation={navigation}
      />

      {/* Sized Box */}
      <View style={{ height: hp(4) }} />

      {/* Question Box */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>Q. {content}</Text>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        {/* Question Options */}
        <View style={styles.optionContainer}>
          {option.map(({ id, option }) => (
            <View style={{ flexDirection: "row", marginBottom: hp(2) }}>
              <MultiCheckbox
                id={id}
                title={option}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
              />
            </View>
          ))}
        </View>
        {/* <View style={styles.optionContainer}>
          {option.map(({ option, id }) => (
            <TouchableOpacity
              style={{
                ...styles.optionBox,
                borderColor:
                  selectedOption === id ? colors.pageTitle : colors.borderDim,
                borderWidth: selectedOption === id ? 4 : 1,
              }}
              activeOpacity={0.7}
              onPress={() => setSelectedOption(id)}
            >
              <Text
                style={{
                  ...styles.optionText,
                  color:
                    selectedOption === id
                      ? colors.pageTitle
                      : colors.borderLight,
                  fontFamily:
                    selectedOption === id ? "PoppinsMedium" : "Poppins",
                }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View> */}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: hp(4),
  },
  pageTitle: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  pageSubTitle: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
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
  optionContainer: {
    // backgroundColor: "yellow",
  },
  // optionContainer: {
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  // },
  // optionBox: {
  //   width: wp(35),
  //   borderWidth: 1,
  //   borderRadius: hp(2),
  //   borderColor: colors.borderDim,
  //   paddingVertical: hp(6),
  //   marginVertical: hp(1),
  //   borderRadius: hp(100),
  // },
  // optionText: {
  //   fontSize: RFValue(14),
  //   fontFamily: "Poppins",
  //   color: colors.borderLight,
  //   textAlign: "center",
  // },
});

export default CheckBoxTask;
