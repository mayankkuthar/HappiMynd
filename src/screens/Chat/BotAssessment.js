import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, FlatList } from 'react-native'
import Button from "../../components/buttons/Button"
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { colors, happiVoice_promptTips } from "../../assets/constants";
import Header from "../../components/common/Header";
import { getHelpLineTxt, getQuestions, postScore } from './BotUtils';
import HTML from 'react-native-render-html';
import ScreeningCard from '../../components/cards/ScreeningCard';
import { Ionicons } from "@expo/vector-icons";
import { StackActions } from '@react-navigation/native';
import { acc } from 'react-native-reanimated';
import { Hcontext } from '../../context/Hcontext';

const BotAssessment = (props) => {
  const { navigation } = props;
  const { authState, getSubscriptions, getUserProfile, screenTrafficAnalytics, categoryId, setCategoryId, setGotoAssessment } = useContext(Hcontext);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const [questions, setQuestions] = useState([])
  const [optionList, setOptionList] = useState([])
  const [score, setScore] = useState([])
  const [selectedOption, setselectedOption] = useState("")
  const [enableSubmit, setEnableSubmit] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetchUserProfile(authState?.user?.access_token);

    questionList()
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const userProfile = await getUserProfile({ token });
      if (userProfile.status === "success") {
        if (userProfile?.data?.verify_user) {
          if (userProfile?.data?.verify_user?.email_verify) {
            setIsEmailVerified(true);
          }
          if (userProfile?.data?.verify_user?.mobile_verify) {
            setIsPhoneVerified(true);
          }
        }
      }
    } catch (err) {
    }
  };

  const questionList = async () => {
    const questions = await getQuestions(categoryId);
    let res = questions.map((_) => {
      return { ..._, selectedOptionId: 0 }
    })
    setQuestions(res)
  }

  const handleSelOption = (item, item2, index) => {
    if (selectedIndex == index) {
      setSelectedIndex(index + 1)
      let res = questions.map((_, i) => {
        return i == index ? { ..._, selectedOptionId: item2.id } : _
      })
      setQuestions(res)
      setScore([...score, item2])
    }
  }

  const handleSubmit = async () => {
    let sum = 0
    score.map(item => {
      sum += item?.score;
    })

    const RESULT = await postScore(authState?.user?.user?.id, categoryId, sum);

    if (RESULT?.status == "Success") {

      if (authState.user) {

        if (isEmailVerified && isPhoneVerified) {
          navigation.navigate("ResultScreen", { cat_id: categoryId, profile_id: authState?.user?.user?.id })
        } else {
          navigation.navigate("ContactVerification", {
            isFrom: "HappiBot",
            category_Id: categoryId,
            profile_id: authState?.user?.user?.id
          });
        }
      }
      else {
        navigation.push("HomeScreen");
      }
    
    }
  }




  return (
    <View style={styles.mainCont}>
      <View style={{ height: hp(6) }} />
      <View style={{ flexDirection: 'row', width: '100%' }}>
        <TouchableOpacity
          onPress={() => {
            if (props?.route?.params?.isFrom == "contact") {
              navigation.pop(2)
            }
            else {
              navigation.goBack()
            }
          }}>
          <View style={styles.backContainer}>
            <Ionicons name="ios-chevron-back" size={hp(4)} color="black" />
          </View>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Assessment</Text>
      </View>

      <View style={{ flex: 1, }}>
        <FlatList
          data={questions}
          renderItem={({ item, index }) =>
            <View style={{ ...styles.flatlistCont, opacity: selectedIndex == index ? 1 : 0.3 }}>
              <View>
                <Text style={styles.questionText}>{item?.question} </Text>
                <View style={{ height: hp(2) }} />
              </View>

              {item?.options.map((item2, id2) => (

                <TouchableOpacity
                  onPress={() => {
                    handleSelOption(item, item2, index);
                    if (selectedIndex == questions?.length - 1) {
                      setEnableSubmit(true)
                    }
                  }}>
                  {/* <View style={[styles.optionCont, { backgroundColor: selectedOption == item2 ? colors.primaryText : 'white', borderColor: selectedOption == item2 ? colors?.primary : colors?.borderDim }]}>
                    <Text style={[styles.optionText, { color: selectedOption == item2 ? 'white' : colors.borderLight }]}>{item2.option} </Text> */}
                  <View style={[styles.optionCont, { backgroundColor: item?.selectedOptionId == item2.id ? colors.primaryText : 'white', borderColor: item?.selectedOptionId == item2.id ? colors?.primary : colors?.borderDim }]}>
                    <Text style={[styles.optionText, { color: item?.selectedOptionId == item2.id ? 'white' : colors.borderLight }]}>{item2.option} </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

          }
          keyExtractor={(item) => item?.id}
        />

        {enableSubmit && (
          <View style={styles.buttonCont}>
            <TouchableOpacity
              onPress={() => {
                handleSubmit();
              }}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>

    </View >

  )
}
const styles = StyleSheet.create({
  pageTitle: {
    fontSize: RFValue(22),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
    textAlign: 'center',
    flex: 0.8,
  },
  backContainer: {
    paddingStart: 20,
    paddingEnd: 20,
  },
  pageSubTitle: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
    color: colors.borderLight,
  },
  mainCont: {
    flex: 1,
    backgroundColor: colors?.background,
  },
  flatlistCont: {
    borderColor: colors?.borderLight,
    borderWidth: 0.1,
    borderRadius: 8,
    marginBottom: -5,
    margin: 35,
    padding: 25,
    backgroundColor: colors?.primary,
    shadowColor: colors?.borderLight,
    shadowOpacity: 0.5,
    shadowOffset: { height: 1, width: 1, }
  },
  questionText: {
    color: 'black',
    fontSize: RFValue(14),
    fontFamily: "PoppinsMedium"
  },
  optionCont: {
    borderRadius: 8,
    borderWidth: 0.25,
    marginBottom: 10
  },
  optionText: {
    margin: 10,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
  buttonCont: {
    backgroundColor: colors?.primary,
    height: hp(5),
    width: wp(40),
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    marginBottom: 10,
    marginTop: 10
  },
  buttonText: {
    margin: 10,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: RFValue(14),
    fontFamily: "PoppinsMedium",
  },

})

export default BotAssessment