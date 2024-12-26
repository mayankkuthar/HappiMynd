import React, { useState, useEffect, useContext } from "react";
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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import Header from "../../components/common/Header";
import InputField from "../../components/input/InputField";
import TextArea from "../../components/input/TextArea";
import Button from "../../components/buttons/Button";
import OutlineButton from "../../components/buttons/OutineButton";

const AddNote = (props) => {
  // Prop Destructuring
  const {
    navigation,
    route: { params },
  } = props;

  // State Variables
  const [noteTitle, setNoteTitle] = useState("");
  const [noteId, setNoteId] = useState(params?.id || null);
  const [note, setNote] = useState(params?.notes || "");
  const [loading, setLoading] = useState(false);

  // Context Variables
  const { addNote, updateNote, deleteNote, screenTrafficAnalytics } =
    useContext(Hcontext);

  // Mounting
  useEffect(() => {
    screenTrafficAnalytics({ screenName: "HappiSELF Notes Add Screen" });
  }, []);

  const submitAnswer = async () => {
    setLoading(true);
    try {
      const noteRes = await addNote({ note });

      console.log("Here the title - ", noteRes);
      if (noteRes.status === "success") {
        resetAllState();
        navigation.pop();
      }
    } catch (err) {
      console.log("Some issue while adding note - ", err);
    }
    setLoading(false);
  };

  const updateHandler = async () => {
    setLoading(true);
    try {
      // We need a note id to edit teh note
      if (!noteId) return;

      const noteRes = await updateNote({ id: noteId, note });
      if (noteRes.status === "success") {
        resetAllState();
        navigation.pop();
      }
    } catch (err) {
      console.log("Some issue while updating note - ", err);
    }
    setLoading(false);
  };

  const deleteHandler = async () => {
    setLoading(true);
    try {
      // We need a note id to edit teh note
      if (!noteId) return;

      const noteRes = await deleteNote({ id: noteId });
      if (noteRes.status === "success") {
        resetAllState();
        navigation.pop();
      }
    } catch (err) {
      console.log("Some issue while deleting note - ", err);
    }
    setLoading(false);
  };

  const resetAllState = () => {
    setNoteTitle("");
    setNoteId(null);
    setNote("");
    setLoading(false);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/language_background.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <KeyboardAwareScrollView>
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
            <Text style={styles.pageTitle}>Add Notes</Text>
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(2) }} />

          <View>
            {/* <InputField
              placeHolder="Add a heading here ..."
              value={noteTitle}
              onChangeText={(text) => setNoteTitle(text)}
            /> */}
            <TextArea
              placeHolder="Add your Note here ..."
              value={note}
              onChangeText={(text) => setNote(text)}
            />
          </View>

          {/* Sized Box */}
          <View style={{ height: hp(6) }} />

          {/* Save Button */}
          <View style={styles.saveButtonContainer}>
            {noteId ? (
              loading ? (
                <ActivityIndicator size="small" color={colors.loaderColor} />
              ) : (
                <>
                  <Button
                    text="Update"
                    pressHandler={updateHandler}
                    loading={loading}
                  />
                  {/* Sized Box */}
                  <View style={{ height: hp(2) }} />
                  <OutlineButton
                    text="Delete"
                    pressHandler={deleteHandler}
                    loading={loading}
                  />
                </>
              )
            ) : (
              <Button
                text="Save"
                pressHandler={submitAnswer}
                loading={loading}
              />
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
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
  saveButtonContainer: {
    // position: "relative",
    // bottom: hp(-35),
  },
});

export default AddNote;
