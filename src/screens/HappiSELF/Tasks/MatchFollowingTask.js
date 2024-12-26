import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { DraxProvider, DraxView, DraxList } from "react-native-drax";

// Components
import TaskScreenHeader from "./TaskScreenHeader";

// Context
import { Hcontext } from "../../../context/Hcontext";
import { colors } from "../../../assets/constants";

const MatchFollowingTask = (props) => {
  // Prop Destructuring
  const {
    question: { content, option, id },
    completeTask,
    setIsCorrectOption,
    navigation,
  } = props;

  // Context Variables
  const { happiSelfState } = useContext(Hcontext);

  // State Variables
  const [alphaData, setAlphaData] = useState([
    "apple",
    "orange",
    "banana",
    "grape",
  ]);
  const [matchQues, setMatchQues] = useState([]);
  const [matchAns, setMatchAns] = useState([]);

  // Mounting
  useEffect(() => {
    console.log("Mounted Match Following Task Screen", props);

    option[0].option.map((ques) => {
      setMatchQues((prevState) => [...prevState, ques.option]);
      setMatchAns((prevState) => [...prevState, ques.correct_answer]);
    });

    completeTask(id);
    setIsCorrectOption(true);
  }, []);

  const MatchCard = ({ ques }) => {
    return (
      <View style={styles.matchCardContainer}>
        <Text style={styles.matchCardText}>{ques}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Screen Header */}
      <TaskScreenHeader
        title="Exercise"
        subTitle="Match Following"
        navigation={navigation}
      />

      {/* Sized Box */}
      <View style={{ height: hp(4) }} />

      {/* Question Box */}
      <View style={styles.questionContainer}>
        <Text style={styles.contentDescription}>Q. {content}</Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <View style={styles.matchContainer}>
          {/* Match Question Section */}
          <View style={styles.matchSection}>
            {matchQues?.map((ques) => (
              <MatchCard ques={ques} />
            ))}
          </View>
          {/* Match Answer Section */}
          <View style={styles.matchSection}>
            <DraxProvider>
              <View style={styles.dragContainer}>
                <DraxList
                  data={matchAns}
                  renderItemContent={({ item }) => <MatchCard ques={item} />}
                  onItemReorder={({ fromIndex, toIndex }) => {
                    // const newData = alphaData.slice();
                    // newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
                    // setAlphaData(newData);
                  }}
                  keyExtractor={(item) => item}
                />
              </View>
            </DraxProvider>
          </View>
        </View>
      </View>
    </View>
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
    height: hp(40),
  },
  questionText: {
    fontSize: RFValue(16),
    fontFamily: "PoppinsMedium",
    textAlign: "justify",
  },
  contentDescription: {
    fontSize: RFValue(15),
    fontFamily: "PoppinsMedium",
  },
  matchContainer: {
    // backgroundColor: "yellow",
    flex: 1,
    flexDirection: "row",
  },
  matchSection: {
    flex: 1,
    // backgroundColor: "green",
    height: hp(60),
  },
  matchCardContainer: {
    width: wp(35),
    backgroundColor: colors.primary,
    borderRadius: hp(0.5),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2.5),
    marginBottom: hp(1),
  },
  matchCardText: {
    fontFamily: "Poppins",
    fontSize: RFValue(14),
  },
  dragContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    // backgroundColor: "red",
    justifyContent: "center",
  },
  draggable: {
    width: wp(80),
    height: hp(10),
    backgroundColor: "blue",
  },
  receiver: {
    width: 100,
    height: 100,
    backgroundColor: "green",
  },
});

export default MatchFollowingTask;
