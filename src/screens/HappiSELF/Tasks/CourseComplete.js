import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

// Components
import Button from "../../../components/buttons/Button";

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
    sendNotification,
  } = useContext(Hcontext);

  console.log("check the auhth dev token - ", authState);

  // State Variables
  const [loading, setLoading] = useState(true);

  // Mounting
  useEffect(() => {
    console.log("Completed task log - ", happiSelfState.currentTask);
    triggerNotification();
    setTimeout(() => courseCompletionHandler(happiSelfState.currentTask), 2000);

    return () => {
      happiSelfDispatch({
        type: "SET_QUESTIONS",
        payload: [],
      });
    };
  }, []);

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
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
      >
        <Image
          source={require("../../../assets/images/course_complete.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.completeText}>
          Your module is completed & next module is unlocked
        </Text>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.continueButtonContainer}>
        <Button
          text="Continue"
          pressHandler={() => navigation.pop()}
          loading={loading}
          containerStyle={styles.taskActionButton}
          textStyle={styles.taskActionButtonText}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: hp(4),
    alignItems: "center",
    marginTop: hp(6),
  },
  image: {
    width: wp(80),
    height: hp(46),
    alignSelf: "center",
    // backgroundColor: "red",
  },
  completeText: {
    fontSize: RFValue(15),
    fontFamily: "PoppinsMedium",
    textTransform: "capitalize",
    textAlign: "center",
  },
  continueButtonContainer: {
    position: "absolute",
    bottom: hp(4),
    left: 14,
    right: 14,
  },
  taskActionButton: {
    backgroundColor: "#E8DEFF",
    borderRadius: 50,
    height: hp(6),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8E66F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  taskActionButtonText: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsSemiBold",
    color: "#191919",
    textAlign: "center",
  },
});

export default CourseComplete;
