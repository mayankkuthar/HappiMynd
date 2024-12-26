import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { Hcontext } from "../../context/Hcontext";
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";
import CreditsCard from "../../components/cards/CreditsCard";

const Credits = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { creditsListing } = useContext(Hcontext);

  // State Variables
  const [psyListing, setPsyListing] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mounting
  useEffect(() => {
    fethCreditListing();
  }, []);

  const fethCreditListing = async () => {
    setLoading(true);
    try {
      const fetchedListing = await creditsListing();
      console.log("The fetched credit listing is - ", fetchedListing);
      if (fetchedListing.status === "success") {
        setPsyListing(fetchedListing.booking_details);
      }
    } catch (err) {
      console.log("Some issue while fetching credit listing - ", err);
    }
    setLoading(false);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <Header navigation={navigation} showLogo={false} showBack={true} />

      <View style={{ paddingHorizontal: wp(10), flex: 1 }}>
        <Text style={styles.pageTitle}>Session Balance</Text>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        {loading ? (
          <ActivityIndicator color={colors.loaderColor} size="small" />
        ) : !psyListing.length ? (
          <Text style={styles.emptyListText}>No Available Credits</Text>
        ) : (
          <FlatList
            onRefresh={fethCreditListing}
            refreshing={loading}
            data={psyListing}
            renderItem={({ item }) => (
              <>
                <CreditsCard data={item} navigation={navigation} />

                {/* Sized Box */}
                <View style={{ height: hp(2) }} />
              </>
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pageTitle: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  emptyListText: {
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(18),
    color: colors.borderLight,
    textAlign: "center",
  },
});

export default Credits;
