import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
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
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
import CourseCard from "../../components/cards/CourseCard";
import CourseLockModal from "../../components/Modals/CourseLockModal";

const SubCourses = (props) => {
  // Prop Destructuring
  const { navigation, route } = props;
  const { courseId } = route.params;

  // Context Variables
  const { subCourseList, happiSelfDispatch, startCourse, rewardList } =
    useContext(Hcontext);

  // State Varaibles
  const [showLockModal, setShowLockModal] = useState(false);
  const [subCourses, setSubCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Focus Mounting
  useFocusEffect(
    useCallback(() => {
      happiSelfDispatch({
        type: "SET_CURRENT_TASK",
        payload: null,
      });
      getSubCourseList(courseId);
    }, [])
  );

  const getSubCourseList = async (id) => {
    setLoading(true);
    try {
      const courseRes = await subCourseList(id);
      if (courseRes.status === "success") {
        setSubCourses(courseRes.list);
        happiSelfDispatch({ type: "SET_CURRENT_SUBCOURSE", payload: id });
      }
    } catch (err) {
      console.log("Some issue while getting sub-courses - ", err);
    }
    setLoading(false);
  };

  const courseStartHandler = async (courseId) => {
    try {
      // happiSelfDispatch({
      //   type: "SET_CURRENT_TASK",
      //   payload: courseId,
      // });

      const startCourseRes = await startCourse(courseId);
      console.log(
        `Chekc the start course of ${courseId} res - `,
        startCourseRes
      );
    } catch (err) {
      console.log("Some issue while starting course handler - ", err);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <Header showLogo={false} showBack={true} navigation={navigation} />

      <CourseLockModal
        showModal={showLockModal}
        setShowModal={setShowLockModal}
        pressHandler={() => setShowLockModal(false)}
      />

      {/* Body Section */}
      <ScrollView style={{ paddingHorizontal: wp(10) }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.pageTitle}>Sub-Modules</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.push("Notes")}
            style={styles.notesButton}
          >
            <Text style={styles.notesText}>Notes</Text>
          </TouchableOpacity>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />
        {loading ? (
          <ActivityIndicator size="small" color={colors.loaderColor} />
        ) : (
          subCourses.map((course) => (
            <>
              <CourseCard
                type={course.status} // Types - open, ongoing, completed, locked
                title={course.sub_course_name}
                pressHandler={() => {
                  courseStartHandler(course.id);
                  navigation.push("TaskScreen", { subCourse: course });
                }}
                course={course}
                {...props}
              />
              {/* Sized Box */}
              <View style={{ height: hp(2) }} />
            </>
          ))
        )}
      </ScrollView>
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
  notesButton: {
    borderWidth: 1,
    borderColor: colors.pageTitle,
    paddingVertical: hp(0.8),
    paddingHorizontal: hp(2),
    borderRadius: hp(10),
  },
  notesText: {
    fontSize: RFValue(11),
    fontFamily: "PoppinsMedium",
    color: colors.pageTitle,
  },
});

export default SubCourses;
