import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Feather, Ionicons, AntDesign, FontAwesome } from "@expo/vector-icons";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

const LockedSection = (props) => {
  // Prop Destructuring
  const {} = props;
  return (
    <View style={styles.iconContainer}>
      <Feather name="lock" size={hp(2)} color={colors.borderDark} />
    </View>
  );
};

const OpenSection = (props) => {
  // Prop Destructuring
  const {
    pressHandler = () => {},
    isLiked = false,
    likesCount = 0,
    likeHandler = () => {},
    unLikeHandler = () => {},
  } = props;

  return (
    <View style={styles.openSectionContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.likeButton}
        onPress={isLiked == "yes" ? unLikeHandler : likeHandler}
      >
        {isLiked == "yes" ? (
          <Ionicons name="heart" size={hp(2)} color="red" />
        ) : (
          <Ionicons name="heart-outline" size={hp(2)} color="red" />
        )}
        {/* Sized Box */}
        <View style={{ width: hp(0.5) }} />
        <Text style={styles.likeCountText}>{likesCount}</Text>
      </TouchableOpacity>
    </View>
  );
};

const VideoSection = (props) => {
  // Prop Destructuring
  const {} = props;
  return (
    <View style={styles.iconContainer}>
      <AntDesign name="arrowright" size={hp(2)} color="black" />
    </View>
  );
};

const ProceedSection = (props) => {
  // Prop Destructuring
  const {} = props;
  return (
    <View style={styles.iconContainer}>
      <AntDesign name="arrowright" size={hp(2)} color="black" />
    </View>
  );
};
const CompletedSection = (props) => {
  // Prop Destructuring
  const { navigation, course } = props;
  return (
    <View style={styles.iconContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{ paddingHorizontal: hp(1.5) }}
        onPress={() => {
          navigation.push("CompletedScreen", { course });
        }}
      >
        <AntDesign name="folder1" size={hp(2.9)} color={colors.pageTitle} />
      </TouchableOpacity>

      <FontAwesome
        name="check-circle"
        size={hp(2.9)}
        color={colors.pageTitle}
      />
    </View>
  );
};

const CourseCard = (props) => {
  // Prop Destructuring
  const {
    id = null,
    title = "",
    showIcon = true,
    type = "locked", // Types - open, ongoing, completed, locked
    pressHandler = () => {},
    disabled = false,
    isLiked = false,
    likesCount = 0,
    fetchCourseList = () => {},
    course = null,
  } = props;

  // Context Variables
  const { likeCourse, unLikeCourse, snackDispatch } = useContext(Hcontext);

  const likeHandler = async () => {
    try {
      const likeRes = await likeCourse(id);
      console.log("The like response - ", likeRes);

      await fetchCourseList();
    } catch (err) {
      console.log("Some issue while liking a course - ", err);
    }
  };

  const unLikeHandler = async () => {
    try {
      const unlikeRes = await unLikeCourse(id);
      console.log("The unlike response - ", unlikeRes);

      await fetchCourseList();
    } catch (err) {
      console.log("Some issue while liking a course - ", err);
    }
  };

  const disableHandler = () => {
    if (type === "locked")
      snackDispatch({
        type: "SHOW_SNACK",
        payload: `${title} is currently locked !`,
      });
    // else if (type === "completed")
    //   snackDispatch({
    //     type: "SHOW_SNACK",
    //     payload: `${title} has been completed !`,
    //   });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={
        type === "locked"
          ? disableHandler
          : type === "completed"
          ? () => null
          : pressHandler
      }
      // onPress={pressHandler}
      // disabled={type === "locked" || "completed"}
    >
      <View
        style={[
          styles.container,
          type === "locked" && styles.lockedContainer,
        ]}
      >
        <View style={styles.firstHalf}>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        {showIcon ? (
          <View style={styles.secondHalf}>
            {type === "locked" ? (
              <LockedSection />
            ) : type === "unlocked" ? (
              <OpenSection
                pressHandler={pressHandler}
                isLiked={isLiked}
                likesCount={likesCount}
                likeHandler={likeHandler}
                unLikeHandler={unLikeHandler}
              />
            ) : type === "video" || type === "audio" ? (
              <VideoSection />
            ) : type === "completed" ? (
              <CompletedSection navigation={props.navigation} course={course} />
            ) : (
              <ProceedSection />
            )}
          </View>
        ) : null}
      </View>
      {disabled ? <View style={styles.disabledContainer} /> : null}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    height: hp(10),
    width: wp(80),
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    shadowColor: colors.borderLight,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: hp(1.5),
    // elevation: 5,
  },
  lockedContainer: {
    backgroundColor: "#F3F3F3",
  },
  firstHalf: {
    flex: 1,
    // backgroundColor: "red",
    paddingLeft: hp(3),
    paddingRight: hp(2),
    justifyContent: "center",
  },
  secondHalf: {
    flex: 1,
    // backgroundColor: "green",
    paddingVertical: hp(2),
    paddingHorizontal: hp(2),
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: RFValue(13),
    fontFamily: "PoppinsSemiBold",
    color: colors.borderDark,
    textAlign: "left",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  openSectionContainer: {
    // backgroundColor: "yellow",
    flex: 1,
    justifyContent: "center",
  },
  likeButton: {
    flexDirection: "row",
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
  },
  likeCountText: {
    fontSize: RFValue(11.5),
    fontFamily: "Poppins",
  },
  disabledContainer: {
    backgroundColor: "rgba(0,0,0,0.2)",
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default CourseCard;
