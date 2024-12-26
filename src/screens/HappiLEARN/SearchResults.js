import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import axios from "axios";

// Constatnts
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
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

const SearchResults = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const {
    authState,
    happiLearnList,
    contentType,
    parameters,
    language,
    profile,
    searchTerm,
    setSearchTerm,
  } = useContext(Hcontext);

  // State Variables
  const [listing, setListing] = useState([]);
  const [nextPageLink, setNextPageLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paginationLoader, setPaginationLoader] = useState(false);

  // Mounting
  useEffect(() => {
    fetchData(searchTerm, contentType, parameters, profile, language);
  }, [searchTerm, contentType, parameters, profile, language]);

  const fetchData = async (
    search = "",
    contentType = "",
    parameters = "",
    profile = "",
    language = ""
  ) => {
    setLoading(true);
    try {
      // const dataToSend = {
      //   search,
      //   contentType,
      //   parameters,
      //   profile,
      //   language,
      // };
      const dataToSend = {};
      if (search) dataToSend["search"] = search;
      if (contentType) dataToSend["contentType"] = contentType;
      if (parameters) dataToSend["parameters"] = parameters;
      if (profile) dataToSend["profile"] = profile;
      if (language) dataToSend["language"] = language;
      const data = await happiLearnList(dataToSend);
      console.log("Chekcing the data to Send - ", dataToSend);
      //console.log("Chekcing the list - ", data);
      if (data.status === "success") {
        setListing(data.data.data);
        setNextPageLink(data.data.next_page_url);
      }
    } catch (err) {
      console.log("Some issue while showing the listing - ", err);
    }
    setLoading(false);
  };

  const loadDataHandler = async () => {
    setPaginationLoader(true);
    try {
      const axiosRes = await axios({
        method: "post",
        url: nextPageLink,
        headers: { Authorization: "Bearer " + authState.user.access_token },
        data: {
          searchTerm,
          content_type: contentType,
          parameters,
          profile,
          language,
        },
      });
      // console.log("This is the end", axiosRes.data);
      console.log("contentType", contentType);
      if (axiosRes.data.status === "success") {
        // let newList = axiosRes.data.data.data.filter((item) => {
        //   return item.type === contentType;
        // });
        // setListing((prevState) => [...prevState, ...newList]);

        setListing((prevState) => [...prevState, ...axiosRes.data.data.data]);
        setNextPageLink(axiosRes.data.data.next_page_url);
      }
    } catch (err) {
      console.log("Some issue while getting next page data - ", err);
    }
    setPaginationLoader(false);
  };

  if (loading)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="small" color={colors.loaderColor} />
      </View>
    );

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <Header navigation={navigation} showLogo={false} showBack={true} />

      {/* Body Section */}
      <View style={{ paddingHorizontal: wp(10) }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.pageTitle}>Search Results</Text>
          <FilterButton
            navigation={navigation}
            notification={contentType || parameters || profile || language}
            onPress={() => navigation.navigate("Filters")}
          />
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        {console.log("check the listing - ", listing)}

        {/* Blog Section */}
        <View style={{ position: "relative" }}>
          {!listing.length ? (
            <Text
              style={{
                fontSize: RFValue(16),
                fontFamily: "PoppinsSemiBold",
                color: colors.borderLight,
                alignSelf: "center",
              }}
            >
              No Content
            </Text>
          ) : (
            <FlatList
              data={listing}
              renderItem={({ item }) => (
                <>
                  <HappiLEARNCard
                    key={item.id}
                    data={item}
                    navigation={navigation}
                  />
                  {/* Sized Box */}
                  <View style={{ height: hp(2) }} />
                </>
              )}
              keyExtractor={(item, index) => index}
              onEndReached={loadDataHandler}
              onEndReachedThreshold={0}
              ListFooterComponent={() =>
                paginationLoader ? (
                  <ActivityIndicator size="small" color={colors.loaderColor} />
                ) : null
              }
            />
          )}
        </View>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    paddingBottom: hp(33),
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

export default SearchResults;
