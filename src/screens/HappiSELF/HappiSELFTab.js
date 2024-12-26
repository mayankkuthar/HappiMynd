import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { Hcontext } from "../../context/Hcontext";
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";
import CourseCard from "../../components/cards/CourseCard";
import SearchField from "../../components/input/SearchField";
import CourseLockModal from "../../components/Modals/CourseLockModal";

const Courses = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { courseList, screenTrafficAnalytics } = useContext(Hcontext);

  // State Variables
  const [showLockModal, setShowLockModal] = useState(false);
  const [coursesList, setCoursesList] = useState([]);
  const [originalCoursesList, setOriginalCoursesList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  // Mouning
  useEffect(() => {
    fetchCourseList();
    screenTrafficAnalytics({ screenName: "HappiSELF Course Screen" });
  }, []);

  // Updating phase for search box
  useEffect(() => {
    if (searchText) {
      searchHandler(searchText);
    } else {
      setCoursesList(originalCoursesList);
    }
  }, [searchText]);

  const fetchCourseList = async () => {
    setLoading(true);
    try {
      const courses = await courseList();
      if (courses.status === "success") {
        setCoursesList(courses.list);
        setOriginalCoursesList(courses.list);
      }
    } catch (err) {
      console.log("Some issue while getting course list - ", err);
    }
    setLoading(false);
  };

  const searchHandler = (stext) => {
    const filteredList = originalCoursesList.filter((course) =>
      course.course_name.includes(stext)
    );

    setCoursesList(filteredList);
  };

  return (
    <ScrollView
      style={{
        ...styles.container,
        paddingHorizontal: wp(10),
        paddingVertical: hp(2),
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.loaderColor} />
      ) : (
        <>
          <CourseLockModal
            showModal={showLockModal}
            setShowModal={setShowLockModal}
            pressHandler={() => setShowLockModal(false)}
          />
          <SearchField
            placeHolder="Search"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
          {/* Sized Box */}
          <View style={{ height: hp(2) }} />
          {coursesList.map((course) => (
            <>
              <CourseCard
                id={course.id}
                type="unlocked"
                title={course.course_name}
                isLiked={course.is_like}
                likesCount={course.likes_count}
                fetchCourseList={fetchCourseList}
                pressHandler={() =>
                  navigation.push("SubCourses", { courseId: course.id })
                }
              />
              {/* Sized Box */}
              <View style={{ height: hp(2) }} />
            </>
          ))}
        </>
      )}
    </ScrollView>
  );
};

const Library = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { libraryList } = useContext(Hcontext);

  // State variables
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mounting
  useEffect(() => {
    fetchLibraryList();
  }, []);

  const fetchLibraryList = async () => {
    setLoading(true);
    try {
      const fetchedList = await libraryList();

      if (fetchedList.status === "success") {
        setList(fetchedList.list);
      }
    } catch (err) {
      console.log("Some issue while fetching library list - ", err);
    }
    setLoading(false);
  };

  return (
    <ScrollView
      style={{
        ...styles.container,
        paddingHorizontal: wp(10),
        paddingVertical: hp(2),
      }}
    >
      <SearchField placeHolder="Search" />
      {/* Sized Box */}
      <View style={{ height: hp(2) }} />

      {list.map((item) => (
        <CourseCard
          type="video"
          title={item.library_name}
          showIcon={false}
          pressHandler={() => navigation.push("LibrarySub", { item })}
        />
      ))}
      {/* <CourseCard
        type="video"
        title="Sleep Music"
        showIcon={false}
        pressHandler={() => navigation.push("SleepMusic")}
      /> */}
    </ScrollView>
  );
};

const Tab = createMaterialTopTabNavigator();

const tabCommon = {
  tabBarStyle: { backgroundColor: "transparent", elevation: 0 },
  tabBarActiveTintColor: "#000",
  tabBarInactiveTintColor: colors.borderDim,
  tabBarIndicatorStyle: {
    // borderBottomColor: colors.primary,
    // borderWidth: 1,
    backgroundColor: "#A3E8E5",
  },
  // tabBarIndicatorContainerStyle: { backgroundColor: "red" },
};

const HappiSELFTab = (props) => {
  // Props Destructuring
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <Header navigation={navigation} showBack={true} />

      <Tab.Navigator screenOptions={tabCommon}>
        <Tab.Screen name="Modules" component={Courses} />
        <Tab.Screen name="Library" component={Library} />
      </Tab.Navigator>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
});

export default HappiSELFTab;
