import React from "react";
import { Text, View, Image } from "react-native";
import { StackActions, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Navigation Stack
import HomeStackScreen from "../Individual/HomeStackScreen";
import ExploreServicesStackScreen from "../Individual/ExploreServicesStackScreen";
import Notification from "../../screens/Individual/Notification";
import OfferUpdates from "../../screens/shared/OfferUpdates";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const focusedRoute =
          getFocusedRouteNameFromRoute(route) ?? "Home";
        const hideTabBar =
          focusedRoute !== "Home" && focusedRoute !== "HomeScreen";
        return {
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = require("../../assets/images/tab_home.png");
          } else if (route.name === "ExploreServices") {
            iconName = require("../../assets/images/tab_grid.png");
          } else if (route.name === "Notification") {
            iconName = require("../../assets/images/tab_notification.png");
          } else if (route.name === "Offers") {
            iconName = require("../../assets/images/drawer_offers.png");
          }
          return (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.iconWrapperActive,
              ]}
            >
              <Image source={iconName} style={styles.icon} resizeMode="contain" />
            </View>
          );
        },
        tabBarShowLabel: false,
        tabBarStyle: hideTabBar
          ? { display: "none" }
          : {
              height: hp(9) + insets.bottom,
              paddingVertical: hp(1),
              paddingBottom: insets.bottom,
              margin: 0,
              backgroundColor: "#EFEBFF",
            },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        };
      }}
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
        listeners={({ navigation }) => ({
          tabPress: () => {
            const state = navigation.getState?.();
            const innerState = state?.routes?.[state.index]?.state ?? state;
            if (innerState && innerState.routes && innerState.index > 0) {
              navigation.dispatch(StackActions.popToTop());
            }
          },
        })}
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

const styles = {
  iconWrapper: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(5) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapperActive: {
    backgroundColor: "#E5DFFF",
  },
  icon: {
    width: hp(2),
    height: hp(2),
  },
};
