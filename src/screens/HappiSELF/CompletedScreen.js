import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
import CourseCard from "../../components/cards/CourseCard";
import VideoTask from "./Tasks/VideoTask";
import Audiotask from "./Tasks/AudioTask";

const CompletedScreen = (props) => {
  // Prop Destructuring
  const {
    navigation,
    route: { params },
  } = props;
  const { id } = params.course;

  // Context variables
  const { subCourseContent, rewardList } = useContext(Hcontext);

  // State variables
  const [loading, setLoading] = useState(true);
  const [summaryList, setSummaryList] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [rewardPoint, setRewardPoint] = useState(0);

  // Mounting
  useEffect(() => {
    fetchSubCourseContent(id);
  }, []);

  // Getting all the subcourse content
  const fetchSubCourseContent = async (id) => {
    try {
      const result = await subCourseContent(id);
      console.log("The fetched list result - ", result);
      if (result.status === "success") {
        setSummaryList(result.data);
      }
    } catch (err) {
      console.log(
        "Some issue while fetching sub-course content (CompletedScreen.js) - ",
        err
      );
    }
    setLoading(false);
  };

  const TaskTopBar = () => {
    return (
      <View style={styles.taskBarContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSelectedTask(null)}
        >
          <Ionicons name="ios-chevron-back" size={hp(4)} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <KeyboardAwareScrollView>
        {selectedTask?.content_type === "video" ? (
          <>
            <TaskTopBar />
            <VideoTask question={selectedTask} {...props} />
          </>
        ) : selectedTask?.content_type === "audio" ? (
          <>
            <TaskTopBar />
            <Audiotask question={selectedTask} {...props} />
          </>
        ) : (
          <>
            <Header showLogo={false} showBack={true} navigation={navigation} />
            {/* Body Section */}
            <View style={{ paddingHorizontal: wp(10) }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.pageTitle}>Course Media</Text>
              </View>

              {/* Sized Box */}
              <View style={{ height: hp(2) }} />

              {summaryList.map((course) =>
                ["video", "audio"].some((el) =>
                  course.content_type.includes(el)
                ) ? (
                  <View key={course.id}>
                    <CourseCard
                      type="open" // Types - open, ongoing, completed, locked
                      title={course.title ? course.title : course.content_type}
                      pressHandler={() => setSelectedTask(course)}
                      course={course}
                      {...props}
                    />
                    {/* Sized Box */}
                    <View style={{ height: hp(2) }} />
                  </View>
                ) : null
              )}
              {/* {summaryList.map((course) =>
          course.content_type === "video" ? (
            <VideoTask question={course} {...props} />
          ) : null
        )} */}
            </View>
          </>
        )}
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pageTitle: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  taskBarContainer: {
    // backgroundColor: "red",
    width: wp(100),
    height: hp(14),
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: hp(2),
  },
});

export default CompletedScreen;
