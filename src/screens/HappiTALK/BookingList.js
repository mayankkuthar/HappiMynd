import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
import Button from "../../components/buttons/Button";
import SearchField from "../../components/input/SearchField";
import FilterButton from "../../components/buttons/FilterButton";
import BookingCard from "../../components/cards/BookingCard";
import ConfidentialModal from "../../components/Modals/ConfidentialModal";

const BookingList = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { psycologistTalkListing } = useContext(Hcontext);

  // State Variables
  const [showModal, setShowModal] = useState(true);
  const [psycologists, setPsycologists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mounting
  useEffect(() => {
    getPsycologistListing("");
  }, []);

  const getPsycologistListing = async (search) => {
    setLoading(true);
    try {
      const listing = await psycologistTalkListing({ search });
      console.log("The psycologist listing is - ", listing);
      if (listing.status === "success") {
        setUserDetail(listing.user_detail); // Setting the user details wheather it is individual / organisation
        setPsycologists(listing.list); // Setting the complete psycologist list
      }
    } catch (err) {
      console.log(
        "Some issue while getting psycologist listing (BookingList.js) - ",
        err
      );
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} showLogo={false} showBack={true} />
      <ConfidentialModal
        showModal={showModal}
        setShowModal={setShowModal}
        pressHandler={() => setShowModal(false)}
        image={require("../../assets/images/confidential_hero.png")}
      />
      {/* Body Section */}
      <ScrollView style={{ paddingHorizontal: wp(10) }}>
        <Text style={styles.pageTitle}>HappiTALK</Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        {/* Search Section */}
        <View style={{ flexDirection: "row" }}>
          <SearchField
            placeHolder="Search"
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />

          {/* Sized Box */}
          <View style={{ width: wp(2) }} />

          <TouchableOpacity
            style={styles.searchButton}
            activeOpacity={0.7}
            onPress={() => getPsycologistListing(searchTerm)}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>

          {/* <FilterButton navigation={navigation} /> */}
        </View>
        {loading ? (
          <View style={{ paddingTop: hp(4) }}>
            <ActivityIndicator size="small" color={colors.loaderColor} />
          </View>
        ) : (
          psycologists.map((psy) => (
            <>
              {/* Sized Box */}
              <View style={{ height: hp(2) }} />

              <BookingCard
                navigation={navigation}
                user={psy}
                userDetail={userDetail}
              />
            </>
          ))
        )}

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />
      </ScrollView>
    </View>
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
  searchButton: {
    backgroundColor: "white",
    paddingHorizontal: wp(4),
    alignItems: "center",
    justifyContent: "center",
    height: hp(5),
    borderWidth: 1,
    borderColor: colors.borderDim,
    borderRadius: 6,
  },
  searchButtonText: {
    fontFamily: "PoppinsMedium",
    fontSize: RFValue(9),
  },
});

export default BookingList;
