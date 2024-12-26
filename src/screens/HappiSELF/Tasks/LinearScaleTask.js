import React, { useState, useEffect, useContext } from "react";
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
import Slider from "@react-native-community/slider";

// Components
import TaskScreenHeader from "./TaskScreenHeader";

// Context
import { Hcontext } from "../../../context/Hcontext";
import { colors } from "../../../assets/constants";

const LinearScaleTask = (props) => {
  // Prop Destructuring
  const { question, completeTask, setIsCorrectOption, navigation } = props;

  // Context Variables
  const { happiSelfState } = useContext(Hcontext);

  // State Variables
  const [sliderVal, setSliderVal] = useState(0);
  const [mood, setMood] = useState(null);

  // Mounting
  useEffect(() => {
    completeTask(question.id);
    setIsCorrectOption(true);
    return () => {
      setIsCorrectOption(false);
    };
  }, []);

  // updating phase
  useEffect(() => {
    question.option.forEach(({ option }, index) => {
      if (sliderVal == index) setMood(option);
    });
  }, [sliderVal]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TaskScreenHeader title="" subTitle="" navigation={navigation} />
      {/* Sized Box */}
      <View style={{ height: hp(10) }} />

      {/* Question Box */}
      <View style={styles.questionContainer}>
        <Text style={styles.contentDescription}>{question.content}</Text>
        <View>
          <Text style={styles.sliderMood}>"{mood}"</Text>

          {/* Sized Box */}
          <View style={{ height: hp(20) }} />

          <Slider
            style={{ width: "100%" }}
            minimumValue={0}
            maximumValue={6}
            step={1}
            tapToSeek={true}
            minimumTrackTintColor={colors.pageTitle}
            value={sliderVal}
            onValueChange={(val) => setSliderVal(val)}
            //   maximumTrackTintColor="#000000"
          />
          {/* <View style={styles.sliderNumBox}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
            <Text style={styles.sliderNum}>{val}</Text>
          ))}
        </View> */}
        </View>
      </View>
      {/* Sized Box */}
      <View style={{ height: hp(20) }} />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: hp(4),
  },
  questionContainer: {
    // backgroundColor: "#F3FEFE",
    paddingHorizontal: hp(2),
    paddingVertical: hp(2),
    borderRadius: hp(2),
  },
  contentDescription: {
    // backgroundColor: "red",
    fontSize: RFValue(25),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  sliderMood: {
    // backgroundColor: "yellow",
    fontSize: RFValue(34),
    fontFamily: "PoppinsSemiBold",
    // position: "absolute",
    // top: hp(20),
    // left: hp(2),
  },
  //   sliderNumBox: {
  //     flexDirection: "row",
  //     backgroundColor: "red",
  //     // justifyContent: "space-around",
  //   },
  //   sliderNum: {
  //     fontSize: RFValue(10),
  //     fontFamily: "Poppins",
  //     paddingHorizontal: wp(2.9),
  //   },
});

export default LinearScaleTask;
