import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/core";

// Constants
import { Hcontext } from "../../context/Hcontext";
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";
import TaskSelector from "./Tasks/TaskSelector";
import CourseComplete from "./Tasks/CourseComplete";

const TaskScreen = (props) => {
  // Prop Destructuring
  const { navigation, route } = props;
  const { subCourse } = route.params;

  // Context Variables
  const {
    subCourseContent,
    happiSelfState,
    happiSelfDispatch,
    completeCourse,
    saveHappiSelfContentAnswer,
  } = useContext(Hcontext);

  // State Variables
  const [updatedTasks, setUpdatedTasks] = useState([]);
  const [isCorrectOption, setIsCorrectOption] = useState(false);
  const [courseComplete, setCourseComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mounting
  useEffect(() => {
    console.log(
      happiSelfState.questionsList,
      "check teh task screen **MOOUUNNTTIINNGG** - ",
      subCourse
    );
    setCourseComplete(false);
    fetchSubCourseContent(subCourse.id);

    return () => {
      setCourseComplete(false);
      console.log("Unmounted Task Screen ");
    };
  }, []);

  useEffect(() => {
    if (happiSelfState.questionsList.length) {
      const activeOne = happiSelfState.questionsList.find(
        (task) => !task.isCompleted
      );
      happiSelfDispatch({ type: "SET_ACTIVE_TASK", payload: activeOne });

      // If there is no active question
      if (!activeOne) setCourseComplete(true);
    } else {
      // If there are no questions in question list than just complete the sub-course
      // setCourseComplete(true);
      console.log("Completed task log - ", subCourse.id);

      // courseCompletionHandler(subCourse.id);
    }
  }, [happiSelfState.questionsList]);

  // const courseCompletionHandler = async (courseId) => {
  //   setLoading(true);
  //   try {
  //     const completeRes = await completeCourse(courseId);
  //     console.log("Check teh course completion res - ", completeRes);
  //   } catch (err) {
  //     console.log("Some issue while completing course - ", err);
  //   }
  //   setLoading(false);
  // };

  const fetchSubCourseContent = async (id) => {
    setLoading(true);
    try {
      const fetchedResult = await subCourseContent(id);

      if (
        fetchedResult.status === "success" &&
        happiSelfState.currentTask !== subCourse.id
      ) {
        const filteredData = fetchedResult.data.map((element) => {
          return { ...element, isCompleted: false };
        });

        happiSelfDispatch({
          type: "SET_QUESTIONS",
          payload: filteredData,
        });

        happiSelfDispatch({
          type: "SET_CURRENT_TASK",
          payload: subCourse.id,
        });
      }
    } catch (err) {
      console.log("Some issue while fetching sub-course content - ", err);
    }
    setLoading(false);
  };

  // Function to complete a task from global state
  const completeTask = (taskId) => {
    const filteredTasks = happiSelfState.questionsList.map((ques) => {
      if (ques.id === taskId) return { ...ques, isCompleted: true };
      else return ques;
    });

    console.log("chec the question state of subc - ", filteredTasks);
    console.log("chec the task id side by side - ", taskId);

    setUpdatedTasks(filteredTasks);
  };

  // Updates global question list and moves to next question
  const handleTaskActionButton = () => {
    const { content_type } = happiSelfState;
    console.log("check the updated task here - ", happiSelfState);
    // if(content_type === 'short_answer' || content_type === 'linear_scale' || content_type === 'question_checkbox'){
    //   await saveHappiSelfContentAnswer({})
    // }
    if (updatedTasks.length) {
      happiSelfDispatch({ type: "SET_QUESTIONS", payload: updatedTasks });
      happiSelfDispatch({ type: "SET_ACTIVE_TASK_ANSWER", payload: "" });
      setUpdatedTasks([]);
    }
  };

  // // If no content available
  // if (!loading && !happiSelfState.questionsList.length) {
  //   return (
  //     <ImageBackground
  //       source={require("../../assets/images/language_background.png")}
  //       resizeMode="cover"
  //       style={styles.container}
  //     >
  //       <Header showLogo={false} showBack={true} navigation={navigation} />

  //       {/* Sized Box */}
  //       <View style={{ height: hp(6) }} />

  //       <Text style={styles.noContentText}>No content available</Text>
  //     </ImageBackground>
  //   );
  // }
  console.log(courseComplete, "check teh task screen - ", subCourse.id);
  // If Course is Completed
  if (courseComplete) {
    return (
      <ImageBackground
        source={require("../../assets/images/language_background.png")}
        resizeMode="cover"
        style={styles.container}
      >
        <Header showLogo={false} showBack={true} navigation={navigation} />

        <CourseComplete
          navigation={navigation}
          setCourseComplete={setCourseComplete}
        />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <Header showLogo={false} showBack={true} navigation={navigation} />

      {console.log("chehc the wuestion - ", happiSelfState.questionsList)}

      {loading ? (
        <>
          {/* Sized Box */}
          <View style={{ height: hp(6) }} />
          <ActivityIndicator size="small" color={colors.loaderColor} />
        </>
      ) : subCourse.happiself_library_id ? (
        <TaskSelector question={subCourse} {...props} />
      ) : happiSelfState.activeTask ? (
        <TaskSelector
          question={happiSelfState.activeTask}
          completeTask={completeTask}
          isCorrectOption={isCorrectOption}
          setIsCorrectOption={setIsCorrectOption}
          {...props}
        />
      ) : null}

      {/* Next button to go on further question */}
      {isCorrectOption && updatedTasks.length ? (
        <View style={styles.taskActionButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleTaskActionButton}
            style={styles.taskActionButton}
          >
            <Text style={styles.taskActionButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  taskActionButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: wp(100),
    position: "absolute",
    bottom: hp(4),
  },
  taskActionButton: {
    backgroundColor: colors.pageTitle,
    paddingVertical: hp(1.5),
    width: wp(80),
    borderRadius: hp(100),
  },
  taskActionButtonText: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsMedium",
    textAlign: "center",
    color: "#fff",
  },
  noContentText: {
    fontSize: RFValue(20),
    fontFamily: "PoppinsSemiBold",
    color: colors.borderLight,
    textAlign: "center",
  },
});

export default TaskScreen;
