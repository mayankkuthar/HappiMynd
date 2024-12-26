import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { colors } from "../../assets/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// COntext
import { Hcontext } from "../../context/Hcontext";

const LanguageTile = (props) => {
  // Prop Destructuring
  const { image, text, handleSubmit } = props;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handleSubmit}
      style={styles.languageTileContainer}
    >
      <ImageBackground
        source={image}
        style={styles.languageTile}
        resizeMode="cover"
      >
        <Text style={styles.languageTileText}>{text}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const Language = (props) => {
  // Context Variables
  const { authState, authDispatch } = useContext(Hcontext);

  // Prop Destructuring
  const { navigation } = props;

  const handleSubmit = async () => {
    try {
      const isOnBoarded = await AsyncStorage.getItem("IS_ONBOARDED");

      const selectedLanguage = "english";

      authDispatch({ type: "LANGUAGE_SELECTION", payload: selectedLanguage });

      await AsyncStorage.setItem("SELECTED_LANGUAGE", selectedLanguage);

      if (!isOnBoarded) navigation.push("OnBoarding");
      else navigation.navigate("Home");
    } catch (err) {
      console.log("Some issue while language selection - ", err);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      style={styles.backgroundContainer}
    >
      <ScrollView style={{ paddingTop: hp(6) }}>
        <Image
          source={require("../../assets/images/happimynd_logo.png")}
          resizeMode="contain"
          style={styles.pageLogo}
        />

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.titleSectionText}>Choose Language</Text>
          <Image
            source={require("../../assets/images/hindi_lang_text.png")}
            style={styles.titleSectionHindiText}
          />
        </View>
        {/* Language Tiles Section */}
        <View style={styles.languageTilesSection}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <LanguageTile
              image={require("../../assets/images/hindi_language.png")}
              text="Hindi"
              handleSubmit={handleSubmit}
            />
            <LanguageTile
              image={require("../../assets/images/english_language.png")}
              text="English"
              handleSubmit={handleSubmit}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <LanguageTile
              image={require("../../assets/images/marathi_language.png")}
              text="Marathi"
              handleSubmit={handleSubmit}
            />
            <LanguageTile
              image={require("../../assets/images/telgu_language.png")}
              text="Telugu"
              handleSubmit={handleSubmit}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <LanguageTile
              image={require("../../assets/images/punjabi_language.png")}
              text="Punjabi"
              handleSubmit={handleSubmit}
            />
            <LanguageTile
              image={require("../../assets/images/bangla_language.png")}
              text="Bengali"
              handleSubmit={handleSubmit}
            />
          </View>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        <View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSubmit}
            style={styles.skipButton}
          >
            <Text style={styles.skipButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    backgroundColor: colors.background,
    width: wp(100),
    height: hp(100),
    paddingHorizontal: wp(10),
  },
  pageLogo: {
    // backgroundColor: "red",
    width: wp(30),
    height: hp(12),
  },
  titleSection: {
    // backgroundColor: "red",
    flex: 1,
    justifyContent: "flex-end",
  },
  titleSectionHindiText: {
    // backgroundColor: "red",
    width: wp(20),
    height: hp(4),
    resizeMode: "contain",
    marginBottom: hp(2),
  },
  titleSectionText: {
    fontSize: RFValue(22),
    fontWeight: "bold",
  },
  languageTilesSection: {
    // backgroundColor: "green",
    flex: 2,
  },
  languageTileContainer: {
    // backgroundColor: "red",
  },
  languageTile: {
    // width: hp(17),
    width: wp(38),
    height: hp(17),
    marginBottom: 10,
    // backgroundColor: "blue",
    borderRadius: 10,
    overflow: "hidden",
  },
  languageTileText: {
    color: "#ffffff",
    // padding: 14,
    paddingHorizontal: hp(2),
    paddingVertical: hp(2),
    fontSize: RFValue(12),
  },
  skipButton: {
    backgroundColor: colors.primary,
    height: hp(5),
    width: wp(20),
    borderRadius: hp(100),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  skipButtonText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    textAlign: "center",
  },
});

export default Language;
