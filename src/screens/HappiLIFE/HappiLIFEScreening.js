import React, { useState, useEffect, useRef, useContext, memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
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
import AsyncStorage from "@react-native-async-storage/async-storage";

// Constants
import { colors } from "../../assets/constants";
import { Hcontext } from "../../context/Hcontext";

// Components
import ScreeningCard from "../../components/cards/ScreeningCard";
import ExitScreeningModal from "../../components/Modals/ExitScreeningModal";

const Header = (props) => {
  // Prop Destructuring
  const { backHandler } = props;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerBox}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={backHandler}
          // style={{ backgroundColor: "red" }}
        >
          <Ionicons name="ios-chevron-back" size={hp(4)} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HappiLIFEScreening = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // COntext Variables
  const {
    authState,
    authDispatch,
    startAssessment,
    submitAnswer,
    screenTrafficAnalytics,
  } = useContext(Hcontext);

  // State Varaibles
  const [showExitModal, setShowExitModal] = useState(false);
  const [screeningData, setScreeningData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [screenLoading, setScreenLoading] = useState(false);

  // Ref Variables
  const listRef = useRef();

  // Mounting
  useEffect(() => {
    initialMount();
  }, []);

  const initialMount = async () => {
    try {
      console.log("Screening mount log - ", props);

      getAssessment(authState.user.access_token);
      screenTrafficAnalytics({ screenName: "HappiLIFE Screening Assessment" });
    } catch (err) {
      console.log(
        "Some issue while initial mount (HappiLIFEScreening.js) - ",
        err
      );
    }
  };

  const getAssessment = async (token) => {
    setScreenLoading(true);
    setSelectedIndex(0);
    try {
      const data = await startAssessment({ token });
      console.log("The raw received data - ", data);
      const modifiedData = data.questions.map((item, index) => {
        return { ...item, disabled: index > 0, position: index };
      });
      console.log("The received assessment data - ", modifiedData);
      setScreeningData(modifiedData);
    } catch (err) {
      console.log("Some issue while getting assessment - ", err);
    }
    setScreenLoading(false);
  };

  if (screenLoading)
    return (
      <View
        style={{
          ...styles.container,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="small" color={colors.loaderColor} />
      </View>
    );

  return (
    <View style={styles.container}>
      <Header backHandler={() => setShowExitModal(true)} />

      <ExitScreeningModal
        showModal={showExitModal}
        setShowModal={setShowExitModal}
        navigation={navigation}
      />

      {/* Sized Box */}
      <View style={{ height: hp(1) }} />

      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: wp(10) }}>
          <Text style={styles.pageTitle}>HappiLIFE Awareness Tool</Text>
          <Text style={styles.pageSubTitle}>
            Answer these simple questions for an insightful emotional wellbeing
            summary
          </Text>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(2) }} />

        {/* Screening Questions */}
        <View style={{ flex: 1 }}>
          <ScrollView ref={listRef}>
            {screeningData.map((item, index) => (
              <View style={{ paddingHorizontal: wp(10) }}>
                <ScreeningCard
                  key={item.id}
                  listRef={listRef}
                  data={screeningData}
                  setData={setScreeningData}
                  item={item}
                  index={index}
                  selectedIndex={selectedIndex}
                  setSelectedIndex={setSelectedIndex}
                  getAssessment={getAssessment}
                  {...props}
                />
                <View style={{ height: hp(2) }} />
              </View>
            ))}
            <>
              <View style={{ height: hp(44) }} />
            </>
          </ScrollView>
          {/* <FlatList
            // ref={listRef}
            data={screeningData}
            // scrollEnabled={false}
            renderItem={({ item, index }) => (
              <View style={{ paddingHorizontal: wp(10) }}>
                <ScreeningCard
                  listRef={listRef}
                  data={screeningData}
                  setData={setScreeningData}
                  item={item}
                  index={index}
                  selectedIndex={selectedIndex}
                  setSelectedIndex={setSelectedIndex}
                  getAssessment={getAssessment}
                  {...props}
                />
                <View style={{ height: hp(2) }} />
              </View>
            )}
            keyExtractor={(item) => item.id}
            ListFooterComponent={() => (
              <>
                <View style={{ height: hp(44) }} />
              </>
            )}
          /> */}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    // flex: 1,
    height: hp(90),
  },
  headerContainer: {
    // backgroundColor: "red",
    width: wp(100),
    height: hp(14),
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerBox: {
    // backgroundColor: "yellow",
    width: wp(100),
    paddingHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pageTitle: {
    fontSize: RFValue(22),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  pageSubTitle: {
    fontSize: RFValue(10),
    fontFamily: "Poppins",
    color: colors.borderLight,
  },
});

export default memo(HappiLIFEScreening);
