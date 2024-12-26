import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

// Components
import Button from "../../../components/buttons/Button";
import CourseScoreModal from "../../../components/Modals/CourseScoreModal";

// Context
import { Hcontext } from "../../../context/Hcontext";
import { colors } from "../../../assets/constants";

const CourseComplete = (props) => {
  // Prop Destructuring
  const { navigation, setCourseComplete } = props;

  // Context Variables
  const {
    authState,
    happiSelfState,
    completeCourse,
    happiSelfDispatch,
    rewardList,
    sendNotification,
  } = useContext(Hcontext);

  console.log("check the auhth dev token - ", authState);

  // State Variables
  const [loading, setLoading] = useState(true);
  const [rewardPoint, setRewardPoint] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Mounting
  useEffect(() => {
    console.log("Completed task log - ", happiSelfState.currentTask);
    fetchRewardPoint();
    triggerNotification();
    setTimeout(() => courseCompletionHandler(happiSelfState.currentTask), 2000);

    return () => {
      happiSelfDispatch({
        type: "SET_QUESTIONS",
        payload: [],
      });
    };
  }, []);

  // Getting all the subcourse content
  const fetchRewardPoint = async () => {
    try {
      const rewards = await rewardList();
      console.log("chek teh rewasrd - ", rewards);
      if (rewards.status === "success") {
        const score = rewards.list.find((entry) => entry.id == 9);
        console.log("check teh scre here - ", Number(score.points_to_be_given));
        setRewardPoint(Number(score.points_to_be_given));
        if (Number(score.points_to_be_given)) setShowModal(true);
      }
    } catch (err) {
      console.log(
        "Some issue while fetching reward-list (CompletedScreen.js) - ",
        err
      );
    }
  };

  const triggerNotification = async () => {
    try {
      await sendNotification({
        message: "That's the Winning SPIRIT 💪 Keep the VIBE ON!",
      });
    } catch (err) {
      console.log(
        "Some issue while triggering notification (CourseComplete.js) - ",
        err
      );
    }
  };

  const courseCompletionHandler = async (courseId) => {
    setLoading(true);
    try {
      const completeRes = await completeCourse(courseId);
      console.log("Check teh course completion res - ", completeRes);
      happiSelfDispatch({
        type: "SET_CURRENT_TASK",
        payload: null,
      });
    } catch (err) {
      console.log("Some issue while completing course - ", err);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <CourseScoreModal
        showModal={showModal}
        setShowModal={setShowModal}
        points={rewardPoint}
      />
      <Image
        source={require("../../../assets/images/course_complete.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.completeText}>
        Your module is completed & next module is unlocked
      </Text>

      {/* Sized Box */}
      <View style={{ height: hp(2) }} />

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.pop()}
        style={styles.taskActionButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.loaderColor} />
        ) : (
          <Text style={styles.taskActionButtonText}>Continue</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: hp(4),
    // alignItems: "center",
  },
  image: {
    width: wp(80),
    height: hp(46),
    alignSelf: "center",
    // backgroundColor: "red",
  },
  completeText: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsBold",
    textTransform: "capitalize",
    textAlign: "center",
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
});

export default CourseComplete;
