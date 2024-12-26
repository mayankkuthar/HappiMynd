import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Context
import { Hcontext } from "../../../context/Hcontext";
import { colors } from "../../../assets/constants";

const TaskScreenHeader = (props) => {
  // Prop Destructuring
  const {
    navigation = null,
    title = "Screen title",
    subTitle = "Screen Sub-Title",
  } = props;

  return (
    <>
      <View style={styles.titleBox}>
        <Text style={styles.pageTitle}>{title}</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.push("Notes")}
          style={styles.notesButton}
        >
          <Text style={styles.notesText}>Notes</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.pageSubTitle}>{subTitle}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  titleBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: wp(80),
  },
  pageTitle: {
    fontSize: RFValue(23),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  pageSubTitle: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
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

export default TaskScreenHeader;
