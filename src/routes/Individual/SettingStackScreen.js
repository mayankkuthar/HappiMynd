import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screens
import Setting from "../../screens/Setting/Setting";
import Profile from "../../screens/Setting/Profile";
import ChangePassword from "../../screens/Setting/ChangePassword";
import SubscribedServices from "../../screens/Individual/SubscribedServices";

const SettingStack = createNativeStackNavigator();

const SettingStackScreen = ({ navigation, route }) => {
  return (
    <SettingStack.Navigator initialRouteName="Setting">
      <SettingStack.Screen
        options={{ headerShown: false }}
        name="Setting"
        component={Setting}
      />
      <SettingStack.Screen
        options={{ headerShown: false }}
        name="Profile"
        component={Profile}
      />
      <SettingStack.Screen
        options={{ headerShown: false }}
        name="ChangePassword"
        component={ChangePassword}
      />
      <SettingStack.Screen
        options={{ headerShown: false }}
        name="SubscribedServices"
        component={SubscribedServices}
      />
    </SettingStack.Navigator>
  );
};

export default SettingStackScreen;
