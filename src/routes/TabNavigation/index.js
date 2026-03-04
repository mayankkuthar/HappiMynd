import React from "react";
import { Text, View, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Navigation Stack
import HomeStackScreen from "../Individual/HomeStackScreen";
import ExploreServicesStackScreen from "../Individual/ExploreServicesStackScreen";
import Notification from "../../screens/Individual/Notification";
import OfferUpdates from "../../screens/shared/OfferUpdates";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused
              ? require("../../assets/images/tab_home_active.png")
              : require("../../assets/images/tab_home.png");
          } else if (route.name === "ExploreServices") {
            iconName = focused
              ? require("../../assets/images/tab_grid_active.png")
              : require("../../assets/images/tab_grid.png");
          } else if (route.name === "Notification") {
            iconName = focused
              ? require("../../assets/images/tab_notification_active.png")
              : require("../../assets/images/tab_notification.png");
          } else if (route.name === "Offers") {
            iconName = focused
              ? require("../../assets/images/drawer_offers_active.png")
              : require("../../assets/images/drawer_offers.png");
          }
          return (
            <Image
              source={iconName}
              style={{
                width: focused ? hp(8.5) : hp(3.5),
                height: focused ? hp(8.5) : hp(3.5),
              }}
            />
          );
        },
        tabBarShowLabel: false,
        tabBarStyle: { height: hp(10), paddingVertical: hp(1.5), margin: 0 },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
      initialRouteName="Home"
    >
      <Tab.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeStackScreen}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="ExploreServices"
        component={ExploreServicesStackScreen}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Notification"
        component={Notification}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Offers"
        component={OfferUpdates}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
