import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

const Header = (props) => {
  // Prop Destructuring
  const { navigation, setSelectedFilter } = props;

  // Context Variables
  const {
    setContentType,

    setParameters,
    setLanguage,
  } = useContext(Hcontext);

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Filters</Text>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.clearButton}
        onPress={() => {
          setContentType("");
          setParameters("");
          setLanguage("");
          setSelectedFilter([]);
        }}
      >
        <Text style={styles.clearButtonText}>Clear All</Text>
      </TouchableOpacity>
    </View>
  );
};

const LeftPane = (props) => {
  // Prop Destructuring
  const { selected, setSelected } = props;

  // variables
  const leftPaneFilters = [
    { id: 0, text: "Type of Content" },
    { id: 1, text: "Parameters" },
    { id: 2, text: "Profile" },
    { id: 3, text: "Language" },
  ];

  return (
    <View style={styles.leftPaneContainer}>
      {leftPaneFilters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          activeOpacity={0.7}
          style={{
            ...styles.leftFilterButton,
            backgroundColor:
              selected === filter.id ? "#F2F0FE" : "#EBE7FD",
          }}
          onPress={() => setSelected(filter.id)}
        >
          <Text
            style={[
              styles.filterPaneButtonText,
              {
                color: selected === filter.id ? "#000000" : "#48454E",
              },
            ]}
          >
            {filter.text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const RightPane = (props) => {
  // Prop Destructuring
  const { selectedCategory, selectedFilter, setSelectedFilter } = props;

  // Context Variables
  const {
    contentType,
    setContentType,
    parameters,
    setParameters,
    setLanguage,
    setProfile,
  } = useContext(Hcontext);

  // variables
  const rightPaneFilters = [
    { id: 0, text: "blog", category: 0 },
    { id: 1, text: "video", category: 0 },
    { id: 2, text: "image", category: 0 },
    { id: 3, text: "infographics", category: 0 },
    { id: 4, text: "stress", category: 1 },
    { id: 5, text: "anxiety", category: 1 },
    { id: 6, text: "depression", category: 1 },
    { id: 7, text: "burn out", category: 1 },
    { id: 8, text: "happiness", category: 1 },
    { id: 9, text: "internet addiction", category: 1 },
    { id: 10, text: "personality", category: 1 },
    { id: 11, text: "self esteem", category: 1 },
    { id: 12, text: "resilience", category: 1 },
    { id: 13, text: "job satisfaction", category: 1 },
    { id: 14, text: "substance abuse", category: 1 },
    { id: 15, text: "emotional regulation", category: 1 },
    { id: 16, text: "peer pressure", category: 1 },
    { id: 17, text: "group conformity", category: 1 },
    { id: 18, text: "gaming disorder", category: 1 },
    { id: 19, text: "attention and concentration", category: 1 },
    { id: 20, text: "relationship issues", category: 1 },
    { id: 21, text: "body image", category: 1 },
    { id: 22, text: "well being", category: 1 },
    { id: 23, text: "salaried", category: 2 },
    { id: 24, text: "self employed", category: 2 },
    { id: 25, text: "home maker", category: 2 },
    { id: 26, text: "senior citizen", category: 2 },
    { id: 27, text: "student(school)", category: 2 },
    { id: 28, text: "student(college/university)", category: 2 },
    { id: 29, text: "entrepreneur", category: 2 },
    { id: 30, text: "jobseeker", category: 2 },
    { id: 31, text: "frontline warrior", category: 2 },
    { id: 32, text: "working woman", category: 2 },
    { id: 33, text: "hindi", category: 3 },
    { id: 34, text: "english", category: 3 },
    // { id: 35, text: "punjabi", category: 3 },
  ];

  return (
    <View style={styles.rightPaneContainer}>
      <FlatList
        data={rightPaneFilters}
        renderItem={({ item }) => {
          const filter = item;
          if (selectedCategory === filter.category)
            return (
              <TouchableOpacity
                key={filter.id}
                activeOpacity={0.7}
                style={{
                  ...styles.rightFilterButton,
                  borderBottomWidth: 1,
                  borderBottomColor: "#D3D1DA",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  let newFilters;
                  if (selectedFilter.find((sf) => sf.id === filter.id)) {
                    newFilters = selectedFilter.filter(
                      (f) => f.id !== filter.id
                    );
                  } else {
                    newFilters = [...selectedFilter, filter];
                  }

                  // const contentType = newFilters.map((element) => {
                  //   if (element.category === 0) return element.text;
                  // });
                  let content = "";
                  let parameterz = "";
                  let profle = "";
                  let languages = "";
                  newFilters.forEach((element) => {
                    if (element.category === 0) content += `${element.text},`;
                    if (element.category === 1)
                      parameterz += `${element.text},`;
                    if (element.category === 2) profle += `${element.text},`;
                    if (element.category === 3) languages += `${element.text},`;
                  });
                  setContentType(content.substring(0, content.length - 1));
                  setParameters(parameterz.substring(0, parameterz.length - 1));
                  setLanguage(languages.substring(0, languages.length - 1));
                  setProfile(profle.substring(0, profle.length - 1));
                  setSelectedFilter(newFilters);
                }}
              >
                <Ionicons
                  style={{
                    width: 28,
                    opacity: selectedFilter.find((sf) => sf.id === filter.id)
                      ? 1
                      : 0,
                  }}
                  name="ios-checkmark"
                  size={hp(3)}
                  color="#48454E"
                />
                {/* Sized Box */}
                <View style={{ width: hp(1) }} />
                <Text style={[styles.filterPaneButtonText, { color: "#000000" }]}>
                  {filter.text}
                </Text>
              </TouchableOpacity>
            );
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const Footer = (props) => {
  // Prop Destructuring
  const { navigation, selectedCategory, selectedFilter } = props;

  // Context variables
  const {
    setContentType,
    setParameters,
    setLanguage,
    setProfile,
    setSearchTerm,
  } = useContext(Hcontext);

  // State Variables
  const [loading, setLoading] = useState(false);

  const filterHandler = async () => {
    setLoading(true);
    try {
      let contentType = "",
        parameters = "",
        profile = "",
        language = "";

      selectedFilter.forEach(({ category, text }) => {
        if (category === 0) contentType += text + ",";
        if (category === 1) parameters += text + ",";
        if (category === 2) profile += text + ",";
        if (category === 3) language += text + ",";
      });
      setContentType(contentType.substring(0, contentType.length - 1));
      setParameters(parameters.substring(0, parameters.length - 1));
      setProfile(profile.substring(0, profile.length - 1));
      setLanguage(language.substring(0, language.length - 1));

      console.log(
        "cehck appa sub strti - ",
        contentType.substring(0, contentType.length - 1)
      );

      navigation.navigate("SearchResults");
    } catch (err) {
      console.log("Some issue in filter handler (Filter.js) - ", err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.applyButton}
        onPress={filterHandler}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.loaderColor} />
        ) : (
          <Text style={styles.applyButtonText}>Apply</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const Filters = (props) => {
  // Props
  const { navigation } = props;

  // Context Variables
  const {
    contentType,
    parameters,
    selectedCategory,
    setSelectedCategory,
    selectedFilter,
    setSelectedFilter,
  } = useContext(Hcontext);

  // // State Variables
  // const [selectedCategory, setSelectedCategory] = useState(0);
  // const [selectedFilter, setSelectedFilter] = useState([]);

  return (
    <View style={styles.container}>
      <Header navigation={navigation} setSelectedFilter={setSelectedFilter} />
      <View style={styles.filterContent}>
        <LeftPane
          selected={selectedCategory}
          setSelected={setSelectedCategory}
        />
        <RightPane
          selectedCategory={selectedCategory}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
      </View>
      <Footer
        navigation={navigation}
        selectedCategory={selectedCategory}
        selectedFilter={selectedFilter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F3FE",
    flex: 1,
  },
  headerContainer: {
    backgroundColor: "#E5DFFD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 21,
    height: 101,
    width: "100%",
    shadowColor: "#77727F",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 4,
  },
  headerTitle: {
    fontSize: RFValue(22),
    fontFamily: "PoppinsSemiBold",
    color: "#000000",
  },
  clearButton: {
    // backgroundColor: "green",
    paddingLeft: hp(4),
  },
  clearButtonText: {
    fontSize: RFValue(10),
    fontFamily: "PoppinsMedium",
    color: "#111111",
  },
  filterContent: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#F6F3FE",
  },
  leftPaneContainer: {
    backgroundColor: "#EBE7FD",
    width: wp(47),
    shadowColor: "#4F4B57",
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 7,
    elevation: 5,
  },
  rightPaneContainer: {
    backgroundColor: "#F6F3FE",
    flex: 1,
    paddingLeft: 30,
    paddingRight: 19,
  },
  footerContainer: {
    backgroundColor: "#FFFFFF",
    height: 93,
    width: "100%",
    flexDirection: "row",
    paddingLeft: 21,
    paddingRight: 19,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    height: 53,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6D6FC",
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#B7A8C7",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 2,
  },
  cancelButtonText: {
    color: "#111111",
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    textAlign: "center",
  },
  applyButton: {
    flex: 1,
    height: 53,
    marginLeft: 31,
    backgroundColor: "#E6D6FC",
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#B7A8C7",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 3,
  },
  applyButtonText: {
    color: "#111111",
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    textAlign: "center",
  },
  leftFilterButton: {
    height: 73,
    paddingLeft: 34,
    paddingRight: 20,
    justifyContent: "center",
  },
  rightFilterButton: {
    height: 62,
    paddingHorizontal: 5,
  },
  filterPaneButtonText: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    // textAlign: "center",
    color: "#48454E",
    textTransform: "capitalize",
  },
});

export default Filters;
