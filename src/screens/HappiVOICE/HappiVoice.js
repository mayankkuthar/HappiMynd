import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";


import { colors, happiVoice_constants } from "../../assets/constants";

import Header from "../../components/common/Header";
// import Button from "../../components/buttons/Button";
import Button from "../../components/buttons/Button";
import { Hcontext } from "../../context/Hcontext";
import API, { getAccessToken, getSignedURL, getTopics, getUserIdentifier } from "./VoiceAPIService";

const HappiVoice = (props) => {
  const { navigation } = props;

  const { authState, getSubscriptions, getUserProfile, setsignedUrlAudio, setTokenSonde, setSondeJobId, setSondeUserId, setVoiceReport } = useContext(Hcontext);

  const [showModal, setShowModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);


  const [userData, setUserData] = useState({})


  // Mounting
  useEffect(() => {

    checkSubscription();
    fetchUserProfile(authState?.user?.access_token);

  }, []);


  const checkSubscription = async () => {
    setLoading(true);
    try {
      const mySub = await getSubscriptions();


      if (mySub.status === "success") {
  
      }
    } catch (err) {
    }
    setLoading(false);
  };

  const fetchUserProfile = async (token) => {
    try {
      setLoadingButton(true);
      const userProfile = await getUserProfile({ token });
      setUserData(userProfile)
    
      if (userProfile.status === "success") {
        if (userProfile.data.verify_user) {
          if (userProfile.data.verify_user.email_verify) {
            setIsEmailVerified(true);
          }
          if (userProfile.data.verify_user.mobile_verify) {
            setIsPhoneVerified(true);
          }
        }
      }
      setLoadingButton(false);

    } catch (err) {
      setLoadingButton(false);
    }
  };


  return (
    <View style={styles.container}>
      <Header showBack={true} navigation={navigation} />
      <ScrollView style={{ paddingHorizontal: wp(9) }}>
        <View style={{ height: hp(4) }} />
        <View>
          <Text style={styles.title}>{happiVoice_constants?.voice_title}</Text>
       
          <Image
            source={require("../../assets/images/HappiVOICErecord.jpeg")}
            resizeMode="contain"
            style={styles.banner}
          />
          <View style={{ height: hp(1) }} />
          

          <View style={styles.detailSection}>
            <Text style={styles.detail}>{happiVoice_constants?.happiVoice_desc}</Text>
          </View>
          <View style={{ height: hp(2) }} />

          {/* <View style={{ height: hp(2) }} > */}

            <View style={{ height: hp(3) }} />
            
            

            {/* <View style={{ height: hp(4) }} /> */}
            
            <Button
              text={happiVoice_constants?.voice_assess}
              loading={loadingButton}
              pressHandler={async () => {
                // console.log("clicked ---- ",authState.user)
                if (authState.user) {
                  let token = await getAccessToken();
                  console.log("token is -----",token);
                  setLoadingButton(true);
                  setTokenSonde(token)
                  const currentYear = new Date().getFullYear();
                  const calbirthYear = currentYear - parseInt(userData?.data?.age, 10);


                  if (token) {
                    setLoadingButton(true);
                    let identifier = await getUserIdentifier(userData?.data, calbirthYear, token);
                    console.log("identifier -------",identifier);
                    setSondeUserId(identifier)
                    if (identifier) {
                      setLoadingButton(true);  
                      let url = await getSignedURL(token, identifier, userData?.data);
                      setLoadingButton(true);
                      console.log("erl is ===",url);
                      if (url) {
                        setLoadingButton(true);  
                        setsignedUrlAudio(url)

                        let topicList = await getTopics();
                        setLoadingButton(true);  

                        let topics = topicList?.list.map((list) => {
                          return list.description
                        })

                        if (topics) {
                           
                          setLoadingButton(false);
  
                          navigation.push("RecordTopic", { topicList: topics});
                        }
                      }

                    }else{
                      setLoadingButton(false);
                      alert("Something wrong at our end. Please try later.");
                    }
                  }

                } else {
                  navigation.push("WelcomeScreen");
                }
              }}
            />
          {/* </View> */}
        </View>


      </ScrollView >


    </View>



  )

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  title: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
  },

  banner: {
    width: wp(90),
    height: hp(35),
    alignSelf: 'center', 
    borderRadius:8
  
  },
  detailSection: {
    backgroundColor: "#FAFFFF",
    paddingHorizontal: hp(2.5),
    paddingVertical: hp(1.5),
    borderRadius: 10,
  },
  detail: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    lineHeight: hp(3),

  },
})

export default HappiVoice;