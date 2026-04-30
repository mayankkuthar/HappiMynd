import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Share,
  Platform,
  Linking,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
  AntDesign,
  Entypo,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
import LogoutModal from "../../components/Modals/LogoutModal";

const SettingCardButton = (props) => {
  // Prop Destructuring
  const { name, icon, pressHandler } = props.data;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={pressHandler}
      style={styles.cardContainer}
    >
      {/* Icon Container */}
      <View style={styles.iconContainer}>{icon ? icon : null}</View>
      {/* Name Container */}
      <View style={styles.cardNameContainer}>
        <Text style={styles.cardNameText}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Setting = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // COntext Varaibles
  const {
    authState,
    authDispatch,
    whiteLabelState,
    deleteAccount,
    userLogout,
    refferalCode,
    screenTrafficAnalytics,
  } = useContext(Hcontext);

  // State Variables
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Mounting
  useEffect(() => {
    screenTrafficAnalytics({ screenName: "Settings Screen" });
  }, []);

  const settingCardData = [
    {
      id: 0,
      name: "Profile",
      icon: <AntDesign name="user" size={hp(2.5)} color="#52B0AC" />,
      pressHandler: () => navigation.navigate("Profile"),
    },
    {
      id: 1,
      name: "Change Password",
      icon: <Feather name="lock" size={hp(2.5)} color="#52B0AC" />,
      pressHandler: () => navigation.navigate("ChangePassword"),
    },
    {
      id: 2,
      name: "Subscribed Services",
      icon: (
        <MaterialIcons name="subscriptions" size={hp(2.5)} color="#52B0AC" />
      ),
      pressHandler: () => navigation.navigate("SubscribedServices"),
    },
    {
      id: 3,
      name: "Explore Services",
      icon: <FontAwesome5 name="compass" size={hp(2.5)} color="#52B0AC" />,
      pressHandler: () => navigation.navigate("ExploreServices"),
    },
    {
      id: 4,
      name: "Delete Account",
      icon: (
        <MaterialCommunityIcons
          name="delete-outline"
          size={hp(2.5)}
          color="#52B0AC"
        />
      ),
      pressHandler: async () => {
        Alert.alert(
          "Account Deletion",
          "Are you sure you really want to delete this account ?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: async () => {
                try {
                  const response = await deleteAccount();
                  console.log("The account deletion response - ", response);
                  if (response.status === "success") {
                    const userRes = await userLogout({
                      token: authState.user.access_token,
                    });
                    await AsyncStorage.removeItem("USER");
                    authDispatch({ type: "LOGOUT" });
                  }
                } catch (err) {
                  console.log(
                    "Some issue while account deletion (Settings.js) - ",
                    err
                  );
                }
              },
            },
          ]
        );
      },
    },
    // {
    //   id: 5,
    //   name: "Recommend to Friends",
    //   icon: <Entypo name="share" size={hp(2.5)} color="#52B0AC" />,
    //   pressHandler: async () => {
    //     const { code } = await refferalCode();
    //     let shareObject;
    //     if (Platform.OS === "ios") {
    //       shareObject = {
    //         title: "HappiMynd",
    //         message: `Empowering you to self manage emotional and mental wellbeing at any stage of life! \n \n \n Please use my refferal code for extra rewards - ${code}`,
    //         url: "https://apps.apple.com/us/app/happimynd-emotional-self-help/id1634742782",
    //       };
    //     } else {
    //       shareObject = {
    //         title: "HappiMynd",
    //         message: `Empowering you to self manage emotional and mental wellbeing at any stage of life! \n\n\n Please use my refferal code for extra rewards - ${code} \n\n\n https://play.google.com/store/apps/details?id=com.happimynd`,
    //         url: "https://play.google.com/store/apps/details?id=com.happimynd",
    //       };
    //     }
    //     Share.share(shareObject);
    //   },
    // },
    // {
    //   id: 6,
    //   name: "Rate App",
    //   icon: <MaterialIcons name="star-rate" size={hp(2.5)} color="#52B0AC" />,
    //   pressHandler: () => {
    //     let url = "";
    //     if (Platform.OS === "ios")
    //       url =
    //         "https://apps.apple.com/us/app/happimynd-emotional-self-help/id1634742782";
    //     else
    //       url = "https://play.google.com/store/apps/details?id=com.happimynd";
    //     Linking.openURL(url);
    //   },
    // },
    {
      id: 7,
      name: "Logout",
      icon: <Feather name="log-out" size={hp(2.5)} color="#52B0AC" />,
      pressHandler: () => setShowLogoutModal(true),
    },
  ];

  return (
    <View style={styles.container}>
      <Header showNav={true} navigation={navigation} />

      <LogoutModal
        showModal={showLogoutModal}
        setShowModal={setShowLogoutModal}
      />

      {/* Sized Box */}
      <View style={{ height: hp(6) }} />

      {/* Body Section */}
      <View style={{ paddingHorizontal: wp(10) }}>
        {settingCardData.map((data) => (
          <View key={data.id}>
            <SettingCardButton data={data} navigation={navigation} />
            {/* Sized Box */}
            <View style={{ height: hp(2) }} />
          </View>
        ))}
      </View>
      {authState.userType === "individual" ? null : whiteLabelState.footer ? (
        <View style={styles.poweredContainer}>
          <Text style={styles.poweredText}>Powered by</Text>

          <View style={{ width: hp(0.5) }} />
          <Image
            source={require("../../assets/images/happimynd_logo.png")}
            style={styles.poweredLogo}
            resizeMode="contain"
          />
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cardContainer: {
    backgroundColor: "#D7FAF9",
    width: wp(80),
    flexDirection: "row",
    borderRadius: 6,
    overflow: "hidden",
  },
  iconContainer: {
    width: hp(5),
    height: hp(5),
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cardNameContainer: {
    // backgroundColor: "red",
    justifyContent: "center",
    paddingHorizontal: hp(2),
  },
  cardNameText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
  poweredContainer: {
    // backgroundColor: "red",
    width: wp(100),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    bottom: hp(2),
  },
  poweredText: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsSemiBold",
    color: "#B9C3C2",
  },
  poweredLogo: {
    // backgroundColor: "green",
    opacity: 0.3,
    width: wp(20),
    height: hp(6),
  },
});

export default Setting;
