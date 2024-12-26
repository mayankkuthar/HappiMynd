import React, { useState, useEffect, useContext, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
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

const MCQTask = (props) => {
  // Prop Destructuring
  const {
    question: { content, option, correct_answer },
    completeTask,
    isCorrectOption,
    setIsCorrectOption,
    navigation,
  } = props;

  console.log("lets have the props here - ", props);

  // Context Variables
  const { happiSelfState } = useContext(Hcontext);

  // State Variables
  const [selectedOption, setSelectedOption] = useState(null);

  // Refference Variables
  const animation = useRef(new Animated.Value(0)).current;

  // Mounting
  useEffect(() => {
    console.log("Mounted MCQ Screen", selectedOption);
    if (selectedOption) {
      if (selectedOption == correct_answer) {
        setIsCorrectOption(true);
      } else {
        setIsCorrectOption(false);
      }
    }
  }, [selectedOption]);

  useEffect(() => {
    if (isCorrectOption) completeTask(props.question.id);
  }, [isCorrectOption]);

  const handleAnimation = () => {
    // Animation consists of a sequence of steps
    Animated.sequence([
      // start rotation in one direction (only half the time is needed)
      Animated.timing(animation, {
        toValue: 1.1,
        duration: 130,
        useNativeDriver: true,
      }),
      // rotate in other direction, to minimum value (= twice the duration of above)
      Animated.timing(animation, {
        toValue: -1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      // return to begin position
      Animated.timing(animation, {
        toValue: 0.0,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <TaskScreenHeader
        title="Exercise"
        subTitle="Multiple Choice Question"
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
          {option.map(({ option, id }) => (
            <Animated.View
              style={{
                width: "100%",
                transform: isCorrectOption
                  ? null
                  : [
                      {
                        rotate: animation.interpolate({
                          inputRange: [-1, 1],
                          outputRange: ["-0.1rad", "0.1rad"],
                        }),
                      },
                    ],
              }}
            >
              <TouchableOpacity
                style={{
                  ...styles.optionBox,
                  backgroundColor:
                    selectedOption === option
                      ? isCorrectOption
                        ? colors.primary
                        : "#f97c7c"
                      : colors.backgroundLight,
                }}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedOption(option);
                  handleAnimation();
                }}
              >
                <Text
                  style={{
                    ...styles.optionText,
                    color:
                      selectedOption === option ? "#000" : colors.borderDark,
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
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
    // flexDirection: "row",
    // flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionBox: {
    width: "100%",
    borderWidth: 1,
    borderRadius: hp(2),
    borderColor: colors.borderDim,
    paddingVertical: hp(1),
    marginVertical: hp(1),
  },
  optionText: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    color: colors.borderLight,
    textAlign: "center",
  },
});

export default MCQTask;
