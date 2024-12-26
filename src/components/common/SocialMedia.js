import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { FontAwesome } from "@expo/vector-icons";

// Constants
import { colors } from "../../assets/constants";

const SocialMedia = (props) => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center" }}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => Linking.openURL("https://www.facebook.com/HappiMynd/")}
        style={styles.socialLink}
      >
        <FontAwesome name="facebook" size={hp(2.5)} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => Linking.openURL("https://twitter.com/happi_mynd")}
        style={styles.socialLink}
      >
        <FontAwesome name="twitter" size={hp(2.5)} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => Linking.openURL("https://www.instagram.com/happimynd/")}
        style={styles.socialLink}
      >
        <FontAwesome name="instagram" size={hp(2.5)} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          Linking.openURL("https://www.linkedin.com/company/happimynd/")
        }
        style={styles.socialLink}
      >
        <FontAwesome name="linkedin" size={hp(2.5)} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          Linking.openURL(
            "https://www.youtube.com/channel/UCoc1RbYJwun3umKVOoImswg"
          )
        }
        style={styles.socialLink}
      >
        <FontAwesome name="youtube-play" size={hp(2.5)} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default SocialMedia;

const styles = StyleSheet.create({
  socialLink: {
    backgroundColor: colors.primary,
    paddingHorizontal: hp(1.5),
    paddingVertical: hp(1),
    borderRadius: 6,
    marginRight: wp(3),
  },
});
