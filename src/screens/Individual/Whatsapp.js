import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const Whatsapp = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <Button title="Whatsapp" onPress={() => navigation.openDrawer()} />
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

export default Whatsapp;
