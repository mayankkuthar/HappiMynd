import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Demo = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <Text>Demo</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Demo;
