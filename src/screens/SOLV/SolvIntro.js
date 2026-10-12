import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Context
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
import Button from "../../components/buttons/Button";

const SolvIntro = (props) => {
  // Prop destructuring
  const { navigation } = props;

  // Context Variables
  const { authState } = useContext(Hcontext);

  // Sessions left (from login API), default 0
  const sessionsLeft =
    authState?.user?.sessions_left?.solv_sessions_left ??
    authState?.user?.user?.sessions_left?.solv_sessions_left ??
    0;

  const letsSolv = () => {
    if (authState.user) {
      navigation.push("MakeBooking", {
        module: "guide",
        type: "add",
        // psyId: 10,
        planId: "22",
        amount: "539",
        // session: 1,
      });
    } else {
      navigation.push("WelcomeScreen");
    }
  };

  return (
    <View style={styles.container}>
      <Header showBack={true} showLogo={false} navigation={navigation} />

      <ScrollView style={{ paddingHorizontal: wp(5) }}>
        {/* Sized Box */}
        <View style={{ height: hp(3) }} />

        <View>
          <Text style={styles.title}>SOLV</Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Text style={styles.subTitle}>
            You're just one conversation away from feeling sorted.
          </Text>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <Image
            source={require("../../assets/images/report_hero.png")}
            resizeMode="contain"
            style={styles.illustration}
          />

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <View style={styles.descriptionCard}>
            <Text style={styles.paragraph}>
              Solv provides one-on-one sessions with growth experts to help you
              navigate important life decisions, transitions, aspirations, and
              challenges. These structured conversations offer clarity,
              perspective, and actionable direction.
            </Text>

            {/* Sized Box */}
            <View style={{ height: 22 }} />

            <Text style={styles.paragraph}>
              Solv creates a confidential and thoughtful environment for
              meaningful progress all from the comfort of your own space.
            </Text>
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <View style={styles.actionRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.actionCard, styles.actionCardLeft]}
              onPress={() => navigation.push("ManageBookings")}
            >
              <ImageBackground
                source={require("../../assets/images/button_wave_background.png")}
                style={styles.actionCardBackground}
                resizeMode="cover"
              >
                <Text style={styles.actionCardText}>{"Manage\nBookings"}</Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.actionCard}
              onPress={() => navigation.push("Credits")}
            >
              <ImageBackground
                source={require("../../assets/images/button_wave_background.png")}
                style={styles.actionCardBackground}
                resizeMode="cover"
              >
                <Text style={styles.actionCardText}>{`${sessionsLeft} Session\nBalance`}</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(3) }} />

          <Button
            text="Let's SOLV"
            containerStyle={styles.solvButton}
            textStyle={styles.solvButtonText}
            pressHandler={letsSolv}
          />
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F7FF",
    flex: 1,
  },
  title: {
    fontSize: RFValue(22),
    fontFamily: "PoppinsSemiBold",
    fontWeight: "400",
    color: "#9747FF",
    textAlign: "left",
  },
  subTitle: {
    fontSize: RFValue(16),
    fontFamily: "PoppinsMedium",
    fontWeight: "400",
    color: "#111111",
    textAlign: "left",
  },
  illustration: {
    alignSelf: "center",
    width: wp(80),
    height: hp(24),
    borderRadius: 12,
  },
  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 27,
    paddingHorizontal: 26,
    paddingVertical: 26,
  },
  paragraph: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    color: "#646268",
    textAlign: "left",
    lineHeight: hp(3),
  },
  actionRow: {
    flexDirection: "row",
  },
  actionCard: {
    flex: 1,
    backgroundColor: "#D9B9FF",
    borderRadius: 22,
    height: 110,
    overflow: "hidden",
  },
  actionCardLeft: {
    marginRight: 13,
  },
  actionCardBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionCardText: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsMedium",
    color: "#111111",
    textAlign: "center",
  },
  solvButton: {
    backgroundColor: "#E6DEFF",
    borderRadius: 999,
    marginHorizontal: 16,
    marginBottom: 14,
    shadowColor: "#BDB5CE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  solvButtonText: {
    color: "#191719",
  },
});

export default SolvIntro;