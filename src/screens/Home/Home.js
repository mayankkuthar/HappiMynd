import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Linking,
  Alert,
  AppState,
  Share,
  Platform
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Feather, AntDesign } from "@expo/vector-icons";
// import RecordScreen from "react-native-record-screen";
import * as FileSystem from "expo-file-system";
import * as Analytics from "expo-firebase-analytics";

// Components
import Header from "../../components/common/Header";
import WaveIconButton from "../../components/buttons/WaveIconButton";
import CategoryButton from "../../components/buttons/CategoryButton";
import BlogCard from "../../components/cards/BlogCard";
import LockedBlogCard from "../../components/cards/LockedBlogCard";
import UpgradeModal from "../../components/Modals/UpgradeModal";
import DiaryNotifies from "../../components/notifiers/DiaryNotifies";
import MessageNotifies from "../../components/notifiers/MessageNotifies";
import SessionNotifies from "../../components/notifiers/SessionNotifies";
import MoodNotifies from "../../components/notifiers/MoodNotofies";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

const UserPane = (props) => {
  // Prop Destructuring
  const {
    navigation,
    isSubscribed = false,
    setIsSubscribed = () => { },
    isEmailVerified = false,
    setIsEmailVerified = () => { },
    isPhoneVerified = false,
    setIsPhoneVerified = () => { },
  } = props;

  // State Variables
  const [loading, setLoading] = useState(true);

  // Context variables
  const {
    authState,
    authDispatch,
    getReport,
    startAssessment,
    getSubscriptions,
    getUserProfile,
    AnyAssessment,
  } = useContext(Hcontext);

  // Hits when focus hits
  useFocusEffect(
    React.useCallback(() => {
      checkAssessmentStatus();
      checkSubscription();
      fetchUserProfile(authState?.user?.access_token);
      return () => { };
    }, [])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      checkAssessmentStatus();
      checkSubscription();
    });

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  const checkSubscription = async () => {
    setLoading(true);
    try {
      const mySub = await getSubscriptions();

      if (mySub?.status === "success") {
        const isSub = mySub.data.find(
          (sub) => sub.name === "HappiLIFE Screening"
        );
        if (isSub) setIsSubscribed(true);
      }
    } catch (err) {
      console.log("Some issue while checking subscription - ", err);
    }
    setLoading(false);
  };

  const checkAssessmentStatus = async () => {
    setLoading(true);
    try {
      const token = authState.user.access_token;

      // Getting the user Screening Assessment Status
      const assessmentRes = await startAssessment({ token });

      // Id screening is completed than update the Global State
      if (assessmentRes?.message?.includes("completed")) {
        authDispatch({ type: "COMPLETE_SCREENING", payload: true });
      } else {
        authDispatch({ type: "COMPLETE_SCREENING", payload: false });
      }

      const checkassess = await AnyAssessment({token});

      if (checkassess?.message?.includes("Yes")) {
        authDispatch({ type: "ANY_COMPLETE_SCREENING", payload: true });
      } else {
        authDispatch({ type: "ANY_COMPLETE_SCREENING", payload: false });
      }

    } catch (err) {
      console.log("Checking the assessment status - ", err);
    }
    setLoading(false);
  };

  const fetchUserProfile = async (token) => {
    try {
      const userProfile = await getUserProfile({ token });

      console.log("checking in the user profile - ", userProfile);

      if (userProfile.status === "success") {
        if (userProfile.data.verify_user) {
          if (userProfile.data.verify_user.email_verify) {
            setIsEmailVerified(true);
          }
          if (userProfile.data.verify_user.mobile_verify) {
            setIsPhoneVerified(true);
          }
        }
        if (userProfile.data.user_token) {
          authDispatch({
            type: "USER_UPDATE",
            payload: { user_token: userProfile.data.user_token },
            userType: "organisation",
          });
        } else {
          authDispatch({
            type: "USER_UPDATE",
            userType: "individual",
          });
        }
      }
    } catch (err) {
      console.log("Some issue while fetching user profile - ", err);
    }
  };

  // Report download functionality
  //********* download report for Android devices **********/
  const downloadReportAndroid = async (url) => {
    FileSystem.downloadAsync(url, FileSystem.documentDirectory + "report.pdf")
      .then(({ uri }) => {
        console.log("Finished downloading to ", uri);
        createOneButtonAlert("Report Successfully Downloaded");
      })
      .catch((error) => {
        console.error("Some issue while downloading file - ", error);
        createOneButtonAlert("Report Download Failed");
      });
  };

  //********* download report for ios devices **********/
  const downloadReport = async (url) => {
    try {
      const directory = FileSystem.documentDirectory + 'happimynd/';

      // Ensure the directory exists
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }

      const fileUri = directory + 'report.pdf';

      const { uri } = await FileSystem.downloadAsync(url, fileUri);
      console.log('Finished downloading to ', uri);
      createOneButtonAlert('Report Successfully Downloaded');

      // Share the downloaded file
      const mimeType = 'application/pdf'; // Adjust according to your file type
      shareFile(uri, mimeType);
    } catch (error) {
      console.error('Some issue while downloading file - ', error);
      createOneButtonAlert('Report Download Failed');
    }
  };

  const shareFile = async (fileUri, mimeType) => {
    try {
      const options = {
        mimeType: mimeType,
        dialogTitle: 'Share file',
        UTI: 'public.data',
      };
      await Share.share({ url: fileUri }, options);
    } catch (error) {
      console.error('Error sharing file:', error.message);
    }
  };

  const createOneButtonAlert = (message) =>
    Alert.alert("Report Status", message, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);

  return (
    <View style={{ paddingHorizontal: wp(6) }}>
      {/* Sized Box */}
      <View style={{ height: hp(2) }} />

      <View>
        {authState.user ? (
          <Text style={styles.userPaneTitle}>
            Hello {authState?.user?.user ? authState?.user?.user.username : ""},
          </Text>
        ) : null}
        <Text style={styles.userPaneDesc}>
          Continue Your Mental Wellbeing Journey
        </Text>
      </View>
      <View style={styles.userPaneButtons}>
        {authState.user && authState.isAnyScreeningComplete ? (
          loading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="small" color={colors.loaderColor} />
            </View>
          ) : (
            <WaveIconButton
              // text={
              //   isSubscribed || (isEmailVerified && isPhoneVerified)
              //     ? "Download"
              //     : "Get"
              // }
              text={isSubscribed ? "Download" : "Get"}
              subText="Awareness Report"
              isSubscribed = {isSubscribed}
              width={42}
              icon={require("../../assets/images/waveicon_progress.png")}
              // pressHandler={async () => {
              //   if (!isSubscribed) {
              //     return navigation.push("Pricing");
              //   }

              //   return navigation.push("ContactVerification");

              //   const reportRes = await getReport();
              //   console.log("Cheking the report res - ", reportRes);
              //   if (reportRes.status === "success") {
              //     // navigation.push("AssessmentComplete");
              //     Linking.openURL(reportRes.url);
              //     // downloadReport(reportRes.url);
              //   }
              // }}
              pressHandler={async () => {
                if (Platform.OS == 'android') {
                  if (!isSubscribed) {
                    return navigation.push("Pricing");
                  }

                  return navigation.push("AllReports");

                  const reportRes = await getReport();
                  console.log("Cheking the report res - ", reportRes);
                  if (reportRes.status === "success") {
                    Linking.openURL(reportRes.url);
                    downloadReportAndroid(reportRes.url);
                  }
                } else {
                  // if (isSubscribed || (isEmailVerified && isPhoneVerified)) {
                  if (isSubscribed) {
                    return navigation.push("AllReports");
                    const reportRes = await getReport();
                    console.log("Cheking the report res - ", reportRes);
                    if (reportRes.status === "success") {
                      // navigation.push("AssessmentComplete");
                      // Linking.openURL(reportRes?.url);
                      downloadReport(reportRes?.url);
                    }
                    return;
                  }
                  if (!isEmailVerified || !isPhoneVerified) {
                    return navigation.push("ContactVerification");
                  }
                  if (!isSubscribed) {
                    return navigation.push("Pricing");
                  }
                }
                // return navigation.push("ContactVerification");
              }}
            />
          )
        ) : (
          <WaveIconButton
            text="HappiLIFE"
            subText="Awareness Tool"
            width={42}
            icon={require("../../assets/images/waveicon_progress.png")}
            pressHandler={() => {
              if (authState.user) navigation.push("HappiLIFEScreening");
              else navigation.push("WelcomeScreen");
            }}
          />
        )}
        <WaveIconButton
          text="My"
          subText="Subscribed services"
          width={42}
          icon={require("../../assets/images/waveicon_card.png")}
          pressHandler={() => {
            if (authState.user) navigation.push("SubscribedServices");
            else navigation.push("WelcomeScreen");
          }}
        />
      </View>
    </View>
  );
};

const ServiceSection = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variabels
  const { authState } = useContext(Hcontext);

  // const startRecording = async () => {
  //   RecordScreen.startRecording().catch((error) => console.error(error));
  //   // try {
  //   // } catch (err) {
  //   //   console.log("Some issue while recording - ", err);
  //   // }
  // };

  // const stopRecording = async () => {
  //   try {
  //     const res = await RecordScreen.stopRecording().catch((error) =>
  //       console.warn(error)
  //     );
  //     if (res) {
  //       const url = res.result.outputURL;
  //     }
  //   } catch (err) {
  //     console.log("Some issue while stop recording - ", err);
  //   }
  // };

  return (
    <View>
      <Image
        source={require("../../assets/images/home_rectangle.png")}
        style={{
          width: wp(100),
          height: hp(16),
          position: "absolute",
          bottom: hp(6.5),
        }}
      />
      <View style={{ paddingHorizontal: wp(6) }}>
        {/* Title Section */}
        <View>
          <Text style={styles.serviceTitle}>Our Services</Text>
          <Text style={styles.serviceDesc}>
            Help you to take care of your mind
          </Text>
        </View>
        {/* Icon Section */}
        <View style={styles.serviceIconContainer}>
          <CategoryButton
            text="HappiLIFE"
            icon={require("../../assets/images/category_people.png")}
            iconSize={4.5}
            pressHandler={() => navigation.push("HappiLIFE")}
          />
          <CategoryButton
            text="HappiGUIDE"
            icon={require("../../assets/images/category_report.png")}
            iconSize={4}
            pressHandler={() => navigation.push("HappiGUIDE")}
          />
          <CategoryButton
            text="HappiLEARN"
            icon={require("../../assets/images/category_book.png")}
            iconSize={3.5}
            pressHandler={() => navigation.push("HappiLEARNDescription")}
          />
          <CategoryButton
            text="HappiBUDDY"
            icon={require("../../assets/images/category_chat.png")}
            iconSize={3.5}
            pressHandler={() => navigation.push("HappiBUDDY")}
          />
        </View>
        <View style={styles.serviceIconContainer}>
          <CategoryButton
            text="HappiSELF"
            icon={require("../../assets/images/category_mobile.png")}
            iconSize={3.5}
            pressHandler={() => navigation.push("HappiSELF")}
          />
          <CategoryButton
            text="HappiTALK"
            icon={require("../../assets/images/category_talk.png")}
            iconSize={3.5}
            pressHandler={() => navigation.push("HappiTALK")}
          />
          <CategoryButton
            text="HappiVOICE"
            icon={require("../../assets/images/microphone2.png")}
            iconSize={4.5}
            pressHandler={() => navigation.push("HappiVoice")}
          />

          {/* <CategoryButton
            text="Join Community"
            icon={require("../../assets/images/category_add.png")}
            iconSize={4.5}
            pressHandler={() => {}}
          /> */}
          <CategoryButton
            text="Extra Services"
            icon={require("../../assets/images/category_game.png")}
            iconSize={3.5}
            pressHandler={() =>
              authState.user
                ? navigation.push("SubscribedServices")
                : navigation.push("WelcomeScreen")
            }
          />
        </View>
      </View>
    </View>
  );
};

const BlogSection = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { happiLearnList } = useContext(Hcontext);

  // State varaibles
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hits when focus hits
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async (search = "") => {
    setLoading(true);
    try {
      const data = await happiLearnList({ search });
      console.log("Chekcing the list home - ", data);
      if (data.status === "success") {
        setListing(data.data.data);
        // setRecentlyViewed(data.recently_viewed.data);
      }
    } catch (err) {
      console.log("Some issue while showing the listing - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.blogSection}>
      <UpgradeModal
        navigation={navigation}
        showModal={showUpgradeModal}
        setShowModal={setShowUpgradeModal}
      />
      <Text style={styles.blogSectionTitle}>Happi Blogs</Text>
      <ScrollView horizontal={true} style={{ paddingVertical: hp(2) }}>
        {/* <LockedBlogCard
          navigation={navigation}
          showUpgradeModal={showUpgradeModal}
          setShowUpgradeModal={setShowUpgradeModal}
          // data={item}
        /> */}
        {listing.map((item, index) => (
          <BlogCard
            data={item}
            key={index}
            navigation={navigation}
            setShowUpgradeModal={setShowUpgradeModal}
          />
        ))}
      </ScrollView>

      {/* Sized Box */}
      <View style={{ height: hp(2) }} />
    </View>
  );
};

const Home = (props) => {
  // COntext Variables
  const {
    authState,
    currentlyAssignedPsycologist,
    getWhiteLabel,
    whiteLabelState,
    whiteLabelDispatch,
    myBookingUsers,
    totalRewardPoints,
    screenTrafficAnalytics,
  } = useContext(Hcontext);

  // Prop Destructuring
  const { navigation } = props;

  // State Varibales
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);

  // Mounting
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      checkWhiteLabeling();
      fetchTotalPoints();
    });

    // Record user mood at every app open
    navigation.push("Moods");

    screenTrafficAnalytics({ screenName: "Home" });

    screenAnalytics();

    return unsubscribe;
  }, []);

  const checkWhiteLabeling = async () => {
    try {
      const whiteLabelRes = await getWhiteLabel();

      if (whiteLabelRes.status === "success") {
        whiteLabelDispatch({
          type: "SET_WHITE_LABEL",
          payload: {
            header: whiteLabelRes.header,
            footer: whiteLabelRes.footer,
            logo: whiteLabelRes.logo ? whiteLabelRes.logo : null,
          },
        });
      }
    } catch (err) {
      console.log("Some issue while checking white label - ", err);
    }
  };

  const fetchTotalPoints = async () => {
    try {
      const fetchedPoints = await totalRewardPoints();
      console.log("check the reward points - ", fetchedPoints);
      if (fetchedPoints.status === "success") {
        setRewardPoints(fetchedPoints.total_reward_points);
      }
    } catch (err) {
      console.log("Some issue while fetching reward points - ", err);
    }
  };

  const screenAnalytics = async () => {
    try {
      await Analytics.logEvent("screen_view", {
        /*
         * We want to know if the user came from which screen
         * opposed to from chat or a deep link.
         */
        sender: "login",
        /*
         * This may be too specific and not very useful, but maybe down the line * we could investigate why a certain user is more popular than others.
         */
        user: authState?.user?.user?.id,
        /*
         * We can use this information later to compare against other events.
         */
        screen: "home",
        purpose: "Viewing user home screen",
      });
    } catch (err) {
      console.log("Check the analytics issue - ", err);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        navigation={navigation}
        showNav={authState.user}
        showPoints={authState.user}
        rewardPoints={rewardPoints}
      />
      <ScrollView>
        <UserPane
          navigation={navigation}
          isSubscribed={isSubscribed}
          isEmailVerified={isEmailVerified}
          isPhoneVerified={isPhoneVerified}
          setIsSubscribed={setIsSubscribed}
          setIsEmailVerified={setIsEmailVerified}
          setIsPhoneVerified={setIsPhoneVerified}
        />

        <DiaryNotifies
          navigation={navigation}
          isSubscribed={isSubscribed}
          isPhoneVerified={isPhoneVerified}
          isEmailVerified={isEmailVerified}
        />
        <MoodNotifies navigation={navigation} />

        <MessageNotifies navigation={navigation} />
        <SessionNotifies navigation={navigation} />

        <ServiceSection navigation={navigation} />
        <BlogSection navigation={navigation} />

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        {/* Powere By Section */}
        {authState.userType === "individual" ? null : whiteLabelState.footer ? (
          <View style={styles.poweredContainer}>
            <Text style={styles.poweredText}>Powered by</Text>

            <View style={{ width: hp(0.5) }} />
            <Image
              source={require("../../assets/images/happimynd_logo.png")}
              style={styles.poweredLogo}
              resizeMode="contain"
            />
          </View>
        ) : null}

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  userPaneTitle: {
    fontSize: RFValue(20),
    fontFamily: "PoppinsSemiBold",
  },
  userPaneDesc: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: colors.borderLight,
  },
  userPaneButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: hp(2),
  },
  serviceTitle: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsSemiBold",
  },
  serviceDesc: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: colors.borderLight,
  },
  serviceIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  blogSection: {
    paddingTop: hp(6),
    paddingHorizontal: wp(6),
  },
  blogSectionTitle: {
    fontSize: RFValue(14),
    fontFamily: "PoppinsSemiBold",
  },
  poweredContainer: {
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  poweredText: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsSemiBold",
    color: "#B9C3C2",
  },
  poweredLogo: {
    // backgroundColor: "green",
    opacity: 0.3,
    width: wp(20),
    height: hp(6),
  },
  messageContainer: {
    // backgroundColor: "red",
    backgroundColor: colors.background,
    height: hp(8),
    width: wp(90),
    alignSelf: "center",
    borderRadius: hp(4),
    // alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(6),
    marginBottom: hp(2),
  },
  messageText: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
  },
  unreadContainer: {
    position: "absolute",
    backgroundColor: "red",
    top: -hp(1),
    right: -hp(1),
    height: hp(3),
    width: hp(3),
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: hp(1),
    // paddingVertical: hp(0.5),
    borderRadius: hp(100),
  },
});

export default Home;
