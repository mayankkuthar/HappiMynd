import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import RenderHtml from "react-native-render-html";
import { useFocusEffect } from "@react-navigation/native";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";
import Header from "../../components/common/Header";

const Content = () => {
  return (
    <>
      <View>
        <Text style={styles.textDescription}>
          We are happy to offer you{" "}
          <Text style={{ fontFamily: "PoppinsBold" }}>COMPLIMENTARY</Text>{" "}
          access to HappiLIFE - A Self Awareness Tool and 3 Pager confidential
          report on 8 personality parameters. It helps you to know more about
          your current state of Emotional Wellbeing.
        </Text>
      </View>
      <View>
        <Text style={styles.textDescription}>
          What more..{" "}
          <Text style={{ fontFamily: "PoppinsBold" }}>REFER A FRIEND</Text> and
          you get to use our services worth INR{" "}
          <Text style={{ fontFamily: "PoppinsBold" }}>5000/-</Text> FIRST TIME
          FREE.
        </Text>
      </View>
      <View>
        <Text style={styles.textDescription}>
          Ask them to select the Referred User button , select HAPPIMYND as the
          organization in drop down and punch in{" "}
          <Text style={{ fontFamily: "PoppinsBold" }}>6eef46</Text> while
          registering and you get:
        </Text>
      </View>
      <View style={styles.bulletContainer}>
        <View style={styles.bulletPoint} />
        <View style={{ width: wp(2) }} />
        <Text style={{ ...styles.textDescription, textAlign: "left" }}>
          12 months Full access of HappiLEARN - 5000 mins E - Library
        </Text>
      </View>
      <View style={styles.bulletContainer}>
        <View style={styles.bulletPoint} />
        <View style={{ width: wp(2) }} />
        <Text style={{ ...styles.textDescription, textAlign: "left" }}>
          15 days FREE access to HappiBUDDY - Space to share your emotions
        </Text>
      </View>
      <View style={styles.bulletContainer}>
        <View style={styles.bulletPoint} />
        <View style={{ width: wp(2) }} />
        <Text style={{ ...styles.textDescription, textAlign: "left" }}>
          40% off on fees of selected products
        </Text>
      </View>
      <View
        style={{
          backgroundColor: colors.primary,
          padding: hp(1),
          borderRadius: hp(1.5),
          width: wp(84),
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            ...styles.textDescription,
            fontSize: RFValue(12),
            color: colors.borderDark,
          }}
        >
          To receive your offer codes please update your email id and contact
          number in the profile section of the app.
        </Text>
      </View>
    </>
  );
};

const Content2 = () => {
  return (
    <>
      <View>
        <Text style={styles.textDescription}>
          Exciting <Text style={{ fontFamily: "PoppinsBold" }}>PAYBACK</Text>{" "}
          offers of INR 1000 and more on using our services.{" "}
          <Text style={{ fontFamily: "PoppinsBold" }}>Register Now</Text> !!
        </Text>
      </View>
      <View style={styles.bulletContainer}>
        <View style={styles.bulletPoint} />
        <View style={{ width: wp(2) }} />
        <Text style={{ ...styles.textDescription, textAlign: "left" }}>
          Complimentary Emotional Profile + Guidance Session - Earn 1000 points
        </Text>
      </View>
      <View style={styles.bulletContainer}>
        <View style={styles.bulletPoint} />
        <View style={{ width: wp(2) }} />
        <Text style={{ ...styles.textDescription, textAlign: "left" }}>
          Self Help CBT based modules subscription: {"\n"} 6 months - Earn 1000
          points {"\n"} 12 months - Earn 2000 points
        </Text>
      </View>
      <View style={styles.bulletContainer}>
        <View style={styles.bulletPoint} />
        <View style={{ width: wp(2) }} />
        <Text style={{ ...styles.textDescription, textAlign: "left" }}>
          For each counselling session booking- Earn 1000 points
        </Text>
      </View>
      <View style={styles.bulletContainer}>
        <View style={styles.bulletPoint} />
        <View style={{ width: wp(2) }} />
        <Text style={{ ...styles.textDescription, textAlign: "left" }}>
          Subscription of 1-to-1 Virtual Interaction program with counsellors:{" "}
          {"\n"} 3 months - Earn 1000 points {"\n"} 6 months - Earn 2000 points{" "}
          {"\n"}
          12 months - Earn 2000 points points
        </Text>
      </View>
      <View style={styles.bulletContainer}>
        <View style={styles.bulletPoint} />
        <View style={{ width: wp(2) }} />
        <Text style={{ ...styles.textDescription, textAlign: "left" }}>
          Special payback points scheme for corporate subscribers too
        </Text>
      </View>
      <View style={styles.bulletContainer}>
        <View style={styles.bulletPoint} />
        <View style={{ width: wp(2) }} />
        <Text style={{ ...styles.textDescription, textAlign: "left" }}>
          One point = One INR
        </Text>
      </View>
      <View
        style={{
          backgroundColor: colors.primary,
          padding: hp(1),
          borderRadius: hp(1.5),
          width: wp(84),
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            ...styles.textDescription,
            fontSize: RFValue(12),
            color: colors.borderDark,
          }}
        >
          Don't miss out on this limited period opportunity to earn payback
          points with use of every service.
        </Text>
      </View>
    </>
  );
};

const OfferUpdates = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context VAriables
  const { authState, offerScreenContent } = useContext(Hcontext);

  // State Variables
  const [offerContent, setOfferContent] = useState("");
  const [loading, setLoading] = useState(false);

  const { width } = useWindowDimensions();

  // Mounting
  useFocusEffect(
    useCallback(() => {
      fetchOfferContent();
    }, [])
  );
  // useEffect(() => {
  //   fetchOfferContent();
  // }, []);

  const fetchOfferContent = async () => {
    setLoading(true);
    const offerContent = await offerScreenContent();
    console.log("Check teh offer content - ", offerContent);
    if (offerContent?.status === "success") {
      setOfferContent(offerContent?.data?.content);
    }
    try {
    } catch (err) {
      console.log("Some issue while fetching offer content - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {authState.user ? (
        <Header navigation={navigation} showNav={false} />
      ) : (
        <>
          {/* Sized Box */}
          <View style={{ height: hp(4) }} />
          <Image
            source={require("../../assets/images/happimynd_logo.png")}
            resizeMode="contain"
            style={styles.imageLogo}
          />
        </>
      )}

      {/* Image Section */}
      {/* <View style={styles.imageSection}>
        <ImageBackground
          source={require("../../assets/images/offer_rectangle.png")}
          resizeMode="cover"
          style={styles.imageRectangle}
        >
          <Image
            source={require("../../assets/images/offer_main.png")}
            resizeMode="contain"
            style={styles.imageMain}
          />
        </ImageBackground>
      </View> */}
      {/* <View style={styles.imageSection}>
        <ImageBackground
          source={require("../../assets/images/offer_rectangle.png")}
          resizeMode="contain"
          style={styles.imageHeroContainer}
        >
          <Image
            source={require("../../assets/images/happimynd_logo.png")}
            resizeMode="contain"
            style={styles.imageLogo}
          />
          <Image
            source={require("../../assets/images/offers_hero.png")}
            resizeMode="contain"
            style={styles.imageHero}
          />
        </ImageBackground>
      </View> */}

      <Image
        source={require("../../assets/images/gift_icon.png")}
        resizeMode="contain"
        style={styles.giftIcon}
      />

      {/* Text Section */}
      <ScrollView style={styles.textSection}>
        {authState.user ? (
          <Text style={styles.title}>Offers and rewards</Text>
        ) : (
          <Text style={styles.textTitle}>Welcome to HappiMynd</Text>
        )}

        {loading ? (
          <ActivityIndicator
            style={{ marginVertical: hp(4) }}
            size="small"
            color={colors.loaderColor}
          />
        ) : (
          <RenderHtml contentWidth={width} source={{ html: offerContent }} />
        )}

        {/* <Content2 /> */}

        <View style={{ height: hp(10) }} />
      </ScrollView>

      {/* Button Section */}
      {!authState.user ? (
        <View style={styles.buttonSection}>
          <TouchableOpacity
            activeOpacity={0.7}
            // onPress={() => navigation.push("WelcomeScreen")}
            onPress={() => navigation.push("Home")}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
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
  title: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
  },
  imageSection: {
    height: hp(40),
    width: wp(100),
  },
  imageRectangle: {
    height: hp(60),
    width: wp(100),
    alignItems: "center",
    justifyContent: "center",
  },
  imageMain: {
    height: hp(40),
    width: wp(80),
  },
  imageHeroContainer: {
    backgroundColor: "#ACE6E4",
    height: hp(40),
    width: wp(100),
    alignItems: "center",
    justifyContent: "flex-end",
  },
  imageLogo: {
    // backgroundColor: "green",
    height: hp(12),
    width: wp(24),
    alignSelf: "center",
  },
  giftIcon: {
    height: hp(14),
    width: wp(24),
    position: "absolute",
    right: hp(3),
    top: hp(6),
    overflow: "visible",
  },
  imageHero: {
    // backgroundColor: "red",
    height: hp(36),
    width: wp(100),
  },
  textSection: {
    height: hp(30),
    width: wp(100),
    paddingHorizontal: wp(6),
    paddingTop: hp(7),
  },
  textTitle: {
    fontSize: RFValue(18),
    fontFamily: "PoppinsSemiBold",
    marginBottom: hp(2),
  },
  textDescription: {
    fontSize: RFValue(14),
    fontFamily: "Poppins",
    color: colors.borderLight,
    textAlign: "justify",
  },
  buttonSection: {
    height: hp(10),
    width: wp(100),
    paddingHorizontal: wp(6),
    alignItems: "flex-end",
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 100,
  },
  nextButtonText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
  },
  bulletPoint: {
    backgroundColor: colors.pageTitle,
    width: hp(1),
    height: hp(1),
    borderRadius: hp(100),
    marginTop: hp(1),
  },
  bulletContainer: {
    // backgroundColor: "red",
    flexDirection: "row",
    paddingVertical: hp(1),
    width: wp(84),
  },
});

export default OfferUpdates;
