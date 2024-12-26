import React, { useState, useEffect, useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Cotext
import { Hcontext } from "../../context/Hcontext";

// Screens
import Language from "../../screens/shared/Language";
import Home from "../../screens/Home/Home";
import SubscribedServices from "../../screens/Individual/SubscribedServices";
import Blog from "../../screens/Individual/Blog";
import HappiSELF from "../../screens/HappiSELF/HappiSELF";
import HappiLIFE from "../../screens/HappiLIFE/HappiLIFE";
import HappiBUDDY from "../../screens/HappyBUDDY/HappiBUDDY";
import HappiTALK from "../../screens/HappiTALK/HappiTALK";
import HappiSPACE from "../../screens/Individual/HappiSPACE";
import HappiLIFEScreening from "../../screens/HappiLIFE/HappiLIFEScreening";
import HappiLEARN from "../../screens/HappiLEARN/HappiLEARN";
import HappiBuddyConnect from "../../screens/HappyBUDDY/HappiBuddyConnect";
import HappiBUDDYChat from "../../screens/HappyBUDDY/HappiBUDDYChat";
import Filters from "../../screens/Individual/Filters";
import SearchResults from "../../screens/HappiLEARN/SearchResults";
import Pricing from "../../screens/Individual/Pricing";
import ExploreServices from "../../screens/Individual/ExploreServices";
import BlogRead from "../../screens/Individual/BlogRead";
import BlogInfoGraphics from "../../screens/Individual/BlogInfoGraphics";
import BlogVideo from "../../screens/Individual/BlogVideo";
import BlogImage from "../../screens/Individual/BlogImage";
import ReportReadingBook from "../../screens/Individual/ReportReadingBook";
import HappiTALKBook from "../../screens/HappiTALK/HappiTALKBook";
import HappiSELFBook from "../../screens/HappiSELF/HappiSELFBook";
import HappiSELFTab from "../../screens/HappiSELF/HappiSELFTab";
import ManageBookings from "../../screens/HappiTALK/ManageBookings";
import Feedback from "../../screens/shared/Feedback";
import SubCourses from "../../screens/HappiSELF/SubCourses";
import TaskScreen from "../../screens/HappiSELF/TaskScreen";
import MakeBooking from "../../screens/HappiTALK/MakeBooking";
import Credits from "../../screens/HappiTALK/Credits";
import HappiGUIDE from "../../screens/HappiGUIDE/HappiGUIDE";
import HappiLEARNDescription from "../../screens/HappiLEARN/HappiLEARNDescription";
import Moods from "../../screens/shared/Moods";
import BookingConfirm from "../../screens/Individual/BookingConfirm";
import BookingList from "../../screens/HappiTALK/BookingList";
import BookingFeedback from "../../screens/Individual/BookingFeedback";
import AssessmentComplete from "../../screens/HappiLIFE/AssessmentComplete";
import ContactVerification from "../../screens/HappiLIFE/ContactVerification";
import Notes from "../../screens/HappiSELF/Notes";
import AddNote from "../../screens/HappiSELF/AddNote";
import LibrarySub from "../../screens/HappiSELF/LibrarySub";
import CompletedScreen from "../../screens/HappiSELF/CompletedScreen";
import VideoCall from "../../screens/HappiTALK/VideoCall";
import GuideBookings from "../../screens/HappiGUIDE/GuideBookings";
import HappiVoice from "../../screens/HappiVOICE/HappiVoice";
import RecordTopic from "../../screens/HappiVOICE/RecordTopic";
import VoiceRecord from "../../screens/HappiVOICE/VoiceRecord";


import Tips from "../../screens/HappiVOICE/Tips";
import Loader from "../../screens/HappiVOICE/Loader";
import AnalysisWait from "../../screens/HappiVOICE/AnalysisWait";
import VoiceReport from "../../screens/HappiVOICE/VoiceReport";
import ReportsCheck from "../../screens/HappiVOICE/ReportsCheck";
import FeatureDetails from "../../screens/HappiVOICE/FeatureDetails";
import ChatHome from "../../screens/Chat/ChatHome";
import HelpLine from "../../screens/Chat/HelpLine";
import BotAssessment from "../../screens/Chat/BotAssessment";
import VideoScreen from "../../screens/Chat/VideoScreen";
import WelcomeScreen from "../../screens/shared/WelcomeScreen";
import ResultScreen from "../../screens/Chat/ResultScreen";







const HomeStack = createNativeStackNavigator();

const HomeStackScreen = ({ navigation, route }) => {
  // COntext Variables
  const { authState } = useContext(Hcontext);

  return (
    <HomeStack.Navigator
      // initialRouteName={
      //   authState.screeningLoginComplete ? "HomeScreen" : "HappiLIFEScreening"
      // }
      initialRouteName={"HomeScreen"}
    >
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="HomeScreen"
        component={Home}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="Moods"
        component={Moods}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="SubscribedServices"
        component={SubscribedServices}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="Blog"
        component={Blog}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="HappiSELF"
        component={HappiSELF}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="HappiLIFE"
        component={HappiLIFE}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="HappiBUDDY"
        component={HappiBUDDY}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="HappiTALK"
        component={HappiTALK}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="HappiVoice"
        component={HappiVoice}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="ChatHome"
        component={ChatHome}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="RecordTopic"
        component={RecordTopic}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="Loader"
        component={Loader}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="VoiceRecord"
        component={VoiceRecord}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="Tips"
        component={Tips}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="AnalysisWait"
        component={AnalysisWait}
      />

      <HomeStack.Screen
        options={{ headerShown: false }}
        name="VoiceReport"
        component={VoiceReport}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="ReportsCheck"
        component={ReportsCheck}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="FeatureDetails"
        component={FeatureDetails}
      />

      <HomeStack.Screen
        option={{ headerShown: false }}
        name="HelpLine"
        component={HelpLine}
      />
      <HomeStack.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name="BotAssessment"
        component={BotAssessment}
      />
      <HomeStack.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name="VideoScreen"
        component={VideoScreen}
      />
      <HomeStack.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name="ResultScreen"
        component={ResultScreen}
      />

      <HomeStack.Screen
        options={{ headerShown: false }}
        name="HappiSPACE"
        component={HappiSPACE}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="HappiLIFEScreening"
        component={HappiLIFEScreening}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="HappiLEARN"
        component={HappiLEARN}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="HappiBuddyConnect"
        component={HappiBuddyConnect}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="HappiBUDDYChat"
        component={HappiBUDDYChat}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="Filters"
        component={Filters}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="SearchResults"
        component={SearchResults}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="Pricing"
        component={Pricing}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="ExploreServices"
        component={ExploreServices}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="BlogRead"
        component={BlogRead}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="BlogInfoGraphics"
        component={BlogInfoGraphics}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="BlogVideo"
        component={BlogVideo}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="BlogImage"
        component={BlogImage}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="ReportReadingBook"
        component={ReportReadingBook}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="HappiTALKBook"
        component={HappiTALKBook}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="VideoCall"
        component={VideoCall}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="HappiSELFBook"
        component={HappiSELFBook}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="HappiSELFTab"
        component={HappiSELFTab}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="ManageBookings"
        component={ManageBookings}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="Feedback"
        component={Feedback}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="LibrarySub"
        component={LibrarySub}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="SubCourses"
        component={SubCourses}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="TaskScreen"
        component={TaskScreen}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="MakeBooking"
        component={MakeBooking}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="Credits"
        component={Credits}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="HappiGUIDE"
        component={HappiGUIDE}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="HappiLEARNDescription"
        component={HappiLEARNDescription}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="BookingConfirm"
        component={BookingConfirm}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="BookingList"
        component={BookingList}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="BookingFeedback"
        component={BookingFeedback}
      />
      <HomeStack.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name="AssessmentComplete"
        component={AssessmentComplete}
      />
      <HomeStack.Screen
        options={{ headerShown: false, gestureEnabled: false }}
        name="ContactVerification"
        component={ContactVerification}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="WelcomeScreen"
        component={WelcomeScreen}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="Notes"
        component={Notes}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="AddNote"
        component={AddNote}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="CompletedScreen"
        component={CompletedScreen}
      />
      <HomeStack.Screen
        options={{ headerShown: false }}
        name="GuideBookings"
        component={GuideBookings}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackScreen;
