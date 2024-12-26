import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useFocusEffect } from "@react-navigation/native";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";

const NoteCard = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  const { id = null, notes = "" } = props.item;

  const cardTextLimit = 100; // The number of caracters that can be shown in container

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.push("AddNote", { id, notes })}
      style={styles.notesCardContainer}
    >
      <Text>
        {notes.length > cardTextLimit
          ? notes.substring(0, cardTextLimit) + " ..."
          : notes}
      </Text>
    </TouchableOpacity>
  );
};

const Notes = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // Context Variables
  const { getNotes, screenTrafficAnalytics } = useContext(Hcontext);

  // State Variables
  const [notesList, setNotesList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Focus Effect
  useFocusEffect(
    useCallback(() => {
      fetchNotes();
      screenTrafficAnalytics({ screenName: "HappiSELF Notes Screen" });
    }, [])
  );

  // // Mounting
  // useEffect(() => {
  //   fetchNotes();
  // }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const notesRes = await getNotes();
      console.log("check the notes res - ", notesRes);

      if (notesRes.status === "success" && notesRes?.data?.length) {
        setNotesList(notesRes.data);
      }
    } catch (err) {
      console.log("Some issue while fetching notes - ", err);
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
      <View style={{ paddingHorizontal: wp(10) }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.pageTitle}>Notes</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.push("AddNote")}
            style={styles.notesButton}
          >
            <Text style={styles.notesText}>Add Notes</Text>
          </TouchableOpacity>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        {/* Notes Listing */}
        <ScrollView>
          <View
            style={{
              height: hp(71),
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {notesList.length
              ? notesList.map((item) => (
                  <NoteCard item={item} key={item.id} navigation={navigation} />
                ))
              : null}
          </View>
        </ScrollView>
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
  notesButton: {
    borderWidth: 1,
    borderColor: colors.pageTitle,
    paddingVertical: hp(0.8),
    paddingHorizontal: hp(2),
    borderRadius: hp(10),
  },
  notesText: {
    fontSize: RFValue(11),
    fontFamily: "PoppinsMedium",
    color: colors.pageTitle,
  },
  notesCardContainer: {
    backgroundColor: colors.primary,
    marginTop: hp(1),
    padding: hp(1),
    borderRadius: hp(1),
    width: wp(39),
    height: hp(18),
  },
});

export default Notes;
