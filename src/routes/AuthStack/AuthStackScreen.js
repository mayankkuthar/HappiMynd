import React, { useState, useEffect, useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Context
import { Hcontext } from "../../context/Hcontext";

// Screens
import Language from "../../screens/shared/Language";
import OnBoarding from "../../screens/shared/OnBoarding";
import OfferUpdates from "../../screens/shared/OfferUpdates";
import WelcomeScreen from "../../screens/shared/WelcomeScreen";
import Login from "../../screens/Auth/Login";
import GettingStarted from "../../screens/Auth/GettingStarted";
import Register from "../../screens/Auth/Register";
import RegisterWithCode from "../../screens/Auth/RegisterWithCode";
import ForgotPassword from "../../screens/Auth/ForgotPassword";
import VerificationCode from "../../screens/Auth/VerificationCode";
import ResetPassword from "../../screens/Auth/ResetPassword";
import LoginWithCode from "../../screens/Auth/LoginWithCode";
import Home from "../../screens/Home/Home";
import HappiLIFE from "../../screens/HappiLIFE/HappiLIFE";
import HappiGUIDE from "../../screens/HappiGUIDE/HappiGUIDE";
import HappiLEARNDescription from "../../screens/HappiLEARN/HappiLEARNDescription";
import HappiBUDDY from "../../screens/HappyBUDDY/HappiBUDDY";
import HappiSELF from "../../screens/HappiSELF/HappiSELF";
import HappiTALK from "../../screens/HappiTALK/HappiTALK";
import HappiVoice from "../../screens/HappiVOICE/HappiVoice";
import ChatHome from "../../screens/Chat/ChatHome";
import HelpLine from "../../screens/Chat/HelpLine";

const AuthStack = createNativeStackNavigator();

const AuthStackScreen = ({ navigation, route }) => {
  //Context Variables
  const { authState } = useContext(Hcontext);
  return (
    <AuthStack.Navigator
      // initialRouteName={
      //   !authState.selectedLanguage
      //     ? "Language"
      //     : authState.isOnBoarded
      //     ? "Home"
      //     : "OnBoarding"
      // }
      initialRouteName={authState.isOnBoarded ? "Login" : "OnBoarding"}
      // initialRouteName={
      //   !authState.selectedLanguage
      //     ? "Language"
      //     : authState.isOnBoarded
      //     ? "Login"
      //     : "OnBoarding"
      // }
    >
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={Home}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="HappiLIFE"
        component={HappiLIFE}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="HappiGUIDE"
        component={HappiGUIDE}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="HappiLEARNDescription"
        component={HappiLEARNDescription}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="HappiBUDDY"
        component={HappiBUDDY}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="HappiSELF"
        component={HappiSELF}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="HappiTALK"
        component={HappiTALK}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="HappiVoice"
        component={HappiVoice}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="ChatHome"
        component={ChatHome}
      />
      <AuthStack.Screen
        options={{ headerShown: true }}
        name="HelpLine"
        component={HelpLine}
      />
      
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="Language"
        component={Language}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="OnBoarding"
        component={OnBoarding}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="OfferUpdates"
        component={OfferUpdates}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="WelcomeScreen"
        component={WelcomeScreen}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={Login}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="GettingStarted"
        component={GettingStarted}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="Register"
        component={Register}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="RegisterWithCode"
        component={RegisterWithCode}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="ForgotPassword"
        component={ForgotPassword}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="VerificationCode"
        component={VerificationCode}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="ResetPassword"
        component={ResetPassword}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="LoginWithCode"
        component={LoginWithCode}
      />
    </AuthStack.Navigator>
  );
};

export default AuthStackScreen;
