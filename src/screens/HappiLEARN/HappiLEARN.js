import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constatnts
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
import SearchField from "../../components/input/SearchField";
import FilterButton from "../../components/buttons/FilterButton";
import HappiLEARNCard from "../../components/cards/HappiLEARNCard";

// const mostRelevant = [
//   {
//     id: 0,
//     title: "How to travel and get paid in 2021 during Covid Season",
//     author: "Seraphic",
//     image: require("../../assets/images/happiLEARN_blog1.png"),
//     screen: "Blog",
//     params: "readBlog",
//   },
//   {
//     id: 1,
//     title: "How to travel and get paid in 2021 during Covid Season",
//     author: "Seraphic",
//     image: require("../../assets/images/happiLEARN_blog2.png"),
//     screen: "Blog",
//     params: "infographics",
//   },
// ];

// const recentlyViewed = [
//   {
//     id: 0,
//     title: "How to travel and get paid in 2021 during Covid Season",
//     author: "Seraphic",
//     image: require("../../assets/images/happiLEARN_blog1.png"),
//     screen: "BlogRead",
//     params: "readBlog",
//   },
//   {
//     id: 1,
//     title: "How to travel and get paid in 2021 during Covid Season",
//     author: "Seraphic",
//     image: require("../../assets/images/happiLEARN_blog2.png"),
//     screen: "BlogInfoGraphics",
//     params: "infographics",
//   },
// ];

const HappiLEARN = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const {
    snackDispatch,
    happiLearnList,
    contentType,
    searchTerm,
    setSearchTerm,
    screenTrafficAnalytics,
  } = useContext(Hcontext);

  // State Variables
  const [listing, setListing] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Mounting
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData(searchTerm);
    });

    screenTrafficAnalytics({ screenName: "HappiLEARN Content Screen" });

    return unsubscribe;
  }, []);

  const fetchData = async (search = "") => {
    setLoading(true);
    try {
      const data = await happiLearnList({ search });
      console.log("Chekcing the list - ", data);
      if (data.status === "success") {
        setListing(data.data.data);
        setRecentlyViewed(data.recently_viewed.data);
      }
    } catch (err) {
      console.log("Some issue while showing the listing - ", err);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    // setSearchTerm("");
    navigation.push("SearchResults");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <Header navigation={navigation} showLogo={false} showBack={true} />

      {console.log("chekc the listing here - ", recentlyViewed)}

      {/* Body Section */}
      <ScrollView style={{ paddingHorizontal: wp(10) }}>
        <Text style={styles.pageTitle}>HappiLEARN</Text>

        {/* SIzed Box */}
        <View style={{ height: hp(3) }} />

        {/* Search Section */}
        <View style={{ flexDirection: "row" }}>
          <SearchField
            placeHolder="Search"
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
            onSubmitEditing={handleSearch}
          />

          {/* Sized Box */}
          <View style={{ width: wp(2) }} />

          <FilterButton navigation={navigation} />
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        {loading ? (
          <ActivityIndicator size="small" color={colors.loaderColor} />
        ) : (
          <>
            {/* Blog Section */}
            <>
              {listing.length ? (
                <View style={{ position: "relative" }}>
                  <View style={styles.subTitleSection}>
                    <Text style={{ ...styles.pageSubTitle }}>
                      Most Relevant
                    </Text>
                    <Image
                      source={require("../../assets/images/happiLEARN_boy.png")}
                      style={styles.boyImage}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={{ position: "relative", top: -hp(2) }}>
                    {listing.slice(0, 3).map((data) => (
                      <>
                        <HappiLEARNCard
                          key={data.id}
                          data={data}
                          navigation={navigation}
                        />
                        {/* Sized Box */}
                        <View style={{ height: hp(2) }} />
                      </>
                    ))}
                  </View>
                </View>
              ) : null}
            </>

            {/* Sized Box */}
            <View style={{ height: hp(4) }} />

            {recentlyViewed.length ? (
              <View style={{ position: "relative" }}>
                <View style={styles.subTitleSection}>
                  <Text style={styles.pageSubTitle}>Recently Viewed</Text>
                  <Image
                    source={require("../../assets/images/happiLEARN_boy.png")}
                    style={styles.boyImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={{ position: "relative", top: -hp(2) }}>
                  {recentlyViewed.slice(0, 3).map(
                    (
                      data // Limiting the array to 3 size
                    ) => (
                      <>
                        {data.happi_learn_content ? (
                          <HappiLEARNCard
                            key={data.id}
                            data={data.happi_learn_content}
                            navigation={navigation}
                          />
                        ) : null}

                        <View style={{ height: hp(2) }} />
                      </>
                    )
                  )}
                </View>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  pageTitle: {
    fontSize: RFValue(24),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  pageSubTitle: {
    fontSize: RFValue(20),
    fontFamily: "PoppinsMedium",
    width: wp(34),
    // backgroundColor: "orange",
  },
  subTitleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  boyImage: {
    // backgroundColor: "green",
    width: hp(11),
    height: hp(11),
  },
  blogContainer: {
    // backgroundColor: "red",
    width: wp(80),
    height: hp(30),
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default HappiLEARN;
