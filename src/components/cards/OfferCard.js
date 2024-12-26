import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

// Constants
import { colors } from "../../assets/constants";

const LockedSection = (props) => {
  // Prop Destructuring
  const {} = props;
  return (
    <View style={styles.iconContainer}>
      <Feather name="lock" size={hp(2)} color={colors.borderDark} />
    </View>
  );
};

const OpenSection = (props) => {
  // Prop Destructuring
  const { pressHandler = () => {} } = props;

  return (
    <View style={styles.openSectionContainer}>
      <View
        style={{
          flexDirection: "row",
          alignSelf: "flex-end",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={pressHandler}
          style={styles.moduleButton}
        >
          <Text style={styles.moduleButtonText}>Avail Offer</Text>
          {/* Sized Box */}
          <View style={{ width: hp(0.5) }} />
          <AntDesign name="arrowright" size={hp(1.8)} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const VideoSection = (props) => {
  // Prop Destructuring
  const {} = props;
  return (
    <View style={styles.iconContainer}>
      <FontAwesome name="play-circle" size={hp(3.5)} color="#58C4CB" />
    </View>
  );
};

const ProceedSection = (props) => {
  // Prop Destructuring
  const {} = props;
  return (
    <View style={styles.iconContainer}>
      <AntDesign name="arrowright" size={hp(2)} color="black" />
    </View>
  );
};

const OfferCard = (props) => {
  // Prop Destructuring
  const {
    title = "",
    description = "",
    showIcon = true,
    type = "locked",
    pressHandler = () => {},
    disabled = false,
  } = props;

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={pressHandler}>
      <ImageBackground
        source={require("../../assets/images/course_background.png")}
        resizeMode="cover"
        style={styles.container}
      >
        <View style={styles.firstHalf}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubTitle}>{description}</Text>
        </View>
        {showIcon ? (
          <View style={styles.secondHalf}>
            {type === "locked" ? (
              <LockedSection />
            ) : type === "unlocked" ? (
              <OpenSection pressHandler={pressHandler} />
            ) : type === "video" ? (
              <VideoSection />
            ) : type === "proceed" ? (
              <ProceedSection />
            ) : null}
          </View>
        ) : null}
      </ImageBackground>
      {disabled ? <View style={styles.disabledContainer} /> : null}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3FEFE",
    height: hp(10),
    width: wp(80),
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    shadowColor: colors.borderLight,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: hp(1.5),
    // elevation: 5,
  },
  firstHalf: {
    flex: 2,
    // backgroundColor: "red",
    paddingLeft: hp(3),
    // alignItems: "center",
    justifyContent: "center",
  },
  secondHalf: {
    flex: 1,
    // backgroundColor: "green",
    paddingVertical: hp(2),
    paddingHorizontal: hp(2),
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: RFValue(12),
    fontFamily: "PoppinsSemiBold",
    color: colors.borderDark,
  },
  cardSubTitle: {
    fontSize: RFValue(8),
    fontFamily: "PoppinsMedium",
    color: colors.borderDark,
  },
  iconContainer: {
    alignItems: "flex-end",
  },
  openSectionContainer: {
    // backgroundColor: "yellow",
    justifyContent: "center",
    flex: 1,
  },
  moduleButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: hp(3.3),
    width: wp(28),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: hp(100),
  },
  moduleButtonText: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
  },
  disabledContainer: {
    backgroundColor: "rgba(0,0,0,0.2)",
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default OfferCard;
