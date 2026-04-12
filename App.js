import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { LogBox, View, Text } from "react-native";
import JailMonkey from "jail-monkey";
// Firebase - Initialize before any Firebase usage
import "./src/context/Firebase";
// Screens
import Main from "./src/screens/Main";
import AnimatedSplash from "./src/screens/shared/AnimatedSplash";
// Context
import { Hprovider } from "./src/context/Hcontext";
// Components
import Snack from "./src/components/common/Snack";

LogBox.ignoreLogs(["useNativeDriver"]);

const App = () => {
  const [splashAnimationLoaded, setSplashAnimationLoaded] = useState(false);
  const [loaded] = useFonts({
    Poppins: require("./src/assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("./src/assets/fonts/Poppins-Bold.ttf"),
    PoppinsSemiBold: require("./src/assets/fonts/Poppins-SemiBold.ttf"),
    PoppinsMedium: require("./src/assets/fonts/Poppins-Medium.ttf"),
  });

  useEffect(() => {
    // Increased to 5s to account for debug mode slower startup
    setTimeout(() => setSplashAnimationLoaded(true), 5000);
  }, []);

  // ✅ Show splash while fonts are still loading instead of blank screen
  if (!loaded || !splashAnimationLoaded) {
    return <AnimatedSplash />;
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
