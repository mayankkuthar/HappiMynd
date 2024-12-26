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
import ExploreServices from "../../screens/Individual/ExploreServices";
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
import SleepMusic from "../../screens/Individual/SleepMusic";
import SubCourses from "../../screens/HappiSELF/SubCourses";
import TimerScreen from "../../screens/Individual/TimerScreen";
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

const ExploreServicesStack = createNativeStackNavigator();

const ExploreServicesStackScreen = ({ navigation, route }) => {
  // COntext Variables
  const { authState } = useContext(Hcontext);

  return (
    <ExploreServicesStack.Navigator initialRouteName="ExploreServices">
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="ExploreServices"
        component={ExploreServices}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="HappiSELF"
        component={HappiSELF}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="HappiLIFE"
        component={HappiLIFE}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="HappiBUDDY"
        component={HappiBUDDY}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="HappiTALK"
        component={HappiTALK}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="HappiSPACE"
        component={HappiSPACE}
      />
      {/* <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="SubscribedServices"
        component={SubscribedServices}
      /> */}
      {/* <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="HappiLIFEScreening"
        component={HappiLIFEScreening}
      /> */}
      {/* <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="HappiLEARN"
        component={HappiLEARN}
      /> */}
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="HappiBuddyConnect"
        component={HappiBuddyConnect}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="HappiBUDDYChat"
        component={HappiBUDDYChat}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="Filters"
        component={Filters}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="SearchResults"
        component={SearchResults}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="Pricing"
        component={Pricing}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="ReportReadingBook"
        component={ReportReadingBook}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="HappiTALKBook"
        component={HappiTALKBook}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="HappiSELFBook"
        component={HappiSELFBook}
      />
      {/* <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="HappiSELFTab"
        component={HappiSELFTab}
      /> */}
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="ManageBookings"
        component={ManageBookings}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="Feedback"
        component={Feedback}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="SleepMusic"
        component={SleepMusic}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="SubCourses"
        component={SubCourses}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="TimerScreen"
        component={TimerScreen}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="MakeBooking"
        component={MakeBooking}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="Credits"
        component={Credits}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="HappiGUIDE"
        component={HappiGUIDE}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="HappiLEARNDescription"
        component={HappiLEARNDescription}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="BookingConfirm"
        component={BookingConfirm}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="BookingList"
        component={BookingList}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="BookingFeedback"
        component={BookingFeedback}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="AssessmentComplete"
        component={AssessmentComplete}
      />
      <ExploreServicesStack.Screen
        options={{ headerShown: false }}
        name="ContactVerification"
        component={ContactVerification}
      />
    </ExploreServicesStack.Navigator>
  );
};

export default ExploreServicesStackScreen;
