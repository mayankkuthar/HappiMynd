import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Routes
import TabNavigation from "../TabNavigation";

// Components
import CustomDrawer from "../../components/common/CustomDrawer";

// Screens
import Language from "../../screens/shared/Language";
import About from "../../screens/shared/About";
import Reffer from "../../screens/Individual/Reffer";
import Offers from "../../screens/Individual/Offers";
import FAQ from "../../screens/shared/FAQ";
import PrivacyPolicy from "../../screens/shared/PrivacyPolicy";
import Contact from "../../screens/shared/Contact";
import Rate from "../../screens/shared/Rate";
import Whatsapp from "../../screens/Individual/Whatsapp";
import Terms from "../../screens/shared/Terms";
import Feedback from "../../screens/shared/Feedback";
import Moods from "../../screens/shared/Moods";
import OfferUpdates from "../../screens/shared/OfferUpdates";
import SettingStackScreen from "../Individual/SettingStackScreen";
import Header from "../../components/common/Header";

// Context
import { Hcontext } from "../../context/Hcontext";
import { colors } from "../../assets/constants";

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  // COntext Variables
  const { authState } = useState(Hcontext);
  return (
    <Drawer.Navigator
      initialRouteName="HomeTab"
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        options={{
          headerShown: false,
          drawerIcon: (color) => (
            <Image
              style={styles.icon}
              source={require("../../assets/images/drawer_home.png")}
              resizeMode="contain"
            />
          ),
          drawerLabel: (color, focused) => (
            <Text style={styles.text}>Home</Text>
          ),
        }}
        name="HomeTab"
        component={TabNavigation}
        initialParams={{ screen: "About" }}
      />
      <Drawer.Screen
        options={{
          headerShown: false,
          drawerIcon: (color) => (
            <Image
              style={styles.icon}
              source={require("../../assets/images/drawer_about.png")}
              resizeMode="contain"
            />
          ),
          drawerLabel: (color, focused) => (
            <Text style={styles.text}>About us</Text>
          ),
        }}
        name="About"
        component={About}
      />
      {/* <Drawer.Screen
        options={{
          headerShown: false,
          drawerIcon: (color) => (
            <Image
              style={styles.icon}
              source={require("../../assets/images/drawer_reffer.png")}
              resizeMode="contain"
            />
          ),
          drawerLabel: (color, focused) => (
            <Text style={styles.text}>Refer and share link</Text>
          ),
        }}
        name="Reffer"
        component={Reffer}
      /> */}
      {/* <Drawer.Screen
        options={{
          headerShown: false,
          drawerIcon: (color) => (
            <Image
              style={styles.icon}
              source={require("../../assets/images/drawer_offers.png")}
              resizeMode="contain"
            />
          ),
          drawerLabel: (color, focused) => (
            <Text style={styles.text}>Offers and rewards</Text>
          ),
        }}
        name="Offers"
        // component={Offers}
        component={OfferUpdates}
      /> */}
      <Drawer.Screen
        options={{
          headerShown: false,
          drawerIcon: (color) => (
            <Image
              style={styles.icon}
              source={require("../../assets/images/drawer_faq.png")}
              resizeMode="contain"
            />
          ),
          drawerLabel: (color, focused) => (
            <Text style={styles.text}>FAQs</Text>
          ),
        }}
        name="FAQ"
        component={FAQ}
      />
      <Drawer.Screen
        options={{
          headerShown: false,
          drawerIcon: (color) => (
            <Image
              style={styles.icon}
              source={require("../../assets/images/drawer_policy.png")}
              resizeMode="contain"
            />
          ),
          drawerLabel: (color, focused) => (
            <Text style={styles.text}>Privacy Policy</Text>
          ),
        }}
        name="PrivacyPolicy"
        component={PrivacyPolicy}
      />
      <Drawer.Screen
        options={{
          headerShown: false,
          drawerIcon: (color) => (
            <Image
              style={styles.icon}
              source={require("../../assets/images/drawer_contact.png")}
              resizeMode="contain"
            />
          ),
          drawerLabel: (color, focused) => (
            <Text style={styles.text}>Contact us</Text>
          ),
        }}
        name="Contact"
        component={Contact}
      />
      <Drawer.Screen
        options={{
          headerShown: false,
          drawerIcon: (color) => (
            <Image
              style={styles.icon}
              source={require("../../assets/images/drawer_rate.png")}
              resizeMode="contain"
            />
          ),
          drawerLabel: (color, focused) => (
            <Text style={styles.text}>Rate us</Text>
          ),
        }}
        name="Rate"
        component={Feedback}
      />
      {/* <Drawer.Screen
        options={{
          headerShown: false,
          drawerIcon: (color) => (
            <Image
              style={styles.icon}
              source={require("../../assets/images/drawer_whatsapp.png")}
              resizeMode="contain"
            />
          ),
          drawerLabel: (color, focused) => (
            <Text style={styles.text}>WhatsApp</Text>
          ),
        }}
        name="Whatsapp"
        component={Whatsapp}
      /> */}
      <Drawer.Screen
        options={{
          headerShown: false,
          drawerIcon: (color) => (
            <Image
              style={styles.icon}
              source={require("../../assets/images/drawer_terms.png")}
              resizeMode="contain"
            />
          ),
          drawerLabel: (color, focused) => (
            <Text style={styles.text}>Terms of Engagement</Text>
          ),
        }}
        name="Terms"
        component={Terms}
      />
      <Drawer.Screen
        options={{
          headerShown: false,
          drawerIcon: (color) => (
            <Image
              style={styles.icon}
              source={require("../../assets/images/drawer_feedback.png")}
              resizeMode="contain"
            />
          ),
          drawerLabel: (color, focused) => (
            <Text style={styles.text}>Feedback</Text>
          ),
        }}
        name="Feedback"
        component={Feedback}
        // component={() => <Feedback screenType="Feedback" />}
      />
      <Drawer.Screen
        options={{
          headerShown: false,
          drawerIcon: (color) => (
            <Image
              style={styles.icon}
              source={require("../../assets/images/tab_setting.png")}
              resizeMode="contain"
            />
          ),
          drawerLabel: (color, focused) => (
            <Text style={styles.text}>Settings</Text>
          ),
        }}
        name="Settings"
        component={SettingStackScreen}
      />
      {/* <Drawer.Screen
        options={{
          headerShown: false,
          drawerIcon: (color) => (
            <Image
              style={styles.icon}
              source={require("../../assets/images/drawer_reffer.png")}
              resizeMode="contain"
            />
          ),
          drawerLabel: (color, focused) => (
            <Text style={styles.text}>Mood-O-Meter</Text>
          ),
        }}
        name="Mood-O-Meter"
        component={Moods}
        // component={() => <Feedback screenType="Feedback" />}
      /> */}
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: hp(3),
    height: hp(3),
  },
  text: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
});

export default DrawerNavigation;
