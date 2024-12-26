import React, { useEffect, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import SnackBar from "react-native-snackbar-component";

// Context
import { Hcontext } from "../../context/Hcontext";
import { colors } from "../../assets/constants";

const Snack = ({ duration = 10000 }) => {
  // Context Variables
  const { snackState, snackDispatch } = useContext(Hcontext);

  // Mounting
  useEffect(() => {
    const snackTimer = setTimeout(() => {
      snackDispatch({ type: "HIDE_SNACK" });
    }, duration);
    return () => {
      clearTimeout(snackTimer);
    };
  }, []);

  return (
    <SnackBar
      visible={snackState.visible}
      textMessage={snackState.message}
      actionHandler={() => snackDispatch({ type: "HIDE_SNACK" })}
      actionText="DISMISS"
      accentColor={colors.primary}
    />
  );
};

export default Snack;
