import React, { useState, useEffect, useContext, memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

const ScreeningCard = (props) => {
  // Prop Destructuring
  const {
    listRef,
    data,
    setData,
    item,
    selectedIndex,
    setSelectedIndex,
    getAssessment,
    index,
  } = props;

  // Context Variabels
  const { submitAnswer, authState, snackDispatch } = useContext(Hcontext);

  // State Variables
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  const answerHandler = async (optionId) => {
    setLoading(true);
    try {
      console.log("check teh oprion id - ", optionId);
      setSelectedAnswer(optionId);

      const answerRes = await submitAnswer({ optionId });
      console.log("Chekc the anser response - ", answerRes);

      if (answerRes?.message == "completed") {
        snackDispatch({
          type: "SHOW_SNACK",
          payload: "Awareness tool completed !",
        });
        props.navigation.push("AssessmentComplete");
      }

      if (data.length - 1 === index) {
        getAssessment(authState.user.access_token);
      }

      let newData = data.filter((d) => d.id !== item.id);
      let activeIndex = selectedIndex + 1;
      // if (selectedIndex > newData.length - 1) {
      //   activeIndex = newData.length - 1;
      // }
      console.log("chekcing the new data - ", newData);
      console.log("Chekcing teh selected index - ", selectedIndex);
      if (newData[selectedIndex]) {
        newData[selectedIndex].disabled = false;
        let selectedItem = { ...item, disabled: true };
        newData.push(selectedItem);
        newData.sort(function (a, b) {
          if (a.position < b.position) {
            return -1;
          }
          if (a.position > b.position) {
            return 1;
          }
          return 0;
        });
        setData(newData);
        setSelectedIndex((prevState) => prevState + 1);
        // setSelectedIndex(activeIndex);

        // Auto Scrolling feature
        listRef.current.scrollToIndex({
          animated: true,
          index: selectedIndex + 1,
          viewPosition: -0.1,
        });
      }
    } catch (err) {
      console.log("Some issue while answer handler - ", err);
    }
    setLoading(false);
  };

  // Mounting
  useEffect(() => {
    // console.log("check the optio j here - ", data.length - 1 === index);
  }, []);

  return (
    <View style={{ ...styles.container, opacity: item.disabled ? 0.3 : 1 }}>
      <Text style={styles.cardText}>{item?.question}</Text>

      {/* Sized Box */}
      <View style={{ height: hp(2) }} />

      {loading ? (
        <ActivityIndicator size="small" color={colors.loaderColor} />
      ) : (
        item?.options?.map(({ option, id }, index) => {
          return (
            <>
              <Pressable
                activeOpacity={0.7}
                onPress={() => answerHandler(id)}
                // style={
                //   index % 2 ? styles.cardButtonFalse : styles.cardButtonTrue
                // }
                style={({ pressed }) =>
                  selectedAnswer === id || pressed
                    ? styles.cardButtonTrue
                    : styles.cardButtonFalse
                }
                disabled={item.disabled}
              >
                <Text style={styles.cardButtonText}>{option}</Text>
              </Pressable>
              {/* Sized Box */}
              <View style={{ height: hp(1) }} />
            </>
          );
        })
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: hp(2),
    paddingVertical: hp(2.5),
    borderRadius: 10,
  },
  cardText: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    color: "#3E3A3A",
  },
  cardButtonTrue: {
    backgroundColor: colors.primary,
    paddingVertical: hp(1),
    borderRadius: hp(100),
  },
  cardButtonFalse: {
    backgroundColor: "#fff",
    paddingVertical: hp(1),
    borderRadius: hp(100),
    borderWidth: 1.5,
    // borderColor: "#EEEEEE",
    borderColor: colors.borderLight,
  },
  cardButtonText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    textAlign: "center",
  },
});

export default memo(ScreeningCard);
