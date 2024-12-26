import React, { useState, useCallback, useEffect, useContext } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  FlatList,
  ActivityIndicator,
} from "react-native"; import {
  GiftedChat,
  Bubble,
  Time,
  InputToolbar,
  Send,
} from "react-native-gifted-chat"; // Chat Module
import Header from '../../components/common/Header'
import { Hcontext } from '../../context/Hcontext'
import { chatBotWelcomeMsg, chatBot_welcome_mssg, chatBotInitialMsg, chatBotPostModelMsg, chatBotPriorityQues, chatBotAssessmentBegin, chatBotPostAssessmentMsg, chatBot_recomend, chatBotUserResponse, chatBotrecomend, chatBotrecomendOptions, chatBotSelfMngOptions, chatBotGuidedSupportOptions, chatBotEnd } from '../../assets/constants'
import { _renderBubbleTime, _renderChatBubble } from '../../components/common/Chat'
import { colors } from '../../assets/constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  addDoc,
  orderBy,
  query,
  onSnapshot,
  collection,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "../../context/Firebase";
import { getAssessList, getDiscussTopics, getLLMResponse, getRecommendation, getVideo } from './BotUtils'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatHome = (props) => {
  const { navigation } = props;

  const { botVisible, setBotVisible, botAssessmetDone, gotoVideo, setGotoVideo, gotoAssessment, setGotoAssessment } = useContext(Hcontext)
  // const [userData, setUserData] = useState({})
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [enableSend, setEnableSend] = useState(false);
  const [userName, setUserName] = useState('');
  const [loadingButton, setLoadingButton] = useState(false);
  const { authState, getSubscriptions, getUserProfile, screenTrafficAnalytics,categoryId, setCategoryId } = useContext(Hcontext);
  const [messages, setMessages] = useState([])
  const [selectTopics, setSelectTopics] = useState([])
  const [selectedOpt, setSelectedOpt] = useState([])
  const [enableConfirm, setEnableConfirm] = useState(false)
  const [confirmPriority, setConfirmPriority] = useState(false)
  const [selectedCat, setSelectedCat] = useState([])
  // const [assessmentList, setAssessmentList] = useState([])
  // const [gotoAssessment, setGotoAssessment] = useState(false)
  const [selectRecomOpt, setSelectRecomOpt] = useState([])
  const [goToRecoms, setGoToRecoms] = useState(false)
  // const [categoryId, setCategoryId] = useState(false)
  const [enableTools, setEnableTools] = useState(false)
  const [selectedTools, setSelectedTools] = useState('');
  const [userProfileId, setUserProfileId] = useState('');



  useEffect(() => {
    fetchMessages();

    return () => {
      setBotVisible(true);
    }
  }, []);


  useEffect(() => {
    if (messages.length == 5) {
      setTimeout(() => loopWithDelay(0, chatBotInitialMsg), 3000);
    }
    else if (messages.length == 8) {
      let feeling = messages?.[0]?.text?.toLowerCase();
      let inputToLlm = `I am ${userName}. ${feeling}`
      LlmRespo(inputToLlm, true);
    }
    else if (messages.length == 9 || messages.length == 11 || messages.length == 13 || messages.length == 15) {
      let feeling = messages?.[0]?.text?.toLowerCase();
      LlmRespo(feeling, false);
    }
    else if (messages.length == 10 || messages.length == 12 || messages.length == 14 || messages.length == 16) {
      let feeling = messages?.[0]?.text?.toLowerCase();
      LlmRespo(feeling, true);
    }
    else if (messages.length == 17) {
      loopWithDelay(0, chatBotPostModelMsg)
    }
    else if (messages.length == 20) {
      discussionTopic()
    }
    else if (messages.length == 22) {
      if (selectedOpt) {
        loopWithDelay(0, chatBotPriorityQues)
      }
    }
    else if (messages.length == 23) {
      assessmentTopic()
    }
    else if (messages.length == 25) {
      loopWithDelay(0, chatBotAssessmentBegin)
      setGotoAssessment(true)
    }
    else if (messages.length == 26 && !gotoAssessment) {
      loopWithDelay(0, chatBotPostAssessmentMsg)
    }
    else if (messages.length == 29) {
      setGotoVideo(true)
    }
    else if (messages.length == 30 && !gotoVideo) {
      loopWithDelay(0, chatBotrecomend)
    }
    else if (messages.length == 32) {
      recommendations();
    }
    else if (messages.length == 34) {
      toolsList();
      setEnableSend(false)
    }
  }, [messages, gotoAssessment, gotoVideo]);


  const setLocalMessages = async () => {
    await AsyncStorage.setItem('chatBotMessages', JSON.stringify(messages))
    // setMessages([]);
  }


  useEffect(() => {
    setUserProfileId(authState?.user?.user?.id)
    if (selectedOpt?.length > 0) {
      setEnableConfirm(true)
    }
    else if (selectedCat?.length > 0) {
      setConfirmPriority(true)
    }
    else if (selectRecomOpt?.length > 0) {
      setConfirmPriority(false)
      setGoToRecoms(true)
    }
    else {
      setEnableConfirm(false)
      setConfirmPriority(false)
      setGoToRecoms(false)

    }
  }, [selectedOpt, selectedCat])


  const fetchUserProfile = async (token) => {
    try {
      const userProfile = await getUserProfile({ token });
      // setUserData(userProfile)
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

  const discussionTopic = async () => {
    let res = await getDiscussTopics();
    setSelectTopics(res)
    sendMessageFromChatbot(res, true, "topics", true)
  }

  const recommendations = () => {
    sendMessageFromChatbot(chatBotrecomendOptions, true, "recom", true)
  }

  const toolsList = async () => {
    if (selectRecomOpt == "Self Management Tools") {
      let res = await getRecommendation(authState?.user?.user?.user_profile_id, categoryId);

      if (res?.[0]?.id) {
        setEnableTools(true)
        sendMessageFromChatbot(res, true, "tools", true)
      }
      else {
        setEnableTools(false)
        sendMessageFromChatbot(res, true, "tools", true)
      }
    }
    else if (selectRecomOpt == "Guided Support") {
      let res = chatBotGuidedSupportOptions
      sendMessageFromChatbot(res, true, "support", true)
    }
  }

  const assessmentTopic = async () => {
    let res = await getAssessList();
    // setAssessmentList(res)
    const matchingData = [];
    const userSelection = selectedOpt;
    res.forEach((item1) => {
      const matchingItem = userSelection.find((item2) => item2.trim().toLowerCase() === item1?.name.trim().toLowerCase());
      if (matchingItem) {
        matchingData.push({ name: matchingItem, id: item1?.id });
      }
      return
    });
    setSelectedOpt([])
    sendMessageFromChatbot(matchingData, true, "categories", true)
  }

  const LlmRespo = async (input, post) => {
    console.log("llm call ------- ",input);
    let res = await getLLMResponse(input);
    if (post) {

      setTimeout(() => {
        res != undefined && sendMessageFromChatbot(res?.assistant_response, false, "", true)
        setEnableSend(true)
      }, 3000);
    }
  }

  const handleOpenUrl = (url) => {
    Linking.openURL(url)
      .then((supported) => {
        if (!supported) {
          console.error("Can't handle url: " + url);
        } else {
          console.log('Opened: ' + url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const saveEachMessage = async () => {
    // setLoadingButton(true);
    // let earlierChat = await AsyncStorage.getItem('chatBotMessages')
    // let data_ = JSON.parse(earlierChat)
    // setMessages();
    await AsyncStorage.setItem('chatBotMessages', JSON.stringify(messages))

  }

  const fetchMessages = async () => {

    setLoadingButton(true);
    let earlierChat = await AsyncStorage.getItem('chatBotMessages')
    let data_ = JSON.parse(earlierChat)

    // if (data_.length) {
    //   setMessages(data_)
    // }
    // else {
    //   loopWithDelay(0,chatBotWelcomeMsg)
    // }

    if (data_ && data_?.length) {
      setMessages(data_);
    } else {
      loopWithDelay(0, chatBotWelcomeMsg);
      // await AsyncStorage.setItem('chatBotMessages', JSON.stringify([]))
    }

    fetchUserProfile(authState?.user?.access_token);
    setLoadingButton(false);


    // loopWithDelay(0,chatBotWelcomeMsg)


    // setLoadingButton(true);
    // const collectionRef = collection(db, "chatBotMssg");
    // const q1 = query(collectionRef, where("senderId", "==", authState?.user?.user?.id));
    // const q2 = query(collectionRef, where("receiverId", "==", authState?.user?.user?.id));
    // const mergedQuerySnapshot = await Promise.all([getDocs(q1), getDocs(q2)]);
    // const mergedResults = mergedQuerySnapshot.flatMap(docArray => docArray.docs);
    // let allMessages = []
    // mergedResults.forEach((doc) => {
    //   let timeInMs = doc?.data()?.createdAt?.seconds * 1000
    //   let userDetection = doc?.data()?.senderId == authState?.user?.user?.id ? 1 : 0
    //   allMessages.push({ ...doc.data(), createdAt: timeInMs, user: { _id: userDetection, avatar: !userDetection ? require('../../assets/images/ChatBot_Logo.png') : null, name: 'ChatBot', } })
    // });
    // const sortedMessages = allMessages.sort((a, b) => a.createdAt - b.createdAt);

    // console.log('sortedMessages____ ', sortedMessages[sortedMessages.length - 1])
    // setMessages(sortedMessages)

    // if (sortedMessages.length) {
    //   console.log("CALL__LOOP_0");
    //   setLoadingButton(false);

    // }
    // else {
    //   console.log("CALL__LOOP_1");
    //   setLoadingButton(false);
    //   loopWithDelay(0, chatBotWelcomeMsg)
    // }

  };

  const loopWithDelay = async (index, arry) => {
    if (index < arry.length) {
      const currentDateTime = new Date();
      const isoString = currentDateTime.toISOString();
      const myMsg = {
        ...arry?.[index],
        // receiverId: authState?.user?.user?.id,
        receiverId: "2",
        _id: Date.now(),
        createdAt: isoString,
        customType: messages.length == 20 ? 'flatListMessage' : 'text',
        flatListData: selectTopics,
        user: { _id: 0, avatar: require('../../assets/images/ChatBot_Logo.png') }
      }
      console.log("message come ------",arry[index].text);
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [myMsg]),
      );
      // addDoc(collection(db, "chatBotMssg"), myMsg)

      saveEachMessage()
      setTimeout(() => loopWithDelay(index + 1, arry), 3000);
      if (index == arry.length - 1) {
        setEnableSend(true)
      }
      // getLLMResponse();
    }
  };

  const sendMessageFromChatbot = async (msg, isFlatlist, inputData, isChatbot) => {
    const currentDateTime = new Date();
    const isoString = currentDateTime.toISOString();
    const myMsg = {
      text: msg,
      receiverId: authState?.user?.user?.id,
      _id: Date.now(),
      customType: isFlatlist ? 'flatListData' : 'text',
      dataType: inputData,
      createdAt: isoString,
      user: { _id: isChatbot ? 0 : 1, avatar: require('../../assets/images/ChatBot_Logo.png') }
    }

    console.log("meessage coming-------",msg);
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, [myMsg]),
    );

    saveEachMessage()

    // addDoc(collection(db, "chatBotMssg"), myMsg)

    // if(!isChatbot ){
    //   setSelectedOpt([])
    // }

    setEnableConfirm(false)
    setConfirmPriority(false)
  }

  const onSend = useCallback((message = []) => {
    setEnableSend(false)
    const userInput = message?.[0]?.text?.toLowerCase();
    if (userInput.includes('name') || userInput.includes('call') || userInput.includes('am')) {
      const words = userInput?.trim()?.split(' ');
      const last = words[words?.length - 1];
      // if(last=='sad' || last=='angry' || last=='anxious' || last=='nervous' || last=='worried' || last=='lonely' || last=='happy' || last=='excited' ){
      //   return
      // }
      setUserName(last);
    }

    console.log("message send --------",message);
    const myMsg = {
      ...message?.[0],
      senderId: authState?.user?.user?.id,
      receiverId: 0
    }
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, [myMsg]),
    );

    saveEachMessage()

    // addDoc(collection(db, "chatBotMssg"), myMsg)

  }, [])

  const botChatBubble = (props) => {

    const toggleTopics = (itemDes) => {
      const isSelected = selectedOpt.includes(itemDes);
      if (itemDes == "Suicidal Thoughts") {
        navigation.navigate("HelpLine")
      }
      if (isSelected) {
        setSelectedOpt((prevSelectedItems) => prevSelectedItems.filter((item) => item !== itemDes));
      } else {
        setSelectedOpt((prevSelectedItems) => [...prevSelectedItems, itemDes]);
      }
    };

    // const toggleCat = (itemId, itemName) => {
    //   setSelectTopics(itemName)
    //   const isSelected = selectedCat.includes(itemName);

    //   if (isSelected) {
    //     setSelectedCat((prevSelectedItems) => prevSelectedItems.filter((item) => item !== itemName));
    //   } else {
    //     setSelectedCat((prevSelectedItems) => [...prevSelectedItems, itemName]);
    //   }
    // };

    const { currentMessage } = props;
    const getColor = (index) => {
      const colors = ['#f6ac7e', '#99b4d8', '#fdbbbf', '#9bc3e7', '#c6dfad', '#d69ba5'];
      const colorIndex = Math.floor(index / 1) % colors.length;
      return colors[colorIndex];
    };

    if (currentMessage.customType === 'flatListData') {
      if (currentMessage.dataType === 'topics') {
        let data = currentMessage.text

        return (
          <View style={{ flex: 1 }}>
            <Text style={styles.flatListTitleText}>{'(Select as many as you want)'}</Text>
            <FlatList
              data={data}
              numColumns={2}
              renderItem={({ item, index }) =>
                <TouchableOpacity
                  onPress={() => {
                    // setSelectedOpt(item?.description)
                    toggleTopics(item?.description)
                  }}>
                  <View style={[styles.flatListItem, { backgroundColor: getColor(index) }, { borderWidth: selectedOpt.includes(item.description) ? 1 : 0 }]}>
                    <Text style={styles.flatListItemText}>{item?.description}</Text>

                  </View>
                </TouchableOpacity>
              }
              keyExtractor={(item) => item?.id?.toString()}
            />
          </View>
        );
      }
      if (currentMessage.dataType === 'categories') {
        let data = currentMessage.text
        return (
          <View style={{ flex: 1 }}>
            <Text style={styles.flatListTitleText}>{'(Select one)'}</Text>
            <FlatList
              data={data}
              numColumns={2}
              renderItem={({ item, index }) =>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCat(item?.name)
                    setCategoryId(item?.id)
                  }}>
                  <View style={[styles.flatListItem, { backgroundColor: getColor(index) }, { borderWidth: selectedCat.includes(item.name) ? 1 : 0 }]}>
                    <Text style={styles.flatListItemText}>{item?.name}</Text>

                  </View>
                </TouchableOpacity>
              }
              keyExtractor={(item) => item?.id?.toString()}
            />
          </View>
        );
      }

      if (currentMessage.dataType === 'recom') {
        let data = currentMessage.text
        return (
          <View style={{ flex: 1 }}>
            <Text style={styles.flatListTitleText}>{'(Select one)'}</Text>
            <FlatList
              data={data}
              numColumns={2}
              renderItem={({ item, index }) =>
                <TouchableOpacity
                  onPress={() => {
                    setSelectRecomOpt(item?.text)
                    setGoToRecoms(true)
                  }}>
                  <View style={[styles.flatListItem, { backgroundColor: getColor(index) }, { borderWidth: selectRecomOpt.includes(item.text) ? 1 : 0 }]}>
                    <Text style={styles.flatListItemText}>{item?.text}</Text>
                  </View>
                </TouchableOpacity>
              }
              keyExtractor={(item) => item?.id?.toString()}
            />
          </View>
        );
      }
      if (currentMessage.dataType === 'tools') {
        let data = currentMessage.text
        let moreTools = chatBotSelfMngOptions
        return (
          <View style={{ flex: 1 }}>
            <Text style={styles.flatListTitleText}>{'(Select Option)'}</Text>
            {enableTools &&
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedTools(data?.[0]?.title_1)
                    handleOpenUrl(data?.[0]?.url_1)
                  }}>

                  <View style={[styles.recomFlatListItem, { backgroundColor: '#f6ac7e' }, { borderWidth: selectedTools.includes(data?.[0]?.title_1) ? 1 : 0 }]}>
                    <Text style={styles.recomFlatListItemText}>{data[0]?.title_1}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedTools(data?.[0]?.title_2)
                    handleOpenUrl(data?.[0]?.url_2)
                  }}>
                  <View style={[styles.recomFlatListItem, { backgroundColor: '#99b4d8' }, { borderWidth: selectedTools.includes(data?.[0]?.title_2) ? 1 : 0 }]}>
                    <Text style={styles.recomFlatListItemText}>{data[0]?.title_2}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedTools(data?.[0]?.title_3)
                    handleOpenUrl(data?.[0]?.url_3)
                  }}>
                  <View style={[styles.recomFlatListItem, { backgroundColor: '#fdbbbf' }, { borderWidth: selectedTools.includes(data?.[0]?.title_3) ? 1 : 0 }]}>
                    <Text style={styles.recomFlatListItemText}>{data[0]?.title_3}</Text>
                  </View>
                </TouchableOpacity>
              </View>}
            <FlatList
              data={moreTools}
              numColumns={1}
              renderItem={({ item, index }) =>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedTools(item.text)
                    if (item?.id == 1) {
                      navigation.navigate("HappiLEARNDescription")
                    }
                    if (item?.id == 2) {
                      navigation.navigate("HappiSELF")
                    }
                  }}>
                  <View style={[styles.recomFlatListItem, { backgroundColor: getColor(index) }, { borderWidth: selectedTools.includes(item?.text) ? 1 : 0 }]}>
                    <Text style={styles.recomFlatListItemText}>{item?.text}</Text>
                  </View>
                </TouchableOpacity>
              }
              keyExtractor={(item) => item?.id?.toString()}
            />
          </View>
        );
      }
      if (currentMessage.dataType === 'support') {
        let data = currentMessage.text
        let supportData = chatBotGuidedSupportOptions
        return (
          <View style={{ flex: 1 }}>
            <Text style={styles.flatListTitleText}>{'(Select Option)'}</Text>
            {/* <View style={{ flex: 1, }}> */}
            <FlatList
              data={data}
              numColumns={1}
              renderItem={({ item, index }) =>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedTools(item.text)
                    if (item?.id == 1) {
                      navigation.navigate("HappiGUIDE")
                    }
                    if (item?.id == 2) {
                      navigation.navigate("HappiBUDDY")
                    }
                    if (item?.id == 3) {
                      navigation.navigate("HappiTALK")
                    }
                  }}>
                  <View style={[styles.recomFlatListItem, { backgroundColor: getColor(index) }, { borderWidth: selectedTools.includes(item?.text) ? 1 : 0 }]}>
                    <Text style={styles.recomFlatListItemText}>{item?.text}</Text>
                  </View>
                </TouchableOpacity>
              }
              keyExtractor={(item) => item?.id?.toString()}
            />
          </View>
        );
      }
    }

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: colors.senderBubble,
            shadowColor: colors.borderLight,
            shadowOffset: { width: wp(0.5), height: hp(0.1) },
            shadowRadius: hp(1),
            shadowOpacity: 0.5,
            paddingHorizontal: hp(1),
            marginBottom: hp(1),
            elevation: 5,
          },
          left: {
            backgroundColor: colors.receiverBubble,
            shadowColor: colors.borderLight,
            shadowOffset: { width: wp(0.5), height: hp(0.1) },
            shadowRadius: hp(1),
            shadowOpacity: 0.5,
            paddingHorizontal: hp(1),
            marginBottom: hp(1),
            elevation: 5,
          },
        }}
        textStyle={{
          right: { color: "#2B2E2E", fontFamily: "Poppins" },
          left: { color: "#fff", fontFamily: "Poppins" },
        }}
      />
    );
  };


  return (
    <View style={{ height: '100%', paddingBottom: hp(1) }}>
      <Header showBack={true} navigation={navigation} />
      {/* <View style={{ height: hp(1) }} /> */}
      <View style={{ flex: 1, borderTopColor: 'lightgrey', borderTopWidth: 0.5 }}>

        {loadingButton && (
          <ActivityIndicator size='large' style={{ marginTop: 100, flex: 1, alignSelf: 'center' }} color={colors.loaderColor} />
        )
        }

        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{ _id: 1 }}
          renderBubble={botChatBubble}
          renderTime={_renderBubbleTime}
          alwaysShowSend={enableSend}
        />
        {enableConfirm &&
          <View style={[styles.optionsCont, { height: 95 }]} >
            <Text numberOfLines={5} style={styles.optionsText}>{selectedOpt.join(', ').toString()}</Text>
            <TouchableOpacity onPress={() => sendMessageFromChatbot(selectedOpt.join(', ').toString(), false, '', false)}>
              <MaterialCommunityIcons name="send" size={28} color="blue" style={{ alignSelf: 'flex-end' }} />
            </TouchableOpacity>

          </View>
        }
        {confirmPriority &&
          <View style={[styles.optionsCont, { height: 50 }]} >
            <Text numberOfLines={5} style={styles.optionsText}>{selectedCat}</Text>
            <TouchableOpacity onPress={() => {
              sendMessageFromChatbot(selectedCat, false, '', false)
              setConfirmPriority(false)
            }}>
              <MaterialCommunityIcons name="send" size={28} color="blue" style={{ alignSelf: 'flex-end' }} />
            </TouchableOpacity>

          </View>
        }
        {goToRecoms &&
          <View style={[styles.optionsCont, { height: 50 }]} >
            <Text numberOfLines={1} style={styles.optionsText}>{selectRecomOpt}</Text>
            <TouchableOpacity onPress={() => {
              sendMessageFromChatbot(selectRecomOpt, false, '', false)
              setGoToRecoms(false)
            }}>
              <MaterialCommunityIcons name="send" size={28} color="blue" style={{ alignSelf: 'flex-end' }} />
            </TouchableOpacity>

          </View>
        }
        {gotoAssessment &&
          <View style={styles.ResClick} >
            <TouchableOpacity onPress={() => {
              // navigation.navigate("BotAssessment", { cat_id: categoryId })
              if (authState.user) {
                  navigation.navigate("BotAssessment", { cat_id: categoryId })
              }
              else {
                navigation.navigate("WelcomeScreen");
              }
            }} style={{ backgroundColor: 'white' }}>
              <View style={{ backgroundColor: 'mediumaquamarine', borderRadius: 8 }}>
                <Text style={styles.ResClicktext}>Start Assessment</Text>
              </View>
            </TouchableOpacity>
          </View>
        }
        {gotoVideo &&
          <View style={styles.ResClick} >
            <TouchableOpacity onPress={() => {
              navigation.navigate("VideoScreen")
            }} style={{ backgroundColor: 'white' }}>
              <View style={{ backgroundColor: 'mediumaquamarine', borderRadius: 8 }}>
                <Text style={styles.ResClicktext}>Start Video</Text>
              </View>
            </TouchableOpacity>
          </View>
        }
      </View>
    </View >
  );
}


export default ChatHome;

const styles = StyleSheet.create({
  chatAddButton: {
    backgroundColor: "#4CA6A8",
    width: hp(6),
    height: hp(6),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: hp(100),
  },
  flatListItem: {
    backgroundColor: colors.receiverBubble,
    alignItems: "center",
    marginEnd: hp(1),
    marginTop: hp(1),
    borderRadius: hp(1),
    justifyContent: "center",
    height: hp(8.2),
    width: wp(38),
    borderColor: 'black'
  },
  recomFlatListItem: {
    backgroundColor: colors.receiverBubble,
    alignItems: "center",
    marginEnd: hp(1.5),
    marginTop: hp(1.5),
    borderRadius: hp(1),
    justifyContent: "center",
    height: hp(9.5),
    width: wp(77),
    borderColor: 'black'
  },
  flatListItemText: {
    margin: 10,
    // color: '#fff',
    color: 'black',
    fontWeight: '700',
    fontFamily: "Poppins",
    fontSize: RFValue(12),
    justifyContent: "center",
    textAlign: 'center',
    marginLeft: hp(0.5),
    marginRight: hp(0.5),
  },
  recomFlatListItemText: {
    color: '#fff',
    fontWeight: '900',
    fontFamily: "Poppins",
    fontSize: RFValue(12.5),
    justifyContent: "center",
    textAlign: 'center',
    marginLeft: hp(0.5),
    marginRight: hp(0.5),
  },
  flatListTitleText: {
    color: colors.borderDark,
    fontWeight: '700',
    fontFamily: "Poppins",
    fontSize: RFValue(12),
  },
  optionsText: {
    flex: 1,
    marginRight: 5,
    // fontFamily: "PoppinsMedium",
    fontFamily: "Poppins",
    fontSize: RFValue(12),
  },
  optionsCont: {
    borderColor: 'grey',
    borderWidth: 0.4,
    // height: 95,
    marginTop: -50,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingStart: 20,
    paddingEnd: 20
  },
  ResClick: {
    borderColor: 'grey',
    borderWidth: 0.4,
    height: 60,
    // width: hp(30),
    marginTop: -50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ResClicktext: {
    padding: 10,
    marginLeft: 40,
    marginRight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(13),
  }
}
)
