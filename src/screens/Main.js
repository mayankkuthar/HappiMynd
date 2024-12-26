import React, { useEffect, useContext, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Snack from "../components/common/Snack";
import AuthStackScreen from "../routes/AuthStack/AuthStackScreen";
import DrawerNavigation from "../routes/DrawerNavigation";
import Moods from "./shared/Moods";
import { Hcontext } from "../context/Hcontext";
import { FloatingAction } from "react-native-floating-action";
import Draggable from 'react-native-draggable';


const Main = (props) => {
  const ref = React.useRef(null);
  const { authState, authDispatch, snackState, botVisible, setBotVisible } = useContext(Hcontext);
  const { getSubscriptions, getUserProfile, screenTrafficAnalytics } = useContext(Hcontext);

  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [loading, setLoading] = useState(false);
  const [isEnable, setIsEnable] = useState(false);

  // Mounting
  useEffect(() => {
    // clearAsyncStoage();
    userValidator();
  }, []);

console.log("authsrar ------- ",authState);

  const clearAsyncStoage = async () => {
    try {
      await AsyncStorage.clear();
    } catch (err) {
      console.log("Some issue while clearinng async storage - ", err);
    }
  };

  const userValidator = async () => {
    setLoading(true);
    try {
      const isOnBoarded = await AsyncStorage.getItem("IS_ONBOARDED");

      isOnBoarded && setIsEnable(true)
      const languageAdded = await AsyncStorage.getItem("SELECTED_LANGUAGE");
      const userRes = await AsyncStorage.getItem("USER");

      if (isOnBoarded) authDispatch({ type: "ON_BOARDING_PROCESS" });
      if (languageAdded)
        authDispatch({ type: "LANGUAGE_SELECTION", payload: languageAdded });
      if (userRes)
        authDispatch({ type: "LOGIN", payload: JSON.parse(userRes) });


    } catch (err) {
      console.log("Some issue while validating user - ", err);
    }
    setLoading(false);
  };

  if (loading) return null;


  const handlePress = () => {
    // Add your logic here when the button is pressed
    console.log('Button Pressed!');
  };

  const handleTouchStart = (event) => {
    setIsDragging(true);
    setDragOffset({
      x: event.nativeEvent.pageX - buttonPosition.x,
      y: event.nativeEvent.pageY - buttonPosition.y,
    });
  };

  const handleTouchMove = (event) => {
    if (isDragging) {
      const newX = event.nativeEvent.pageX - dragOffset.x;
      const newY = event.nativeEvent.pageY - dragOffset.y;
      setButtonPosition({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const onPress = () => {
    console.log("pressed ");
    botVisible ? setBotVisible(false) : setBotVisible(true)
    ref.current && ref.current.navigate('ChatHome')
  }

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer ref={ref}>
        {authState.isGuest && authState.isOnBoarded ? (
          !authState.feedbackSubmitted && authState.user ? (
            <Moods />
          ) : authState.user ? (
            <DrawerNavigation />
          ) : (
            <AuthStackScreen />
          )
        ) : authState.user ? (
          <DrawerNavigation />
        ) : (
          <AuthStackScreen />
        )}
        {snackState.visible ? <Snack /> : null}
        {/* <FloatingAction
          floatingIcon={require('../assets/images/ChatBot_Logo.png')}
          iconHeight={45}
          iconWidth={45}
          visible={botVisible}
          distanceToEdge={{ vertical: 90, horizontal: 10 }}
          buttonSize={70}
          animated={true}
          onPressMain={() => {
            botVisible ? setBotVisible(false) : setBotVisible(true)
            ref.current && ref.current.navigate('ChatHome')
          }}
        /> */}


        {botVisible&&authState?.isLogged &&<Draggable
          x={270}
          y={590}
          renderSize={80}
          renderColor="transparent"
          isCircle={false}
          touchableOpacityProps={{ activeOpacity: 1 }} // Set activeOpacity to 1
        >
          <TouchableOpacity style={styles.imageBg} onPress={onPress}>
            <Image
              source={require('../assets/images/live_chat.jpeg')}
              style={{ height: 45, width:45,borderRadius:10 }}
            />
            
          </TouchableOpacity>
        </Draggable>}

      </NavigationContainer>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  fabIcon: {
    marginBottom: 100
  },
  imageBg:{
    backgroundColor:'white',
    height:60,
    width:60,
    borderRadius:50,
    alignItems:'center',
    justifyContent:'center',
    elevation:5,
    borderWidth:1,
    borderColor:'lightgrey',
    zIndex:5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  }
});
