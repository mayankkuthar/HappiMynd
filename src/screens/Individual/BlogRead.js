import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

// Constants
import { colors } from "../../assets/constants";

// Components
import Capsule from "../../components/common/Capsule";

const Header = (props) => {
  // Prop Destructuring
  const { navigation, likesCount } = props;

  // State Variables
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.pop()}
        style={{ paddingLeft: hp(1.5) }}
      >
        <Ionicons name="ios-chevron-back" size={hp(4)} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{ paddingRight: hp(2), alignItems: "center" }}
        onPress={() => setLiked((prevState) => !prevState)}
      >
        <Ionicons
          name={liked ? "heart-sharp" : "heart-outline"}
          size={hp(3)}
          color={liked ? "red" : "black"}
        />
        <Text style={styles.blogLikeText}>{likesCount}</Text>
      </TouchableOpacity>
    </View>
  );
};

const BlogRead = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  const {
    title = "",
    summary = "",
    credit = "",
    likes_count = 0,
    type = "",
    profile = "",
    keywords = "",
  } = props.route.params;

  return (
    <View style={styles.container}>
      <Header navigation={navigation} likesCount={likes_count} />

      <View style={{ paddingHorizontal: wp(10) }}>
        <Text style={styles.heroTitle}>{title}</Text>
        {/* Sized Box */}
        <View style={{ height: hp(1) }} />

        <View style={styles.blogButton}>
          <Text style={styles.blogButtonText}>{type}</Text>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={require("../../assets/images/blog1.png")}
            style={styles.heroBackground}
            resizeMode="cover"
          >
            {/* <FontAwesome5 name="play" size={hp(4)} color="white" /> */}
          </ImageBackground>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <View>
            <Text
              style={{
                ...styles.bodyContentText,
                fontFamily: "PoppinsSemiBold",
              }}
            >
              Description:
            </Text>
            <Text style={styles.bodyContentText}>{summary}</Text>
            {/* Sized Box */}
            <View style={{ height: hp(3) }} />
            <Text
              style={{
                ...styles.bodyContentText,
                fontFamily: "PoppinsSemiBold",
              }}
            >
              Profile:
            </Text>
            {/* Sized Box */}
            <View style={{ height: hp(1) }} />
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {profile.split(" ").map((element) => (
                <>
                  <Capsule title="Salaried" />

                  {/* Sized Box */}
                  <View style={{ width: wp(2) }} />
                </>
              ))}
            </ScrollView>
            {/* Sized Box */}
            <View style={{ height: hp(3) }} />
            <Text
              style={{
                ...styles.bodyContentText,
                fontFamily: "PoppinsSemiBold",
              }}
            >
              Keywords:
            </Text>
            {/* Sized Box */}
            <View style={{ height: hp(1) }} />
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {keywords.split(" ").map((element) => (
                <>
                  <Capsule title={element} />

                  {/* Sized Box */}
                  <View style={{ width: wp(2) }} />
                </>
              ))}
            </ScrollView>
            {/* Sized Box */}
            <View style={{ height: hp(3) }} />
            <Text
              style={{
                ...styles.bodyContentText,
                fontFamily: "PoppinsSemiBold",
              }}
            >
              Credit:
            </Text>
            {/* Sized Box */}
            <View style={{ height: hp(1) }} />
            <Text style={styles.bodyContentText}>{credit}</Text>
          </View>
          {/* Sized Box */}
          <View style={{ height: hp(40) }} />
        </ScrollView>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  headerContainer: {
    // backgroundColor: "yellow",
    width: wp(100),
    height: hp(12),
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingBottom: hp(2),
  },
  heroTitle: {
    fontSize: RFValue(22),
    fontFamily: "PoppinsMedium",
    color: colors.borderDark,
  },
  blogButton: {
    backgroundColor: colors.primary,
    height: hp(3),
    width: wp(14),
    // paddingHorizontal: hp(2),
    borderRadius: hp(100),
    alignItems: "center",
    justifyContent: "center",
  },
  blogButtonText: {
    fontSize: RFValue(8),
    fontFamily: "PoppinsMedium",
    textAlign: "center",
    color: colors.primaryText,
  },
  heroBackground: {
    width: wp(80),
    height: hp(30),
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  bodyContentText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
});

export default BlogRead;
