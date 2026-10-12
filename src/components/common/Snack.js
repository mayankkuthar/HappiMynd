import React, { useEffect, useRef, useContext } from "react";
import { StyleSheet } from "react-native";
import SnackBar from "react-native-snackbar-component";

// Context
import { Hcontext } from "../../context/Hcontext";
import { colors } from "../../assets/constants";

const Snack = ({ duration = 10000 }) => {
  // Context Variables
  const { snackState, snackDispatch } = useContext(Hcontext);

  const timerRef = useRef(null);

  // Auto-dismiss; restarts whenever a new snack appears
  useEffect(() => {
    if (snackState.visible) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        snackDispatch({ type: "HIDE_SNACK" });
      }, duration);
    }
    return () => clearTimeout(timerRef.current);
  }, [snackState.visible, snackState.message, duration, snackDispatch]);

  return (
    <SnackBar
      visible={snackState.visible}
      textMessage={snackState.message}
      actionHandler={() => snackDispatch({ type: "HIDE_SNACK" })}
      actionText=""
      accentColor={colors.primary}
      backgroundColor="#FFFFFF"
      messageColor="#191928"
      left={16}
      right={16}
      bottom={24}
      containerStyle={styles.snackContainer}
    />
  );
};

const styles = StyleSheet.create({
  snackContainer: {
    borderRadius: 12,
    elevation: 6,
  },
});

export default Snack;