import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constants
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";
import CourseCard from "../../components/cards/CourseCard";
import { Hcontext } from "../../context/Hcontext";

const LibrarySub = (props) => {
  // Prop Destructuring
  const {
    navigation,
    route: { params },
  } = props;
  const { id, language, library_name } = params.item;

  // Context Variables
  const { libraryContent } = useContext(Hcontext);

  // State variables
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mounting
  useEffect(() => {
    fetchLibraryContent(id);
  }, []);

  const fetchLibraryContent = async (id) => {
    setLoading(true);
    try {
      const fetchedContent = await libraryContent({ id });
      console.log("Chec the fetche dcontent - ", fetchedContent);
      if (fetchedContent.status === "success") {
        setList(fetchedContent.data);
      }
    } catch (err) {
      console.log("Some issue while fetching library content - ", err);
    }
    setLoading(false);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <Header showLogo={false} showBack={true} navigation={navigation} />

      {/* Body Section */}
      <ScrollView style={{ paddingHorizontal: wp(10) }}>
        <Text style={styles.pageTitle}>{library_name}</Text>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        {list.map((item) => (
          <>
            {console.log("check the item here - ", item)}
            <CourseCard
              type={item.content_type}
              title={item.content_type}
              pressHandler={() =>
                navigation.push("TaskScreen", { subCourse: item })
              }
            />
            {/* Sized Box */}
            <View style={{ height: hp(2) }} />
          </>
        ))}
      </ScrollView>
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
});

export default LibrarySub;
