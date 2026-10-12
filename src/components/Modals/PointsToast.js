import React, { useRef, useEffect } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";

const PointsToast = ({
  showToast = false,
  setShowToast = () => {},
  points = 0,
}) => {
  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showToast) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -80,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => setShowToast(false));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showToast]);

  if (!showToast) return null;

  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
      <Text style={styles.text}>
        Congratulations you earned{" "}
        <Text style={styles.pointsText}>{points} points</Text>
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: hp(6),
    alignSelf: "center",
    zIndex: 999,
    backgroundColor: "#EDE6FF",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    borderRadius: 12,
    shadowColor: "#8E66F1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    fontSize: RFValue(13),
    fontFamily: "Poppins",
    color: "#000000",
  },
  pointsText: {
    fontFamily: "PoppinsSemiBold",
    color: "#8453ED",
  },
});

export default PointsToast;