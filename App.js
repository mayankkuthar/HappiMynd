import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { LogBox, View, Text, ActivityIndicator } from "react-native";
import JailMonkey from "jail-monkey";
// Firebase - Initialize before any Firebase usage
import "./src/context/Firebase";
// Screens
import Main from "./src/screens/Main";
// Context
import { Hprovider } from "./src/context/Hcontext";
// Components
import Snack from "./src/components/common/Snack";

LogBox.ignoreLogs(["useNativeDriver"]);

const App = () => {
  const [loaded] = useFonts({
    Poppins: require("./src/assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("./src/assets/fonts/Poppins-Bold.ttf"),
    PoppinsSemiBold: require("./src/assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsMedium: require("./src/assets/fonts/Poppins-Medium.ttf"),
  });

  // Show a simple loading indicator while fonts load
  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#00ffbfff" />
      </View>
    );
  }

  return (
    <>
      {JailMonkey.isJailBroken() ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 18, padding: 10, textAlign: "center" }}>
            This application is not supported to rooted device.
          </Text>
        </View>
      ) : (
        <Hprovider>
          <StatusBar backgroundColor="white" style="dark" />
          <Main />
          {/* <Snack /> */}
        </Hprovider>
      )}
    </>
  );
};

registerRootComponent(App);
export default App;
